import type { NextConfig } from "next";
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
    ],
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
})
 
// Merge MDX config with Next.js config
export default withMDX(nextConfig)
