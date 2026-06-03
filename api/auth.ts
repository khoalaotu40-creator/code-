import express from "express";
import { getDb, saveDb, SESSIONS, DEFAULT_USER } from "../config/db";

const router = express.Router();

export function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Chưa xác thực đăng nhập. Vui lòng đăng nhập hệ thống." });
  }
  const token = authHeader.split(" ")[1];
  const user = SESSIONS.get(token);
  if (!user) {
    return res.status(401).json({ error: "Phiên đăng nhập đã hết hạn hoặc không hợp lệ." });
  }
  (req as any).user = user;
  next();
}

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu." });
  }

  const db = getDb();
  if (!db.users) {
    db.users = [];
  }

  const defaultUserMatched = 
    (username === "khoalaotu40@gmail.com" && password === "password123") ||
    (username === "admin" && password === "admin123") ||
    (username === "se104" && password === "se104q28");
    
  const dbUser = db.users.find((u: any) => u.username === username && u.password === password);

  if (defaultUserMatched || dbUser) {
    const token = `token-${Math.random().toString(36).substring(2, 15)}`;
    let sessionUser;
    
    if (dbUser) {
        sessionUser = {
            ...DEFAULT_USER,
            username: dbUser.username,
            email: dbUser.email,
            fullName: dbUser.fullName,
            avatar: dbUser.avatar || dbUser.fullName.charAt(0)
        };
    } else {
        sessionUser = {
          ...DEFAULT_USER,
          username: username,
          email: username.includes("@") ? username : `${username}@se104.vn`,
          fullName: username === "khoalaotu40@gmail.com" ? "Khoa Lão Tứ" : (username === "admin" ? "Super Admin" : "SE104 Student")
        };
        sessionUser.avatar = sessionUser.fullName.charAt(0);
    }
    
    SESSIONS.set(token, sessionUser);
    return res.json({ token, user: sessionUser });
  }

  return res.status(401).json({ error: "Tài khoản hoặc mật khẩu không chính xác." });
});

router.post("/register", (req, res) => {
  const { username, password, fullName } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu." });
  }

  const db = getDb();
  if (!db.users) {
    db.users = [];
  }

  const existingDefault = ["khoalaotu40@gmail.com", "admin", "se104"].includes(username);
  const existingDb = db.users.find((u: any) => u.username === username);

  if (existingDefault || existingDb) {
    return res.status(400).json({ error: "Tài khoản đã tồn tại." });
  }

  const newUser = {
    username,
    password, 
    email: username.includes("@") ? username : `${username}@se104.vn`,
    fullName: fullName || username.split("@")[0] || "Người dùng",
  };

  db.users.push(newUser);
  saveDb(db);

  const token = `token-${Math.random().toString(36).substring(2, 15)}`;
  const sessionUser = {
    ...DEFAULT_USER,
    username: newUser.username,
    email: newUser.email,
    fullName: newUser.fullName,
    avatar: newUser.fullName.charAt(0)
  };
  SESSIONS.set(token, sessionUser);

  return res.json({ token, user: sessionUser });
});

router.get("/user", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Chưa đăng nhập" });
  }
  const token = authHeader.split(" ")[1];
  const user = SESSIONS.get(token);
  if (!user) {
    return res.status(401).json({ error: "Phiên đăng nhập hết hạn" });
  }
  return res.json({ user });
});

router.post("/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    SESSIONS.delete(token);
  }
  return res.json({ success: true, message: "Đăng xuất thành công" });
});

router.put("/avatar", requireAuth, (req, res) => {
  const { avatarBase64 } = req.body;
  if (!avatarBase64) {
    return res.status(400).json({ error: "Thiếu dữ liệu ảnh." });
  }

  const user = (req as any).user;
  const db = getDb();

  // Find user in db
  let dbUser = db.users.find((u: any) => u.username === user.username);
  
  // If default user not explicitly in db yet, add them so we can persist their avatar
  if (!dbUser) {
    dbUser = {
      username: user.username,
      password: "password123", // default or dummy since they matched default check
      email: user.email,
      fullName: user.fullName
    };
    db.users.push(dbUser);
  }

  // Update avatar
  dbUser.avatar = avatarBase64;
  saveDb(db);

  // Update session
  user.avatar = avatarBase64;
  
  return res.json({ success: true, user });
});

export default router;
