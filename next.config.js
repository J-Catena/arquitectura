/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    images: {
        
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],

        
        formats: ["image/avif", "image/webp"],

        
        minimumCacheTTL: 60 * 60 * 24,
    },
};

export default nextConfig;
