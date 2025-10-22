import multer from 'multer';

// Configure multer to store files in memory (buffer)
// We'll upload them to Vercel Blob instead of disk
const storage = multer.memoryStorage();

// File filter to only accept images
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer with lower limit for Vercel serverless functions
// Vercel has a 4.5MB payload limit, so we set 4MB to be safe
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB max file size (Vercel serverless limit)
  },
});
