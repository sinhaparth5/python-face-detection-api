"use client";

import { Image } from "@nextui-org/react";
import React, { ChangeEvent, useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Particles from "@/components/magicui/particles";
import { useTheme } from "next-themes";
import GradualSpacing from "@/components/magicui/text-space";

export default function Home() {
  const { theme } = useTheme();
  const [color, setColor ] = useState("#ffffff");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detectedImage, setDetectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);

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
      console.error('Error uploading file', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <GradualSpacing className="font-display text-center text-4xl font-bold tracking-[-0.1em]  text-black dark:text-white md:text-7xl md:leading-[5rem]" text="Face Detection" />
        <div className="justify-center">
        <input type="file" onChange={handleFileChange} />
        </div>
        <div className="justify-center">
        <Button onClick={handleUpload} disabled={!selectedFile || loading} variant="outline">
          {loading ? 'Processing...' : 'Upload'}
        </Button>
        </div>
        {detectedImage && (
        <div style={{ marginTop: '20px' }}>
          <h2>Detected Faces</h2>
          <Image src={detectedImage} alt="Detected faces" style={{ maxWidth: '100%' }} />
        </div>
      )}
      </div>
      <Particles className="absolute inset-0 -z-50" quantity={100} ease={80} color={color} refresh></Particles>
    </main>
  );
}
