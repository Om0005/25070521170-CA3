const Track = require('../models/Track');
const { isDbConnected } = require('../config/db');

const INITIAL_SEED_TRACKS = [
  {
    title: 'Neon Odyssey',
    artist: 'CyberPulse',
    album: 'Future Horizon 2099',
    genre: 'Synthwave',
    duration: '3:45',
    durationSec: 225,
    releaseYear: 2024,
    plays: 14200,
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    featured: true,
    likes: 428,
  },
  {
    title: 'Midnight Rainfall Lo-Fi',
    artist: 'Aura Bloom',
    album: 'Chilled Tokyo Nights',
    genre: 'Lo-Fi',
    duration: '2:52',
    durationSec: 172,
    releaseYear: 2024,
    plays: 28900,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    featured: true,
    likes: 914,
  },
  {
    title: 'Electric Velocity',
    artist: 'HyperDrive',
    album: 'Overclocked Dreams',
    genre: 'Electronic',
    duration: '4:12',
    durationSec: 252,
    releaseYear: 2023,
    plays: 9540,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    featured: false,
    likes: 312,
  },
  {
    title: 'Acoustic Solitude',
    artist: 'Elena Rivers',
    album: 'Timber & Strings',
    genre: 'Acoustic',
    duration: '3:18',
    durationSec: 198,
    releaseYear: 2024,
    plays: 18230,
    coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    featured: true,
    likes: 720,
  },
  {
    title: 'Deep Ocean Echoes',
    artist: 'Submerged',
    album: 'Abyssal Frequencies',
    genre: 'Ambient',
    duration: '4:40',
    durationSec: 280,
    releaseYear: 2023,
    plays: 7420,
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    featured: false,
    likes: 184,
  },
  {
    title: 'Solar Flare Groove',
    artist: 'Cosmic Funk Trio',
    album: 'Starlight Disco',
    genre: 'Funk / Pop',
    duration: '3:32',
    durationSec: 212,
    releaseYear: 2024,
    plays: 34100,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    featured: true,
    likes: 1250,
  },
];

let inMemoryTracks = INITIAL_SEED_TRACKS.map((t, idx) => ({
  _id: 'track_' + (100 + idx),
  ...t,
  createdAt: new Date().toISOString(),
}));

const autoSeedDatabase = async () => {
  if (!isDbConnected()) return;
  try {
    const count = await Track.countDocuments();
    if (count === 0) {
      console.log('Seeding initial track catalog...');
      await Track.insertMany(INITIAL_SEED_TRACKS);
      console.log(`Seeded ${INITIAL_SEED_TRACKS.length} tracks.`);
    }
  } catch (err) {
    console.warn('Auto-seed error:', err.message);
  }
};

// @desc    Get all tracks (with optional genre & search filters)
// @route   GET /api/tracks
// @access  Public
const getTracks = async (req, res) => {
  try {
    const { genre, search } = req.query;

    if (isDbConnected()) {
      let filter = {};

      if (genre && genre !== 'All') {
        filter.genre = { $regex: new RegExp(`^${genre}$`, 'i') };
      }

      if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [
          { title: regex },
          { artist: regex },
          { album: regex },
          { genre: regex },
        ];
      }

      const tracks = await Track.find(filter).sort({ createdAt: -1 });
      return res.status(200).json(tracks);
    } else {
      let results = [...inMemoryTracks];

      if (genre && genre !== 'All') {
        results = results.filter(
          (t) => t.genre.toLowerCase() === genre.toLowerCase()
        );
      }

      if (search) {
        const q = search.toLowerCase();
        results = results.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.artist.toLowerCase().includes(q) ||
            t.album.toLowerCase().includes(q) ||
            t.genre.toLowerCase().includes(q)
        );
      }

      return res.status(200).json(results);
    }
  } catch (err) {
    console.error('Error fetching tracks:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single track by ID
// @route   GET /api/tracks/:id
// @access  Public
const getTrackById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const track = await Track.findById(id);
      if (!track) {
        return res.status(404).json({ success: false, message: 'Track not found' });
      }
      return res.status(200).json(track);
    } else {
      const track = inMemoryTracks.find((t) => t._id === id);
      if (!track) {
        return res.status(404).json({ success: false, message: 'Track not found' });
      }
      return res.status(200).json(track);
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a new track
// @route   POST /api/tracks
// @access  Public
const createTrack = async (req, res) => {
  try {
    const { title, artist, album, genre, duration, coverUrl, audioUrl, releaseYear } = req.body;

    if (!title || !artist) {
      return res.status(400).json({
        success: false,
        message: 'Title and artist are required',
      });
    }

    if (isDbConnected()) {
      const newTrack = await Track.create({
        title,
        artist,
        album: album || 'Single',
        genre: genre || 'Synthwave',
        duration: duration || '3:30',
        coverUrl: coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        audioUrl: audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        releaseYear: releaseYear || new Date().getFullYear(),
        createdBy: req.user?._id,
      });

      return res.status(201).json(newTrack);
    } else {
      const newTrack = {
        _id: 'track_' + Date.now(),
        title,
        artist,
        album: album || 'Single',
        genre: genre || 'Synthwave',
        duration: duration || '3:30',
        coverUrl: coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        audioUrl: audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        releaseYear: releaseYear || new Date().getFullYear(),
        plays: 0,
        likes: 0,
        featured: false,
        createdAt: new Date().toISOString(),
      };
      inMemoryTracks.unshift(newTrack);

      return res.status(201).json(newTrack);
    }
  } catch (err) {
    console.error('Error creating track:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update an existing track
// @route   PUT /api/tracks/:id
// @access  Public
const updateTrack = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const track = await Track.findByIdAndUpdate(id, req.body, {
        returnDocument: 'after',
        runValidators: true,
      });

      if (!track) {
        return res.status(404).json({ success: false, message: 'Track not found' });
      }

      return res.status(200).json(track);
    } else {
      const index = inMemoryTracks.findIndex((t) => t._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Track not found' });
      }

      inMemoryTracks[index] = { ...inMemoryTracks[index], ...req.body };
      return res.status(200).json(inMemoryTracks[index]);
    }
  } catch (err) {
    console.error('Error updating track:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete a track
// @route   DELETE /api/tracks/:id
// @access  Public
const deleteTrack = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const track = await Track.findByIdAndDelete(id);
      if (!track) {
        return res.status(404).json({ success: false, message: 'Track not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Track deleted successfully',
      });
    } else {
      const initialLength = inMemoryTracks.length;
      inMemoryTracks = inMemoryTracks.filter((t) => t._id !== id);

      if (inMemoryTracks.length === initialLength) {
        return res.status(404).json({ success: false, message: 'Track not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Track deleted successfully',
      });
    }
  } catch (err) {
    console.error('Error deleting track:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getTracks,
  getTrackById,
  createTrack,
  updateTrack,
  deleteTrack,
  autoSeedDatabase,
};
