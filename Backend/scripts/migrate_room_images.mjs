import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// ensure models can be imported relative to project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// adjust path to models
import Room from '../models/Room.js';

const mongoUri = `${process.env.MONGODB_URI}/yatrighar`;

const normalizeImages = (images) => {
  if (!images) return [];
  // If images is an array
  if (Array.isArray(images)) {
    // If first element is an array (nested arrays)
    if (Array.isArray(images[0])) {
      // flatten one level and stringify entries
      return images[0].map((p) => String(p).trim()).filter(Boolean);
    }
    // If first element is comma-joined string
    if (typeof images[0] === 'string' && images[0].includes(',')) {
      return images[0].split(',').map((s) => s.trim()).filter(Boolean);
    }
    // Otherwise assume it's already an array of strings
    return images.map((p) => String(p).trim()).filter(Boolean);
  }
  // if it's a single string, maybe comma separated
  if (typeof images === 'string') {
    return images.split(',').map((s) => s.trim()).filter(Boolean);
  }
  // fallback
  return [];
};

const run = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB:', mongoUri);

    const rooms = await Room.find({});
    console.log('Found', rooms.length, 'rooms');

    let updated = 0;
    for (const room of rooms) {
      const normalized = normalizeImages(room.images);
      // only update when shape differs
      const isDifferent = Array.isArray(room.images)
        ? JSON.stringify(room.images) !== JSON.stringify(normalized)
        : true;

      if (normalized.length > 0 && isDifferent) {
        room.images = normalized;
        await room.save();
        updated++;
        console.log('Updated room', room._id);
      }
    }

    console.log(`Migration done. Updated ${updated} room(s).`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

run();
