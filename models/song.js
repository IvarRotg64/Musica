const mongoose = require('mongoose');

// Define the song schema
const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  genre: {
    type: String,
  },
  filePath: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Song model based on the schema
const Song = mongoose.model('Song', songSchema);

// Export the Song model
module.exports = Song;
