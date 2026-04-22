const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} = require("../controllers/postControllers");

router.use(auth);

router.post("/", createPost);
router.get("/", getPosts);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;