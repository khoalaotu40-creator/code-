import express from "express";
import authRoutes from "./auth";
import boardRoutes from "./boards";
import postRoutes from "./posts";
import chatRoutes from "./chat";

const router = express.Router();

router.use("/", authRoutes);
router.use("/boards", boardRoutes);
router.use("/posts", postRoutes);
router.use("/chat", chatRoutes);

export default router;
