import { withAuth } from "next-auth/middleware";

export default withAuth({
    // options
});

export const config = {
    matcher: [
        "/admin/:path*",
        "/api/settings/:path*",
        "/api/tiers/:path*",
        "/api/stats/:path*",
        "/api/trend/:path*",
    ],
};
