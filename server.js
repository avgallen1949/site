const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Middleware to serve static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Endpoint to handle image uploads
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// Endpoint to list all uploaded images
app.get('/images', (req, res) => {
  fs.readdir('uploads/', (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to list images' });
    }
    const imageUrls = files.map(file => `/uploads/${file}`);
    res.json(imageUrls);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
