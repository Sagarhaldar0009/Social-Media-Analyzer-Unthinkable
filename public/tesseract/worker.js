import Tesseract from 'tesseract.js';

Tesseract.createWorker({
  logger: (info) => console.log(info), // Optional: Logs progress
  corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core/tesseract-core-simd.wasm', // Specify the correct URL
});