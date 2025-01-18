import multer from 'multer';
import cloudinary from '../../lib/cloudinary';
import connectDB from '../../lib/db';
import File from '../../models/File';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import streamifier from 'streamifier';

// Function to extract text from PDF
const extractTextFromPdf = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    pdfParse(fileBuffer).then((result) => {
      resolve(result.text);
    }).catch((error) => {
      reject(error);
    });
  });
};

// Function to extract text from images using OCR
const extractTextFromImage = (imageBuffer) => {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(
      imageBuffer,
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

// Set up multer memory storage (no local file storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

        // Stream the file directly to Cloudinary from memory
        const stream = streamifier.createReadStream(req.file.buffer);
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { resource_type: 'auto' }, // Automatically detect file type (image, pdf, etc.)
          async (error, uploadResult) => {
            if (error) {
              return res.status(500).json({ error: 'Error uploading to Cloudinary' });
            }

            // Extract text if it's a PDF or image
            let extractedText = '';
            if (req.file.mimetype === 'application/pdf') {
              extractedText = await extractTextFromPdf(req.file.buffer);
            } else if (req.file.mimetype.startsWith('image/')) {
              extractedText = await extractTextFromImage(req.file.buffer);
            }

            // Save file details and extracted text to MongoDB
            const newFile = new File({
              filePath: uploadResult.secure_url,
              fileType: req.file.mimetype,
              cloudinaryUrl: uploadResult.secure_url,
              extractedText, // Store the extracted text in DB
            });

            await newFile.save(); // Save to MongoDB

            // Send back the Cloudinary URL and extracted text (if applicable)
            res.status(200).json({
              filePath: uploadResult.secure_url,
              fileType: req.file.mimetype,
              extractedText: extractedText || 'No text extracted',
            });
          }
        );

        // Pipe the file buffer to the Cloudinary upload stream
        stream.pipe(uploadStream);
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
