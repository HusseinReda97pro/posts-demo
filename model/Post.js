const mongoose = require("mongoose");

// Create SCHEMA
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },

    details: {
      type: String,
      required: [true, "post description is required"],
      trim: true,
    },

    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create Model
const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
