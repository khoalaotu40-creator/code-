import express from "express";
import { getDb, saveDb } from "../config/db";
import { Post, PostComment } from "../src/types";
import { requireAuth } from "./auth";

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  const db = getDb();
  const sortedPosts = [...(db.posts || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json({ posts: sortedPosts });
});

router.post("/", requireAuth, (req, res) => {
  const { content, tag, image } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Nội dung bài viết không được để trống." });
  }

  const user = (req as any).user;
  const db = getDb();

  const newPost: Post = {
    id: `post-${Math.random().toString(36).substring(2, 9)}`,
    author: {
      fullName: user.fullName,
      avatar: user.avatar || user.fullName?.charAt(0) || "U",
      email: user.email
    },
    content,
    createdAt: new Date().toISOString(),
    likes: [],
    comments: [],
    tag: tag || undefined,
    image: image || undefined
  };

  db.posts = [newPost, ...(db.posts || [])];
  saveDb(db);

  res.json({ post: newPost });
});

router.post("/:id/like", requireAuth, (req, res) => {
  const db = getDb();
  const post = db.posts?.find((p: Post) => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: "Không tìm thấy bài viết." });
  }

  const user = (req as any).user;
  const userEmail = user.email;

  if (!post.likes) {
    post.likes = [];
  }

  const likeIndex = post.likes.indexOf(userEmail);
  if (likeIndex > -1) {
    post.likes.splice(likeIndex, 1);
  } else {
    post.likes.push(userEmail);
  }

  saveDb(db);
  res.json({ post });
});

router.post("/:id/comment", requireAuth, (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Nội dung bình luận không được để trống." });
  }

  const db = getDb();
  const post = db.posts?.find((p: Post) => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: "Không tìm thấy bài viết." });
  }

  const user = (req as any).user;
  const newComment: PostComment = {
    id: `c-${Math.random().toString(36).substring(2, 9)}`,
    author: {
      fullName: user.fullName,
      avatar: user.avatar || user.fullName?.charAt(0) || "U",
      email: user.email
    },
    content,
    createdAt: new Date().toISOString()
  };

  if (!post.comments) {
    post.comments = [];
  }

  post.comments.push(newComment);
  saveDb(db);

  res.json({ post });
});

router.put("/:id", requireAuth, (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Nội dung bài viết không được để trống." });
  }

  const db = getDb();
  const post = db.posts?.find((p: Post) => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: "Không tìm thấy bài viết." });
  }

  const user = (req as any).user;
  if (post.author.email !== user.email) {
    return res.status(403).json({ error: "Bạn không có quyền chỉnh sửa bài viết này." });
  }

  post.content = content;
  saveDb(db);
  res.json({ post });
});

router.delete("/:id", requireAuth, (req, res) => {
  const db = getDb();
  const postIndex = db.posts?.findIndex((p: Post) => p.id === req.params.id);
  if (postIndex === undefined || postIndex === -1) {
    return res.status(404).json({ error: "Không tìm thấy bài viết." });
  }

  const user = (req as any).user;
  const post = db.posts![postIndex];
  if (post.author.email !== user.email) {
    return res.status(403).json({ error: "Bạn không có quyền xóa bài viết này." });
  }

  db.posts!.splice(postIndex, 1);
  saveDb(db);
  res.json({ success: true });
});

export default router;
