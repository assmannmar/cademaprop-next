"use client";

import { useState, useEffect } from "react";

export default function HeroCarousel() {
  // 🔥 ACA DEFINIMOS LAS IMÁGENES
  const images = [
    "/carousel/1.webp",
    "/carousel/2.webp",
    "/carousel/3.webp",
    "/carousel/4.webp"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return; // seguridad

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-[450px] overflow-hidden">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt="Imagen"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* sombreado para que tus botones/textos se lean mejor */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
    </div>
  );
}
