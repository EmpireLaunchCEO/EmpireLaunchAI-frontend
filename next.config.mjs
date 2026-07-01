/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone', // Disabled for Vercel native build optimization
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;