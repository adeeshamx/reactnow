// proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define the routes that DO NOT need authentication
const isPublicRoute = createRouteMatcher([
  "/",                         // Home page
  "/api/webhooks/clerk(.*)",   // YOUR WEBHOOK ROUTE (Crucial)
  "/sign-in(.*)", 
  "/sign-up(.*)"
]);

export default clerkMiddleware(async (auth, request) => {
  // Protect everything except the public routes listed above
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Matches all routes except static files (images, etc.)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};