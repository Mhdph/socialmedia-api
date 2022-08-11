import express, { Request, Response } from "express";
import Post from "../model/Post";
import User from "../model/User";

export const createPost = async (req: Request, res: Response) => {
  const newPost = new Post(req.body);
  const savedPost = await newPost.save();
  res.status(200).json(savedPost);
};

export const updatePost = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);
  if (post.userId === req.body.userId) {
    await Post.updateOne({ $set: req.body });
    res.status(200).json("the post has been updated");
  } else {
    res.status(403).json("you can update only your post");
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);
  if (post.userId === req.body.userId) {
    await post.deleteOne();
    res.status(200).json("the post has been deleted");
  } else {
    res.status(403).json("you can delete only your post");
  }
};

export const likePost = async (req: Request, res: Response) => {
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
};

export const getPost = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);
  res.status(200).json(post);
};

export const timelinePost = async (req: Request, res: Response) => {
  const currentUser = await User.findById(req.params.userId);
  const userPosts = await Post.find({ userId: currentUser._id });
  const friendPosts = await Promise.all(
    currentUser.followings.map((friendId: any) => {
      return Post.find({ userId: friendId });
    })
  );
  res.status(200).json(userPosts.concat(...friendPosts));

  res.status(500).json(err);
};

export const getallUserPost = async (req: Request, res: Response) => {
  const user = await User.findOne({ username: req.params.username });
  const posts = await Post.find({ userId: user._id });
  res.status(200).json(posts);
};

function err(err: any) {
  throw new Error("Function not implemented.");
}
