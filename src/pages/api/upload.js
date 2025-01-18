import multer from 'multer';
import cloudinary from '../../lib/cloudinary';
import connectDB from '../../lib/db';
import File from '../../models/File';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import fs from 'fs';

// Set up multer to temporarily store files locally before uploading to Cloudinary
const upload = multer({
  dest: './public/uploads/', // Temporary file storage
});

// Function to extract text from PDF
const extractTextFromPdf = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject('Error reading PDF file');
      }
      pdfParse(data).then((result) => {
        resolve(result.text);
      }).catch((error) => {
        reject(error);
      });
    });
  });
};

// Function to extract text from images using OCR
const extractTextFromImage = (imagePath) => {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(
      imagePath,
      'eng',
      {
        logger: (m) => console.log(m),
      }
    ).then(({ data: { text } }) => {
      resolve(text);
    }).catch((error) => {
      reject(error);
    });
  });
};

// API Route handler
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Connect to MongoDB
      await connectDB();

      // Create the multer middleware manually
      upload.single('file')(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error uploading file' });
        }

        // Upload the file to Cloudinary
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          resource_type: 'auto', // Automatically detect file type (image, pdf, etc.)
        });

        // Extract text if it's a PDF or image
        let extractedText = '';
        if (req.file.mimetype === 'application/pdf') {
          extractedText = await extractTextFromPdf(req.file.path);
        } else if (req.file.mimetype.startsWith('image/')) {
          extractedText = await extractTextFromImage(req.file.path);
        }

        // Save file details and extracted text to MongoDB
        const newFile = new File({
          filePath: `/uploads/${req.file.filename}`,
          fileType: req.file.mimetype,
          cloudinaryUrl: result.secure_url,
          extractedText, // Store the extracted text in DB
        });

        await newFile.save(); // Save to MongoDB

        // Send back the Cloudinary URL and extracted text (if applicable)
        res.status(200).json({
          filePath: result.secure_url,
          fileType: req.file.mimetype,
          extractedText: extractedText || 'No text extracted',
        });
      });
    } catch (error) {
      res.status(500).json({ error: 'Error uploading file to Cloudinary or saving to DB' });
    }
  } else {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
}

// Next.js API config
export const config = {
  api: {
    bodyParser: false, // Multer needs to handle the raw body
  },
};