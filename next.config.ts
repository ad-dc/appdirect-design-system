import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old Revenue Ops PoC deep links; index stays at /prototype and renders README.
      {
        source: "/prototype/:slug+",
        destination: "/",
        permanent: false,
      },
    ];
  },
  turbopack: {
    resolveAlias: {
      '@appdirect/design-tokens/css/foundations.css': './node_modules/@appdirect/design-tokens/dist/css/foundations.css',
      '@appdirect/design-tokens/css/mantine.css': './node_modules/@appdirect/design-tokens/dist/css/mantine.css',
    },
  },
};

export default nextConfig;
