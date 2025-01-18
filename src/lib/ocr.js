import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

export async function extractTextFromPDF(filePath) {
  const pdf = await pdfjsLib.getDocument({ url: filePath }).promise;
  const pageCount = pdf.numPages;
  let extractedText = '';

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    textContent.items.forEach((item) => {
      extractedText += item.str + ' ';
    });
  }

  return extractedText;
}

export async function extractTextFromImage(filePath) {
//   const worker = Tesseract.createWorker();
  const worker = Tesseract.createWorker({
    workerPath: process.env.NEXT_PUBLIC_TESSERACT_WORKER_PATH,
  });
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');

  const {
    data: { text },
  } = await worker.recognize(filePath);

  await worker.terminate();
  
  return text;
}
