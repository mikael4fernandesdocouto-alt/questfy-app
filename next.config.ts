import type { NextConfig } from "next";

const repositoryName = "questfy-app";
const isGithubActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isGithubActions ? `/${repositoryName}` : undefined,
  assetPrefix: isGithubActions ? `/${repositoryName}/` : undefined,
};

export default nextConfig;
