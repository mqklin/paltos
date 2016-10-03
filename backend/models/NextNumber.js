import mongoose from 'mongoose';

export default mongoose.model('NextNumber', new mongoose.Schema({
  History: { type: Number, default: 1 },
}));
