import { NextResponse, type NextRequest, type MiddlewareConfig } from 'next/server'
import { jwtDecodeToken } from './lib/jwtDecode'

const publicRoutes = [
	{ path: '/login', whenAuthenticated: 'redirect' },
	{ path: /^\/mapa\/\d+$/, whenAuthenticated: 'next' },
] as const

const adminRoutes = { path: /^\/admin(?:\/.*)?$/, role: 'ADMIN' }

const REDIRECT_WHEN_NOT_AUTHENTICATED = '/login'

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname
	const publicRoute = publicRoutes.find(route =>
		typeof route.path === 'string' ? route.path === path : route.path.test(path)
	)
	const authToken = request.cookies.get('token')

	if (!authToken && publicRoute) {
		return NextResponse.next()
	}

	if (!authToken && !publicRoute) {
		const redirectUrl = request.nextUrl.clone()
		redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED
		return NextResponse.redirect(redirectUrl)
	}

	if (authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
		const redirectUrl = request.nextUrl.clone()
		redirectUrl.pathname = '/'
		return NextResponse.redirect(redirectUrl)
	}

	if (authToken && !publicRoute) {
		// Check if JWT token in not expired
		const decodedToken = jwtDecodeToken(authToken.value)
		const isExpired = decodedToken.expired
		const isValid = decodedToken.valid
		if (isExpired || !isValid) {
			request.cookies.delete('token')

			const redirectUrl = request.nextUrl.clone()
			redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED
			return NextResponse.redirect(redirectUrl)
		}

    // Check if user is trying to access an admin route
    const userRole = decodedToken.payload?.role
    const adminRoute = adminRoutes.path.test(path)
    if (adminRoute && userRole === 'USER') {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/'
      return NextResponse.redirect(redirectUrl)
    }

		return NextResponse.next()
	}

	return NextResponse.next()
}

export const config: MiddlewareConfig = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
	],
}
