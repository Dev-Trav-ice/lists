import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs";

import { connectDb } from "./config/db.js";
import List from "./models/list.js";

const __dirname = path.resolve();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "10kb" }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
}

app.post("/api", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) return res.status(400).json({ error: "title cannot be empty" });

    await List.create({ title });

    return res.status(200).json({ message: "created Successfully" });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    });
  }
});

app.delete("/api/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: "No ID provided" });

    await List.findByIdAndDelete(id);

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    });
  }
});

app.get("/api", async (req, res) => {
  try {
    const lists = await List.find().sort({ createdAt: -1 });

    return res.status(200).json(lists);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
