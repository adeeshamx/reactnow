import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes should be public (accessible without login)
// IMPORTANT: Add your exact webhook path here
const isPublicRoute = createRouteMatcher([
  "/",                         // Landing page
  "/api/webhooks/clerk(.*)",   // Clerk webhooks (matches /api/webhooks/clerk/...)
  "/api/webhooks/stripe(.*)",  // Stripe webhooks (if you have them)
  "/sign-in(.*)",              // Sign-in page
  "/sign-up(.*)"               // Sign-up page
]);

export default clerkMiddleware(async (auth, request) => {
  // If the route is NOT public, protect it (redirects to sign-in if not logged in)
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // 1. Skip Next.js internals and all static files (images, favicon, etc.)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // 2. Always run for API and TRPC routes
    '/(api|trpc)(.*)',
  ],
};