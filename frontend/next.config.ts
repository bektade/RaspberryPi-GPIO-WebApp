import type { NextConfig } from "next";

const apiUrl = process.env.API_URL ?? "http://127.0.0.1:5000";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/gpio",
        destination: `${apiUrl}/api/gpio`,
      },
    ];
  },
};

export default nextConfig;
