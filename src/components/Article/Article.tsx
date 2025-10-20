"use client";

import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import NextImage from "next/image";
import Styles from "./Article.module.css";
import Image from "next/image";

interface ArticleProps {
  onImageSelect: (base64: string) => void;
}

export interface ArticleRef {
  selectImage: () => void;
  takePhoto: () => void;
}

const Article = forwardRef<ArticleRef, ArticleProps>(({ onImageSelect }, ref) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>("");

  const handleSelectImageClick = () => fileInputRef.current?.click();
  const handleTakePhotoClick = () => cameraInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = document.createElement("img");
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 300;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          const base64 = canvas.toDataURL("image/jpeg", 0.7);
          setPreview(base64);
          onImageSelect(base64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // Expor funções para o Section.tsx
  useImperativeHandle(ref, () => ({
    selectImage: handleSelectImageClick,
    takePhoto: handleTakePhotoClick,
  }));

  return (
    <div className={Styles.divImage}>
      <p>Imagem</p>
      <div
        className={Styles.imageSelect}
        style={{ width: "120px", height: "120px", position: "relative" }}
      >
        {preview ? (
          <NextImage
            src={preview}
            alt="preview"
            fill
            style={{ objectFit: "cover", borderRadius: "8px" }}
            unoptimized
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
            }}
          >
            <Image src="/fotografica.png" alt="Logo da empresa" width={120} height={120} />
          </div>
        )}
      </div>

      {/* Inputs escondidos */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
});

Article.displayName = "Article";
export default Article;
