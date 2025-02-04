import { useState, useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './App.css';

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processedImages, setProcessedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // state to track upload loading
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

  // Helper function: delay for a given time (in ms)
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Revised uploadImages: split selected files into batches
  const uploadImages = async () => {
    if (!selectedFiles.length) return;

    setIsLoading(true);
    const filesArray = Array.from(selectedFiles);
    const batchSize = 2; // Adjust batch size as needed
    const allResults = [];

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

        // Check if response is OK before parsing
        if (!response.ok) {
          console.error(`Batch starting at file ${i} failed with status:`, response.status);
          continue;
        }

        const data = await response.json();
        // Append results from this batch to overall results
        allResults.push(...data);
      } catch (error) {
        console.error("Error uploading batch:", error);
      }

      // Optionally add a short delay between batches
      await delay(500); // 500ms delay; adjust as needed
    }

    setProcessedImages(allResults);
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
      <h1 className="text-2xl">Supported File Types: </h1>
      <p>JPG / JPEG, PNG, JFIF, WebP & Transparent Backgrounds</p>
      <br />

      <div className="button-group">
        {/* Group file input and upload/loading button */}
        <div className="group-left">
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="file-input"
            onChange={handleFileChange}
          />

          {/* Upload Button */}
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

        {/* Group download button separately */}
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

      {/* Image preview area */}
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
