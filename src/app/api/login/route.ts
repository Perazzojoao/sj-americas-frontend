import { loginFormaSchemaType } from '@/components/LoginForm/loginFormSchema'
import { BASE_URL } from '@/services/baseUrl'
import { NextRequest, NextResponse } from 'next/server'

const badRequest = (message: string) =>
	NextResponse.json(
		{
			message,
			error: 'Bad Request',
			status: 400,
		},
		{ status: 400 },
	)

const gatewayError = () =>
	NextResponse.json(
		{
			message: 'Failed to process request',
			error: 'Bad Gateway',
			status: 502,
		},
		{ status: 502 },
	)

export async function POST(request: NextRequest) {
	try {
		let body: loginFormaSchemaType
		try {
			body = await request.json()
		} catch {
			return badRequest('Request body is required')
		}

		if (!body || typeof body !== 'object') {
			return badRequest('Request body is invalid')
		}

		const response = await fetch(`${BASE_URL}/auth/login`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		let responseBody: Record<string, unknown> | null = null
		try {
			responseBody = await response.json()
		} catch {
			responseBody = null
		}

		if (!response.ok) {
			const statusCode = response.status
			return NextResponse.json(
				{
					message: responseBody?.message ?? 'Invalid credentials',
					error: responseBody?.error ?? 'Request Failed',
					status: statusCode,
				},
				{
					status: statusCode,
				},
			)
		}

		const token = (responseBody?.data as { token?: string } | undefined)?.token
		if (!token) {
			return NextResponse.json(
				{
					message: 'Login response is missing token',
					error: 'Bad Gateway',
					status: 502,
				},
				{ status: 502 },
			)
		}

		const nextResponse = NextResponse.json(responseBody ?? { success: true }, { status: response.status })
		const ONE_WEEK_IN_SECONDS = 604800
		nextResponse.cookies.set('token', token, {
			maxAge: ONE_WEEK_IN_SECONDS,
		})
		return nextResponse
	} catch {
		return gatewayError()
	}
}
