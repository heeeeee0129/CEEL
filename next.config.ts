import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Firebase Storage / Google 이미지 등 외부 원격 이미지 허용
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**', // Firebase Storage 다운로드 경로 패턴
      },
      
      // (선택) 다른 경우 대비
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
