import { useState, type ChangeEvent } from "react";
import styles from "./Upload.module.css";
import { Dashboard } from "../dashboard/Dashboard";

export function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const allowedTypes = ["application/pdf", "text/csv"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only PDF or CSV files are allowed.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError("");
    setAnalysis(null);
  };

  const handleRemove = () => {
    setFile(null);
    setError("");
    setAnalysis(null);
    const input = document.getElementById("fileInput") as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setAnalysis(null);
      } else {
        setAnalysis(data.analysis);
        setError("");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to upload file");
      setAnalysis(null);
    }
  };

  return (
    <div className={styles.UploadSection}>
      <h2>Upload a CSV or PDF file</h2>

      <input
        id="fileInput"
        type="file"
        accept=".csv, application/pdf"
        onChange={handleFileChange}
      />

      {file && (
        <div className={styles.fileInfo}>
          <p>Selected file: {file.name}</p>
          <button onClick={handleRemove} className={styles.removeBtn}>
            Remove
          </button>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <button onClick={handleUpload} disabled={!file}>
        Upload
      </button>

      {/* Render Dashboard */}
      {analysis && <Dashboard analysis={analysis} />}
    </div>
  );
}
