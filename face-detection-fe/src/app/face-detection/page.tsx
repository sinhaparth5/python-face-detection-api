"use client";

import { Image } from "@nextui-org/react";
import React, { ChangeEvent, useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Particles from "@/components/magicui/particles";
import { useTheme } from "next-themes";
import GradualSpacing from "@/components/magicui/text-space";
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header";

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
            const response = await axios.post("https://ai.pksinha.co.uk/api/v1/face-detection", formData, {
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
        <>
            <Header />
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <GradualSpacing className="font-display text-center text-4xl font-bold tracking-[-0.1em]  text-black dark:text-white md:text-7xl md:leading-[5rem]" text="Face Detection" />
                <div className="justify-center">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload
                        file</label>
                    <input onChange={handleFileChange}
                           className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                           id="file_input" type="file"/>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or WEBP</p>
                    <Badge variant="outline"
                           className="bg-gradient-to-r from-amber-400 via-red-500 to-indigo-600 bg-clip-text text-transparent">*Please
                        upload image below 1mb</Badge>
                </div>
                <div className="justify-center">
                    <Button onClick={handleUpload} disabled={!selectedFile || loading} variant="outline" className="mt-2">
                        {loading ? 'Processing...' : 'Upload'}
                    </Button>
                </div>
                {detectedImage && (
                    <div style={{marginTop: '20px'}}>
                        <h2>Detected Faces</h2>
                        <Image src={detectedImage} alt="Detected faces" style={{ maxWidth: '100%' }} />
                    </div>
                )}
            </div>
            <Particles className="absolute inset-0 -z-50" quantity={100} ease={80} color={color} refresh></Particles>
        </main>
            </>
    );
}
