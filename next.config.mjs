// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: true, // This allows Next.js to handle external ESM modules properly
  },
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   experimental: {
//     esmExternals: true, // This allows Next.js to handle external ESM modules properly
//   },
//   images: {
//     domains: ['img.dummyapi.io'], // Add the domain here
//   },
// };

// export default nextConfig;

