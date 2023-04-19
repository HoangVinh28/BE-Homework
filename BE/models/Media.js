const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html
const mediaSchema = new Schema(
  {
    name: { type: String, required: [true,'Media bắt buộc phải nhập!'] },
    location: String,
  },
  {
    versionKey: false,
  },
);

const Media = model('Media', mediaSchema);

module.exports = Media;
