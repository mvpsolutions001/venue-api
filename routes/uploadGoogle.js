import express from "express";
import multer from "multer";
import { uploadToDrive } from "../utils/google-drive.js";

const router = express.Router();

// store file in memory (NOT disk)
const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(`/uploads`, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const file = req.file;

    const result = await uploadToDrive(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    return res.json({
      success: true,
      url: result.url,
      fileId: result.fileId,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
});

export default router;
