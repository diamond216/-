import type { NextConfig } from "next";

// Static export: `next build` writes plain files to out/. The scaffold's cacheComponents and
// partialPrefetching options are left out because they can't be used with output: "export".
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
