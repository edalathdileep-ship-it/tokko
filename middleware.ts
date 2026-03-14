import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Routes that require login
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/compress',  // exact match only — not compress-ext
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth()
    if (!userId) {
      const { redirectToSignIn } = await auth()
      return redirectToSignIn()
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}