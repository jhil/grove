import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://*.supabase.co https://www.gravatar.com https://www.ikea.com https://*.ikea.com https://america.felco.com https://www.toolboxsupply.com https://gardenheir.com https://hardwickandsons.com https://www.gardentoolcompany.com https://www.bloomspace.co https://www.magicvalleygardens.com https://shop.fifthseasongardening.com https://thelandscaperstore.com https://cdn.shopify.com",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.open-meteo.com https://nominatim.openstreetmap.org https://www.google-analytics.com",
              "font-src 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
