const express = require("express");
const Post = require("../model/Post");
const User = require("../model/User");
const router = express.Router();

//create post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  const savedPost = await newPost.save();
  res.status(200).json(savedPost);
});

//update post
router.put("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userId === req.body.userId) {
    await Post.updateOne({ $set: req.body });
    res.status(200).json("the post has been updated");
  } else {
    res.status(403).json("you can update only your post");
  }
});

//delete post
router.delete("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userId === req.body.userId) {
    await post.deleteOne();
    res.status(200).json("the post has been deleted");
  } else {
    res.status(403).json("you can delete only your post");
  }
});
//like/dislike post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//get post
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.status(200).json(post);
});
//get timeline post

router.get("/timeline/:userId", async (req, res) => {
  const currentUser = await User.findById(req.params.userId);
  const userPosts = await Post.find({ userId: currentUser._id });
  const friendPosts = await Promise.all(
    currentUser.followings.map((friendId) => {
      return Post.find({ userId: friendId });
    })
  );
  res.status(200).json(userPosts.concat(...friendPosts));

  res.status(500).json(err);
});

//get user's all posts

router.get("/profile/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  const posts = await Post.find({ userId: user._id });
  res.status(200).json(posts);
});

module.exports = router;
