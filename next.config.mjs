/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy /api/* → backend so cookies are treated as first-party (same-origin).
  // NEXT_PUBLIC_API_URL is the internal server-to-server URL used only here;
  // the axios client uses the relative path /api.
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081/api"
    return [
      {
        source:      "/api/:path*",
        destination: `${backend}/:path*`,
      },
    ]
  },
}

export default nextConfig
