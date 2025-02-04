import { useState, useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './App.css';

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processedImages, setProcessedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  // Open file dialog if needed
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Helper function to delay execution
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Revised uploadImages: process in batches, update UI after each batch
  const uploadImages = async () => {
    if (!selectedFiles.length) return;

    setIsLoading(true);
    // Convert FileList to Array
    const filesArray = Array.from(selectedFiles);
    // Increase batch size to 4 for faster throughput; adjust as needed
    const batchSize = 4;
    // Reduce delay between batches to 200ms; adjust as needed
    const delayMs = 200;

    // Clear any previous processed images
    setProcessedImages([]);

    for (let i = 0; i < filesArray.length; i += batchSize) {
      const batch = filesArray.slice(i, i + batchSize);
      const formData = new FormData();
      batch.forEach((file) => {
        formData.append("images", file);
      });

      try {
        const response = await fetch("/process", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          console.error(`Batch starting at file ${i} failed with status:`, response.status);
          continue;
        }

        const data = await response.json();
        // Append new results to the already processed images, updating UI progressively
        setProcessedImages((prev) => [...prev, ...data]);
      } catch (error) {
        console.error("Error uploading batch:", error);
      }

      // Short delay before processing the next batch
      await delay(delayMs);
    }

    setIsLoading(false);
  };

  const downloadAll = async () => {
    if (!processedImages.length) return;
    const zip = new JSZip();
    processedImages.forEach((img) => {
      zip.file(img.filename, img.data, { base64: true });
    });
    try {
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "processed_images.zip");
    } catch (err) {
      console.error("Error generating zip file:", err);
    }
  };

  // Utility to trigger a download for a single base64 image (if needed)
  const downloadImage = (data, filename) => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${data}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="App">
      <h1 className="text-5xl font-bold">Shoe Image Resizer</h1>
      <br />
      <h1 className="text-2xl">Supported File Types:</h1>
      <p>JPG / JPEG, PNG, JFIF, WebP & Transparent Backgrounds</p>
      <br />

      <div className="button-group">
        <div className="group-left">
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="file-input"
            onChange={handleFileChange}
          />
          {!isLoading && (
            <button onClick={uploadImages} className="btn btn-soft btn-primary">
              Upload and Process
            </button>
          )}
          {isLoading && (
            <button className="btn btn-soft btn-primary" disabled>
              <span className="loading loading-spinner"></span>
              Loading
            </button>
          )}
        </div>
        <div className="group-right">
          <button 
            onClick={downloadAll} 
            className="btn btn-outline btn-success download-btn"
            disabled={processedImages.length === 0}
          >
            Download All as ZIP
          </button>
        </div>
      </div>

      <div className="divider"></div>

      <div className="results-grid">
        {processedImages.map((img, idx) => (
          <div key={idx} className="result-item">
            <p className="file-name" title={img.filename}>{img.filename}</p>
            <img
              src={`data:image/png;base64,${img.data}`}
              alt={`Processed ${img.filename}`}
            />
            <button
              onClick={() => downloadImage(img.data, img.filename)}
              className="btn btn-xs btn btn-hidden"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
