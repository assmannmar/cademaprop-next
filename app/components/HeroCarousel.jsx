"use client";

import { useState, useEffect } from "react";

export default function HeroCarousel() {
  const images = [
    "/carousel/3.jpg",
    "/carousel/4.jpg",
    "/carousel/5.jpg",
    "/carousel/6.jpg"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return; 

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="carousel">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt="Imagen"
          className={`slide ${i === index ? "active" : ""}`}
        />
      ))}

      {/* Sombreado para que botones/textos se lean mejor */}
      <div className="carousel-overlay" />
    </div>
  );
}