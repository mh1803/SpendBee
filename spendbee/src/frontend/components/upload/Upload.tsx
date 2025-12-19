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
    } catch {
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
      <section className={styles.UploadSection}>
        <div className={styles.uploadCard}>
          <h2>Upload your bank statement</h2>
          <p className={styles.subtitle}>
            CSV or PDF • Secure • Processed instantly
          </p>

          <label className={styles.dropzone}>
            <input
              id="fileInput"
              type="file"
              accept=".csv, application/pdf"
              onChange={handleFileChange}
              hidden
            />
            <div className={styles.dropContent}>
              <span className={styles.icon}>📄</span>
              <p>
                <strong>Click to upload</strong> or drag & drop
              </p>
              <span className={styles.hint}>CSV or PDF only</span>
            </div>
          </label>

          {file && (
            <div className={styles.fileInfo}>
              <span>{file.name}</span>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={handleRemove}
              >
                Remove
              </button>
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleUpload}
              disabled={!file || isLoading}
            >
              {isLoading ? "Analysing..." : "Analyse statement"}
            </button>

            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleSeeExample}
            >
              View example
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      {analysis && (
        <section className={styles.DashboardSection}>
          <Dashboard analysis={analysis} />
        </section>
      )}
    </div>
  );
}
