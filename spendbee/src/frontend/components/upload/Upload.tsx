import { useState, type ChangeEvent } from "react";
import styles from "./Upload.module.css";
import { Dashboard } from "../dashboard/Dashboard";
import type { SpendBeeAnalysis } from "../../../types/analysis";
import sampleAnalysis from "../../../sample.json";

export function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<SpendBeeAnalysis | null>(null);

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
    if (!file || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setAnalysis(data.analysis);
    } catch (err) {
      console.error(err);
      setError("Failed to upload file");
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeeExample = () => {
    setAnalysis(sampleAnalysis as SpendBeeAnalysis);
    setFile(null);
    setError("");
  };

  return (
    <div className={styles.UploadContainer}>
      {/* Upload Section */}
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

        <button onClick={handleUpload} disabled={!file || isLoading}>
          {isLoading ? "Loading..." : "Upload"}
        </button>

        <button onClick={handleSeeExample} className={styles.exampleBtn}>
          See Example
        </button>
      </div>

      {/* Dashboard Section */}
      <div className={styles.DashboardSection}>
        <Dashboard analysis={analysis} />
      </div>
    </div>
  );
}
