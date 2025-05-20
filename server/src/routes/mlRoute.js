import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import path from "path";

const router = express.Router();

// Multer config — stores image in "uploads/" folder
const upload = multer({ dest: "src/uploads/" });

// POST route to accept image and send to Colab model
router.post("/analyze-image", upload.single("image"), async (req, res) => {



    console.log("api call");
  const filePath = req.file.path;

  // 🔁 Replace this with the ngrok URL from your Colab notebook
  const colabURL = "http://127.0.0.1:5008/predict/analyze-image";

  const form = new FormData();
  form.append("image", fs.createReadStream(filePath));

  try {
    const response = await axios.post(colabURL, form, { 
      headers: form.getHeaders(),
    });

    // Cleanup temp file
    fs.unlinkSync(filePath);

    res.json(response.data);
  } catch (error) {
    console.error("Error calling Colab:", error.message);
    res.status(500).json({ error: "Failed to connect to ML model" });
  }
});

export default router;
