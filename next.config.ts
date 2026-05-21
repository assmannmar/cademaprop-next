import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/propiedad-:id-:slug*',
        destination: '/propiedades/:id-casa-venta-:slug*',
        permanent: true, // 301 (permanente)
      }
    ]
  }
};

export default nextConfig;