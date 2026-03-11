export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/admin/:path*",
        "/api/settings/:path*",
        "/api/tiers/:path*",
        "/api/stats/:path*",
        "/api/trend/:path*",
    ],
};
