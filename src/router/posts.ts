import {
  createPost,
  deletePost,
  getallUserPost,
  getPost,
  likePost,
  timelinePost,
  updatePost,
} from "../controller/posts";
const router = require("express").Router();

//create post
router.post("/", createPost);

//update post
router.put("/:id", updatePost);

//delete post
router.delete("/:id", deletePost);

//like/dislike post
router.put("/:id/like", likePost);

//get post
router.get("/:id", getPost);

//get timeline post
router.get("/timeline/:userId", timelinePost);

//get user's all posts
router.get("/profile/:username", getallUserPost);

export default router;
