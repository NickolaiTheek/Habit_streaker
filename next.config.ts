import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Ensure Next traces from this workspace and not a parent folder with another lockfile
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
