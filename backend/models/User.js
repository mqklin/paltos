import mongoose from 'mongoose';

export default mongoose.model('User', new mongoose.Schema({
  name: String,
  vkid: { type: Number, unique: true },
  prize: { type: Number, default: 0 },
}));
