const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  winner: { type: String },
  duration: { type: String },
  playedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);
