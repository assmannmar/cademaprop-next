import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/propiedad-:id([0-9]+)-:rest*',
        destination: '/propiedades/:id-casa-venta-:rest*',
        permanent: true,
      }
    ]
  }
};

export default nextConfig;