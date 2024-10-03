import express from 'express';
import multer from 'multer';
import File from '../model/profilePic.js';  // Assuming this is the File schema
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import authenticateToken from '../middleware/authentication.js';

const router = express.Router();

// __dirname and __filename in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Folder where files will be saved
const uploadDir = path.join(__dirname, 'profilePics');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/profilePics',  // Adjusted to save in the correct folder
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload to accept any file with any field name
const upload = multer({
  storage: storage,
  limits: { fileSize: 50000000 },  // 5MB file size limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('profile');  // Accept files from any field name

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
}

// Route to upload files and save metadata to MongoDB
router.post('/upload', authenticateToken, async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send(err);
    }

    console.log(req.file);
    
    if (!req.file) {
      return res.status(400).send('No file selected!');
    }
    
    const file = req.file;
    const fileUrl = `http://localhost:5000/uploads/profilePics/${file.filename}`;
    const userId = req.user._id;
    
    try {
      // Find the existing file document for the user
      const existingFile = await File.findOne({ userId });
      
      if (existingFile) {
        // Delete the old file from the folder
        const oldFilePath = path.join(__dirname, '../uploads/profilePics', existingFile.profilePic.split('/').pop());
        fs.unlink(oldFilePath, (unlinkErr) => {
          if (unlinkErr) console.error(`Error deleting old file: ${unlinkErr.message}`);
        });

        // Delete the old file document from MongoDB
        await File.deleteOne({ userId });
      }

      // Create and save the new file document
      const newFile = new File({
        userId,
        profilePic: fileUrl
      });

      await newFile.save();
      
      res.send('Profile Pic uploaded successfully');
    } catch (saveErr) {
      res.status(500).send(`Error saving files: ${saveErr.message}`);
    }
  });
});

// Route to get the profile pic of the user
router.get('/get', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const file = await File.findOne({ userId });

    if (!file) {
      return res.status(404).send('Profile pic not found');
    }

    res.send(file.profilePic);
  } catch (err) {
    res.status(500).send(`Error getting profile pic: ${err.message}`);
  }
});

// Route to delete the profile pic of the user
router.delete('/delete', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const file = await File.findOne({ userId });

    if (!file) {
      return res.status(404).send('Profile pic not found');
    }

    // Delete the file from the folder
    const filePath = path.join(__dirname, '../uploads/profilePics', file.profilePic.split('/').pop());
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).send(`Error deleting file: ${err.message}`);
      }
    });

    // Delete the file document from MongoDB
    await File.deleteOne({ userId });

    res.send('Profile pic deleted successfully');
  } catch (err) {
    res.status(500).send(`Error deleting profile pic: ${err.message}`);
  }
});

export default router;
