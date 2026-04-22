const Post = require("../models/post")

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const post = await Post.create({
      title,
      content,
      user: req.user,
    });

    res.status(201).json({
      success: true,
      data: post,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "email");

    if (!posts.length) {
      return res.status(404).json({
        success: false,
        message: "No posts found",
      });
    }

    res.json({
      success: true,
      data: posts,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
};

const updatePost = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { returnDocument: "after" }
    );

    if (!post) {
      return res.status(403).json({
        success: false,
        message: "Post not found or you are not authorized",
      });
    }

    res.json({
      success: true,
      data: post,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update post",
    });
  }
};


const deletePost = async (req, res) => {
  try {

    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!post) {
      return res.status(403).json({
        success: false,
        message: "Post not found or you are not authorized",
      });
    }

    res.json({
      success: true,
      message: "Post deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete post",
    });
  }
};

module.exports = {deletePost,updatePost,getPosts,createPost}
