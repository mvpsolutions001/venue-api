import express from "express";
import multer from "multer";
import { uploadToDropbox } from "../utils/dropbox.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/uploads", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file" });
    }

    const result = await uploadToDropbox(
      req.file.buffer,
      req.file.originalname,
    );

    res.json({
      success: true,
      url: result.url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
});

export default router;
