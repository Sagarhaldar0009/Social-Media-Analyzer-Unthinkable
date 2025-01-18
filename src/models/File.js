import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
  filePath: { type: String, required: true },
  fileType: { type: String, required: true },
  cloudinaryUrl: { type: String, required: true },
  extractedText: { type: String, default: '' }, // For storing extracted text (if applicable)
});

export default mongoose.models.File || mongoose.model('File', FileSchema);

