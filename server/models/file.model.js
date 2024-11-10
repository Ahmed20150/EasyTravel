const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  username:{
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  base64: { type: String, required: true }, 
  metadata: {
    type: Object,
  },
});

const File = mongoose.model("File", fileSchema); //store in table "Tourist"

module.exports = File; //export for use in other files