"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detectedImage, setDetectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post("http://localhost/api/v1/face-detection", formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      const imageBlob = new Blob([response.data], { type:'image/png' });
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setDetectedImage(imageObjectURL);
    } catch (error) {
      console.error('Error uplaoding file', error);
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Face Detection</h1>
        <input type="file" onChange={handleFileChange} />
        <Button onClick={handleUpload} disabled={!selectedFile || loading} variant="outline">
          {loading ? 'Processing...' : 'Upload'}
        </Button>
        {detectedImage && (
        <div style={{ marginTop: '20px' }}>
          <h2>Detected Faces</h2>
          <img src={detectedImage} alt="Detected faces" style={{ maxWidth: '100%' }} />
        </div>
      )}
      </div>
    </main>
  );
}
