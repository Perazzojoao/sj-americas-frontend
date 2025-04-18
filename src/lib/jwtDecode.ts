import { jwtDecode } from 'jwt-decode'

interface JWTPayload {
	exp: number
	role: 'SUPER_ADMIN' | 'ADMIN' | 'USER'
	[key: string]: unknown
}

export function jwtDecodeToken(token: string) {
	// Verificar se o token está no formato correto (três partes separadas por ponto)
	if (!token || !token.includes('.') || token.split('.').length !== 3) {
		return { valid: false, expired: false, payload: null }
	}

	try {
		const payload = jwtDecode<JWTPayload>(token)
		const now = Date.now() / 1000

		if (payload.exp && payload.exp < now) {
			return { valid: false, expired: true, payload: null }
		}

		return { valid: true, expired: false, payload }
	} catch (error) {
		console.log('Error decoding token:', error);
		return { valid: false, expired: false, payload: null }
	}
}
