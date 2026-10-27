const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a track title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    artist: {
      type: String,
      required: [true, 'Please provide an artist name'],
      trim: true,
      maxlength: [100, 'Artist name cannot exceed 100 characters'],
    },
    album: {
      type: String,
      default: 'Single',
      trim: true,
    },
    genre: {
      type: String,
      required: [true, 'Please specify a genre'],
      default: 'Synthwave',
    },
    duration: {
      type: String,
      default: '3:30',
    },
    durationSec: {
      type: Number,
      default: 210,
    },
    releaseYear: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
    plays: {
      type: Number,
      default: 100,
    },
    likes: {
      type: Number,
      default: 0,
    },
    coverUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    },
    audioUrl: {
      type: String,
      default: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Search index on title, artist, album, and genre
trackSchema.index({ title: 'text', artist: 'text', album: 'text', genre: 'text' });

module.exports = mongoose.model('Track', trackSchema);
