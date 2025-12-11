"use client";
import { useState, useEffect } from "react";

const images = [
  "/img/1.jpg",
  "/img/2.jpg",
  "/img/3.jpg",
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-80 bg-red-500">
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
    </div>
  );
}
