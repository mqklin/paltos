import mongoose from 'mongoose';

export default mongoose.model('History', new mongoose.Schema({
  number: { type: Number, unique: true },
  members: [{
    name: String,
    vkid: String,
    points: Number,
    isWinner: Boolean,
    prize: {
      type: Number,
      default: 0,
    },
  }],
}));



