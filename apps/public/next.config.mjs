/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ayasofyazilim/upwithcrowd-saas', "@ayasofyazilim/core-saas"],
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.devtunnels.ms:3000"],
    },
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [{
      protocol: "https",
      port: '',
      hostname: "placehold.co"
    }],
  }
};

export default nextConfig;
