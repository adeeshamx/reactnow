// proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Identify routes that should be public (no login required)
const isPublicRoute = createRouteMatcher([
  "/",                         // Landing page
  "/api/webhooks/clerk(.*)",   // YOUR WEBHOOK ROUTE
  "/sign-in(.*)", 
  "/sign-up(.*)"
]);

// 2. Export the proxy function (the new Next.js 16 standard)
export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    // This protects all other routes
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Matches all paths except static files (images, etc.)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API and TRPC routes
    '/(api|trpc)(.*)',
  ],
};