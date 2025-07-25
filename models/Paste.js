import mongoose from 'mongoose';

const pasteSchema = new mongoose.Schema({
  pasteId: { type: String, unique: true },
  content: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date
});

export default mongoose.model('Paste', pasteSchema);
