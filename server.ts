/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import apiRoutes from "./api";
import { createServer } from "http";
import { Server } from "socket.io";
import { dbEvents } from "./config/db";

const app = express();
const PORT = 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(express.json({ limit: "50mb" }));

// Main API Router
app.use("/api", apiRoutes);

dbEvents.on("db_changed", () => {
  io.emit("db_changed");
});

// --- Server and Frontend Mounting ---

async function startServer() {
  // Vite dev support vs production build serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is booted! Running on http://localhost:${PORT}`);
  });
}

startServer();
