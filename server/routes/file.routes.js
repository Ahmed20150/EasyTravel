const express = require('express');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
let { conn, gfs , mongoURI, getGFS} = require('../config/db');
const File = require('../models/file.model');

const router = express.Router();

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = file.originalname;
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads',
          };
          resolve(fileInfo);
        });
      });
    },
    options: { useUnifiedTopology: true },
  });

const upload = multer({ storage });



//upload Route
router.post('/upload', async (req, res) => {
  try {
    const { filename, username, contentType, base64 } = req.body;

    if (!filename || !contentType || !base64) {
      return res.status(400).send('Missing required fields');
    }

    const file = new File({
      filename,
      username,
      contentType,
      length: Buffer.byteLength(base64, 'base64'),
      base64,
      metadata: req.body.metadata || {},
    });

    await file.save();

    res.status(201).send({ file });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).send('File upload failed');
  }
});



// // Delete All Records Route
// router.delete('/deleteAll', async (req, res) => {
//   try {
//     const db = mongoose.connection.db;
//     await db.collection('uploads.chunks').deleteMany({});
//     await db.collection('uploads.files').deleteMany({});
//     await db.collection('files').deleteMany({});
//     res.status(200).send('All records deleted');
//   } catch (error) {
//     console.error('Error deleting records:', error);
//     res.status(500).send('Error deleting records');
//   }
// });

// Fetch Base64 String Route
router.get('/getbasestring', async (req, res) => {
  try {
    const {username}  = req.query;
    const file = await File.findOne({ username });

    if (!file) {
      return res.status(404).json({ err: 'NO FILE IS THERE' });
    }

    res.status(200).json({ base64: file.base64 });
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).send('Error fetching file');
  }
});



module.exports = router;