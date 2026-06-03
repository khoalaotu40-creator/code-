import express from "express";
import { getDb, saveDb } from "../config/db";
import { Board } from "../src/types";
import { requireAuth } from "./auth";

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  const db = getDb();
  const user = (req as any).user;
  
  const userBoards = db.boards.filter((b: Board) => {
    return !b.owner || b.owner === user.email || b.members?.includes(user.email);
  });

  res.json({ boards: userBoards });
});

router.get("/:id", requireAuth, (req, res) => {
  const db = getDb();
  const user = (req as any).user;
  const board = db.boards.find((b: Board) => b.id === req.params.id);
  
  if (!board) {
    return res.status(404).json({ error: "Không tìm thấy bảng công việc yêu cầu." });
  }

  if (board.owner && board.owner !== user.email && !board.members?.includes(user.email)) {
    return res.status(403).json({ error: "Bạn không có quyền truy cập bảng công việc này." });
  }

  board.lastViewedAt = new Date().toISOString();
  saveDb(db);

  res.json({ board });
});

router.post("/", requireAuth, (req, res) => {
  const { title, bgGradient, type, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Tiêu đề bảng là bắt buộc." });
  }

  const user = (req as any).user;
  const db = getDb();
  const id = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

  const newBoard: Board = {
    id,
    title,
    bgGradient: bgGradient || "from-primary-fixed-dim to-surface-container-lowest",
    type: type || "personal",
    description: description || "",
    isFavorite: false,
    owner: user.email,
    lastViewedAt: new Date().toISOString(),
    lists: [
      { id: `l-${id}-1`, title: "Cần làm", tasks: [] },
      { id: `l-${id}-2`, title: "Đang làm", tasks: [] },
      { id: `l-${id}-3`, title: "Hoàn thành", tasks: [] }
    ]
  };

  db.boards.push(newBoard);
  saveDb(db);

  res.json({ board: newBoard });
});

router.put("/:id", requireAuth, (req, res) => {
  const db = getDb();
  const user = (req as any).user;
  const index = db.boards.findIndex((b: Board) => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Không tìm thấy bảng để cập nhật." });
  }

  if (db.boards[index].owner && db.boards[index].owner !== user.email && !db.boards[index].members?.includes(user.email)) {
    return res.status(403).json({ error: "Bạn không có quyền cập nhật bảng này." });
  }

  db.boards[index] = {
    ...db.boards[index],
    ...req.body
  };

  saveDb(db);
  res.json({ board: db.boards[index] });
});

router.post("/:id/members", requireAuth, (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email là bắt buộc." });
  }

  const db = getDb();
  const user = (req as any).user;
  const board = db.boards.find((b: Board) => b.id === req.params.id);

  if (!board) {
    return res.status(404).json({ error: "Không tìm thấy bảng công việc." });
  }

  if (board.owner !== user.email) {
    return res.status(403).json({ error: "Chỉ chủ sở hữu (owner) mới có quyền thêm người khác." });
  }

  if (!board.members) {
    board.members = [board.owner];
  }

  if (board.members.includes(email)) {
    return res.status(400).json({ error: "Người dùng này đã nằm trong dự án." });
  }

  board.members.push(email);
  
  if (board.type === "personal" && board.members.length > 1) {
    board.type = "team";
  }

  saveDb(db);
  res.json({ success: true, message: "Thêm thành viên thành công.", board });
});

router.delete("/:id", requireAuth, (req, res) => {
  const db = getDb();
  const user = (req as any).user;
  const index = db.boards.findIndex((b: Board) => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Không tìm thấy bảng để xóa." });
  }

  const board = db.boards[index];
  // Verify access before allowing deletion
  if (board.owner && board.owner !== user.email && !board.members?.includes(user.email)) {
    return res.status(403).json({ error: "Bạn không có quyền xóa bảng này." });
  }

  db.boards.splice(index, 1);
  saveDb(db);
  res.json({ success: true, message: "Đã xóa bảng thành công." });
});

router.post("/:id/chat", requireAuth, (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Nội dung chat không được trống." });
  }

  const db = getDb();
  const user = (req as any).user;
  const board = db.boards.find((b: Board) => b.id === req.params.id);

  if (!board) {
    return res.status(404).json({ error: "Không tìm thấy bảng công việc." });
  }

  if (board.owner !== user.email && !board.members?.includes(user.email)) {
    return res.status(403).json({ error: "Bạn không có quyền chat trong bảng này." });
  }

  if (!board.chatMessages) {
    board.chatMessages = [];
  }

  const newMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2,6)}`,
    sender: {
      fullName: user.fullName || "User",
      email: user.email
    },
    content: content.trim(),
    createdAt: new Date().toISOString()
  };

  board.chatMessages.push(newMessage);
  saveDb(db);

  res.json({ success: true, message: newMessage });
});

export default router;
