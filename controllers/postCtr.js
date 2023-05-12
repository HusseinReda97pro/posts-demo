const Post = require("../model/Post");
const User = require("../model/User");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const handlers = require("./handlersFactory");

// @desc Create Post
exports.createPost = asyncHandler(async (req, res) => {
  // Create The Post
  // req.body.author = req.user._id;
  // console.log(req.body);
  // console.log(req.file);
  // console.log(req.file.originalname);
  let image_url = `images/${req.file.filename}`;
  // console.log('image_url', image_url);
  const post = await Post.create({ title: req.body.title, details: req.body.details, image: image_url });
  // images/
  // Associate user to post
  // await User.findByIdAndUpdate(
  //   req.user._id,
  //   {
  //     $addToSet: { posts: post._id },
  //   },
  //   { new: true }
  // );

  console.log(req.image);;

  res.status(201).send(post);
});

// @desc Update Post
exports.updatePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) {
    return next(new apiError(`No Post for this id ${id}`));
  }

  // Check if The Post Belong To User
  if (post.author.toString() !== req.user._id.toString()) {
    return next(new apiError(`You are not allowed to update this post`, 403));
  }

  const doc = await Post.findOneAndUpdate(post._id, req.body, { new: true });

  res.status(200).json({ data: doc });
});

// @desc Get List of Posts
exports.allPosts = asyncHandler(async (req, res) => {
  console.log('value');
  let { page, limit } = req.query;
  if (!page) page = 0;
  if (!limit) limit = 10

  console.log(limit);
  console.log(skip);
  const posts = await Post.find().skip(page * limit).limit(limit);
  const postCount = (await Post.find()).length;



  res.status(200).json({ post_count: postCount, posts: posts });
});

// @desc Get a single post
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate("author");

  if (!post) {
    return next(new apiError(`No post for this id ${req.params.id}`, 404));
  }

  if (post.author.blocked.includes(req.user._id)) {
    return next(
      new apiError(`Sorry, You Are Not Allowed to Access This Post`, 403)
    );
  }

  res.send(post);
});

// @desc Delete Post
exports.deletePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post) {
    return next(new apiError(`No Post for this id ${id}`));
  }

  // Check if The Post Belong To User
  if (post.author.toString() !== req.user._id.toString()) {
    return next(new apiError(`You are not allowed to delete this post`, 403));
  }

  await Post.findByIdAndDelete(id);

  //
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { posts: post._id },
    },
    { new: true }
  );

  res.status(204).send();
});
