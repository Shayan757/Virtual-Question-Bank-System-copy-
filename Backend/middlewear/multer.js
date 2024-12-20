

// middleware/multer.js
const multer = require('multer');
const path = require('path');

// Set up storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure 'uploads' directory exists and has write permissions
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to only allow certain file types (optional)
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, and PNG images are allowed!'));
  }
};

// Apply the multer middleware
const upload = multer({ storage, fileFilter });
module.exports = upload;
