import express from "express";
import fs from "fs";
import path from "path";
import upload from "../multer.js";

const router = express.Router();

// routes
// get
router.get("/", (req, res) => {
  res.render("index", { title: "File Explorer" });
});

// post
router.post("/", upload.array("files"), async (req, res) => {
  try {
    const filesData = req.files.map((file) => ({
      fileName: file.filename,
      category: req.body.category,
      size: (file.size / 1024).toFixed(2) + " KB",
      path: `/uploads/${file.filename}`,
    }));
    console.log("Files: ", filesData);
    const dataFilePath = path.join(path.resolve(), "public/uploads.json");
    let existingData = [];
    if (fs.existsSync(dataFilePath)) {
      const rawData = fs.readFileSync(dataFilePath);
      existingData = JSON.parse(rawData);
      console.log("Existing Data: ", existingData);
    }
    existingData.push(...filesData);
    fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2));
    res
      .status(200)
      .json({ message: "Files uploaded successfully!", files: filesData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading files", error: error.message });
  }
});

// patch
router.patch("/", async (req, res) => {});

// put
router.put("/", async (req, res) => {});

// delete
router.delete("/", async (req, res) => {
  const filePath = req.body.path;
  const dataFilePath = path.join(path.resolve(), "public/uploads.json");
  try {
    fs.unlinkSync(path.join(path.resolve(), `public/${filePath}`));
    const rawData = fs.readFileSync(dataFilePath);
    let existingData = JSON.parse(rawData);
    existingData = existingData.filter((file) => file.path !== filePath);
    fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2));
    res.status(200).json({ message: "File deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting file", error: error.message });
  }
});

export default router;
