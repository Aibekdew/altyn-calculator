// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://rent.kyrgyzaltyn.kg/api/:path*",
      },
    ];
  },
};

export default nextConfig;
