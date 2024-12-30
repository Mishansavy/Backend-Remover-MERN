require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

// Configure multer
const upload = multer({ dest: "uploads/" });

// Endpoint to process images
app.post("/upload", upload.single("image"), async (req, res) => {
  const inputPath = path.join(__dirname, req.file.path);
  const outputPath = `uploads/output-${Date.now()}.png`;

  try {
    const inputImage = fs.readFileSync(inputPath);

    // Call remove.bg API
    const response = await axios({
      method: "post",
      url: "https://api.remove.bg/v1.0/removebg",
      data: {
        image_file_b64: inputImage.toString("base64"),
        size: "auto",
      },
      headers: {
        "X-Api-Key": process.env.REMOVE_BG_API_KEY,
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
    });

    // Save the output image
    fs.writeFileSync(outputPath, response.data);

    // Send the output image as a response
    res.download(outputPath, () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    console.error("Error removing background:", error.message);
    res.status(500).send("Background removal failed.");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
