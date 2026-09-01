import type { NextConfig } from 'next';
import path from 'node:path';

// The kit ships TypeScript source (dist/*.ts), not compiled JS. Package
// "main"/"exports" used to point at missing .js files; alias the real entry
// so Turbopack and webpack resolve it.
const kitEntry = './node_modules/@appdirect/ds-prototype-kit/dist/index.ts';

const nextConfig: NextConfig = {
  transpilePackages: ['@appdirect/ds-prototype-kit'],
  turbopack: {
    resolveAlias: {
      '@appdirect/ds-prototype-kit': kitEntry,
      '@appdirect/ds-prototype-kit/css/foundations.css':
        './node_modules/@appdirect/ds-prototype-kit/dist/css/foundations.css',
      '@appdirect/ds-prototype-kit/css/mantine.css':
        './node_modules/@appdirect/ds-prototype-kit/dist/css/mantine.css',
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@appdirect/ds-prototype-kit': path.resolve(__dirname, kitEntry),
    };
    return config;
  },
};

export default nextConfig;
