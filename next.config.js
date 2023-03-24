const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/app/:path*',
        destination: '/app',
      },
    ];
  },
  /**
   * Custom Webpack Config
   * https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
   */
  webpack(config, options) {
    const { dev, isServer } = options;

    // Do not run type checking twice:
    if (dev && isServer) {
      config.plugins.push(new ForkTsCheckerWebpackPlugin());
    }

    return config;
  },
};

module.exports = nextConfig;
