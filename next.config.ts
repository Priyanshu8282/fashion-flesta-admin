import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fashion-flesta-backend-91rm.onrender.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;