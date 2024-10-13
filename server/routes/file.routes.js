const express = require('express');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const { conn, gfs , mongoURI} = require('../config/db');
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

// Upload Route
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const { originalname, mimetype, size } = req.file;
    const file = new File({
      filename: originalname,
      contentType: mimetype,
      length: size,
      metadata: req.body.metadata || {},
    });

    await file.save();

    res.status(201).send({ file });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).send('File upload failed');
  }
});

// Download Route
// router.get('/download/:id', async (req, res) => {
//   try {
//     const file = await File.findById(req.params.id);
//     if (!file) {
//       return res.status(404).json({ err: 'No file exists' });
//     }

//     gfs.files.findOne({ filename: file.filename }, (err, gridFile) => {
//       if (!gridFile || gridFile.length === 0) {
//         return res.status(404).json({ err: 'No file exists in GridFS' });
//       }

//       const readstream = gfs.createReadStream({ filename: file.filename });
//       res.set('Content-Type', file.contentType);
//       res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
//       readstream.pipe(res);
//     });
//   } catch (error) {
//     console.error('Error downloading file:', error);
//     res.status(500).send('Error downloading file');
//   }
// });

// // Download Last Uploaded File Route
// router.get('/download/latest', async (req, res) => {
//     try {
//       const file = await File.findOne().sort({ uploadDate: -1 });
//       if (!file) {
//         return res.status(404).json({ err: 'No file exists' });
//       }
  
//       gfs.file.findOne({ filename: file.filename }, (err, gridFile) => {
//         if (!gridFile || gridFile.length === 0) {
//           return res.status(404).json({ err: 'No file exists in GridFS' });
//         }
  
//         const readstream = gfs.createReadStream({ filename: file.filename });
//         res.set('Content-Type', file.contentType);
//         res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
//         readstream.pipe(res);
//       });
//     } catch (error) {
//       console.error('Error downloading file:', error);
//       res.status(500).send('Error downloading file');
//     }
//   });

// Download File by Filename Route
router.get('/download/filename/:filename', async (req, res) => {
    try {
      const { filename } = req.params;
      const file = await File.findOne({ filename });
      if (!file) {
        return res.status(404).json({ err: 'No file exists' });
      }
  
      if (!gfs) {
        return res.status(500).send('GridFS not initialized');
      }
  
      gfs.files.findOne({ filename: file.filename }, (err, gridFile) => {
        if(err){
            console.error('Error finding file in GridFS:', err);
            return res.status(500).send('Error finding file in GridFS');
        }
        if (!gridFile || gridFile.length === 0) {
          return res.status(404).json({ err: 'No file exists in GridFS' });
        }
  
        const readstream = gfs.createReadStream({ filename: file.filename });
        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
        readstream.pipe(res);
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).send('Error downloading file');
    }
  });

module.exports = router;