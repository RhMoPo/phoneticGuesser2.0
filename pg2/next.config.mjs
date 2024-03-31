import { StrictMode } from 'react';

/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/pg2",
    output: "export",  // <=== enables static exports
    reactStrictMode: true,
};

export default nextConfig;
