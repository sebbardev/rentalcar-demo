/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore ESLint and TypeScript errors during build for production
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Enable WebP and AVIF formats for better compression
    formats: ['image/webp', 'image/avif'],
    // Optimize image loading
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Enable React strict mode for better performance in development
  reactStrictMode: true,
  
  // Compression for production
  compress: true,
  
  // OPTIMIZED: Enable SWC minifier for faster builds
  swcMinify: true,
  
  // OPTIMIZED: Enable experimental optimizations
  experimental: {
    // Optimize CSS by removing unused CSS in production
    // Disabled: requires 'critters' package
    // optimizeCss: true,
    // Enable legacy browser support if needed
    forceSwcTransforms: false,
  },
  
  // Optimize webpack for faster builds and smaller bundles
  webpack: (config, { dev, isServer }) => {
    // Optimize production builds
    if (!dev && !isServer) {
      // Simplified split chunks configuration
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // OPTIMIZED: Better chunk splitting strategy
          commons: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          // Separate vendor chunks for better caching
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }
    
    return config;
  },
  
  // Headers for better caching
  async headers() {
    return [
      {
        // Cache static assets
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Shorter cache for pages
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ];
  },
  
  // Redirects if needed
  async redirects() {
    return [];
  },
  
  // OPTIMIZED: Enable powered by header removal for security
  poweredByHeader: false,
};

module.exports = nextConfig;
