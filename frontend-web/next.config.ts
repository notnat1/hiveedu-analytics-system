import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  // skipWaiting: true, // Type error: Object literal may only specify known properties, and 'skipWaiting' does not exist in type 'PluginOptions'.
});

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {},
  output: "standalone",
};

export default withPWA(nextConfig);
