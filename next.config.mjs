/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Fotos servidas desde Supabase Storage
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default nextConfig;
