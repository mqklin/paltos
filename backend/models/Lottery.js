import mongoose from 'mongoose';

export default mongoose.model('Lottery', new mongoose.Schema({
  prizes: [{
    count: Number,
    sum: Number,
  }],
  post_id: Number,
  post_hash: String,
  members: {
    type: [{
      name: String,
      vkid: { type: Number, unique: true },
      points: {
        type: Number,
        default: 1,
      },
    }],
  },
}));

