import { extractTextFromPDF, extractTextFromImage } from '@/lib/ocr';
import { dbConnect } from '@/lib/db';
import ExtractedText from '@/models/File';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filePath, fileType } = req.body;

  try {
    let extractedText = '';

    if (fileType === 'application/pdf') {
      extractedText = await extractTextFromPDF(filePath);
    } else if (fileType.startsWith('image/')) {
      extractedText = await extractTextFromImage(filePath);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    // Save to database
    await dbConnect();
    const savedText = await ExtractedText.create({ filePath, fileType, extractedText });

    return res.status(200).json({ id: savedText._id, extractedText });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to extract text' });
  }
}

