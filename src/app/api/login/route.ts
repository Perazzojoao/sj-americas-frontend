import { loginFormaSchemaType } from '@/components/LoginForm/loginFormSchema'
import { BASE_URL } from '@/services/baseUrl'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	const body: loginFormaSchemaType = await request.json()
	const response = await fetch(`${BASE_URL}/auth/login`, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
		},
	})

	const responseBody = await response.json()
	if (!response.ok) {
		const statusCode = response.status
		return NextResponse.json(
			{
				message: responseBody.message,
				error: responseBody.error,
				status: statusCode,
			},
			{
				status: statusCode,
			}
		)
	}

	const nextResponse = NextResponse.json({ ...responseBody })
	const token = responseBody.data.token
	nextResponse.cookies.set('token', token)
	return nextResponse
}
