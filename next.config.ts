import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local /public/images/* paths are used — no remote patterns needed.
    remotePatterns: [],
  },
};

export default nextConfig;
