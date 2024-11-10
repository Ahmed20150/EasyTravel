const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const mongoURI = 'mongodb+srv://ahmed1gasser:jxaauvDrMDrxvUQS@acl.05st6.mongodb.net/?retryWrites=true&w=majority&appName=ACL';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
});

const conn = mongoose.connection;
let gfs;
const initGridFS = new Promise((resolve, reject) => {
  const conn = mongoose.connection;
  conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    console.log('Connected to GridFS');
    resolve(gfs);
  });
});

const getGFS = async () => {
  if (!gfs) {
    await initGridFS;
  }
  return gfs;
};

module.exports = { initGridFS, getGFS, conn, gfs , mongoURI};