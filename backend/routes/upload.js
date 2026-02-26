const router = require('express').Router();
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // If Cloudinary not configured, return a placeholder
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.json({ url: `https://placehold.co/800x600/f59e0b/ffffff?text=Room+Image` });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'nestbud', resource_type: 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
