import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

function App() {
  const [file, setFile] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setProcessedImage(null);
    setError(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          responseType: "blob",
        }
      );

      const imageUrl = URL.createObjectURL(new Blob([response.data]));
      setProcessedImage(imageUrl);
      setSuccess(true);
    } catch (err) {
      setError("Failed to process the image. Please try again.");
      console.error("Error uploading file:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "processed-image.png";
    link.click();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>
        AI Background Remover
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Easily remove backgrounds from your images with AI technology.
      </Typography>

      <Box>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="upload-input"
        />
        <label htmlFor="upload-input">
          <Button
            variant="outlined"
            component="span"
            color="primary"
            sx={{ mr: 2 }}
          >
            Choose Image
          </Button>
        </label>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUpload}
          disabled={!file || loading}
        >
          Upload
        </Button>
      </Box>

      {loading && (
        <Box sx={{ mt: 4 }}>
          <CircularProgress />
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Processing your image...
          </Typography>
        </Box>
      )}

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {file && (
          <Grid item xs={12} sm={6}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={URL.createObjectURL(file)}
                alt="Uploaded"
              />
              <CardContent>
                <Typography variant="h6">Uploaded Image</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {processedImage && (
          <Grid item xs={12} sm={6}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={processedImage}
                alt="Processed"
              />
              <CardContent>
                <Typography variant="h6">Processed Image</Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleDownload}
                  sx={{ mt: 2 }}
                >
                  Download Image
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      )}

      {success && (
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
        >
          <Alert severity="success" onClose={() => setSuccess(false)}>
            Image processed successfully!
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
}

export default App;
