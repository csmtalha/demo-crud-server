/** @format */

const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    selectedFile: {
      type: String,
      required: true,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    likes: [{ type: ObjectId, ref: 'User' }],
    postedBy: {
      type: ObjectId,
      ref: 'User',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
