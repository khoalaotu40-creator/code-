import express from "express";
import authRoutes from "./auth";
import boardRoutes from "./boards";
import postRoutes from "./posts";

const router = express.Router();

router.use("/", authRoutes);
router.use("/boards", boardRoutes);
router.use("/posts", postRoutes);

export default router;
