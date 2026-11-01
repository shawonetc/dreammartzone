import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lpawmxawuqrddhelcjmy.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/fssfwfef",
        destination: "/returns",
        permanent: false,
      },
      {
        source: "/return-policy",
        destination: "/returns",
        permanent: false,
      },
      {
        source: "/faqs",
        destination: "/faq",
        permanent: false,
      },
      {
        source: "/qna",
        destination: "/faq",
        permanent: false,
      },
      {
        source: "/Q&A",
        destination: "/faq",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
