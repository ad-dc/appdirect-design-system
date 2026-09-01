import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@appdirect/ds-prototype-kit'],
  turbopack: {
    resolveAlias: {
      '@appdirect/ds-prototype-kit/css/foundations.css':
        './node_modules/@appdirect/ds-prototype-kit/dist/css/foundations.css',
      '@appdirect/ds-prototype-kit/css/mantine.css':
        './node_modules/@appdirect/ds-prototype-kit/dist/css/mantine.css',
    },
  },
};

export default nextConfig;
