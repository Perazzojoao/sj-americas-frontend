import { BASE_URL } from '@/services/baseUrl'
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { getBearerToken } from '@/lib/getBearer'
import { userFormSchemaType } from '@/components/Users/UsersForm/userFormSchema'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
	const { userId } = await params
	const body: userFormSchemaType = await request.json()
	const bearerToken = await getBearerToken()
	const response = await fetch(`${BASE_URL}/users/${userId}`, {
		method: 'PATCH',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
			authorization: bearerToken,
		},
	})

	if (!response.ok) {
		const body = await response.json()
		const statusCode = response.status
		return NextResponse.json(
			{
				message: body.message,
				error: body.error,
				status: statusCode,
			},
			{
				status: statusCode,
			}
		)
	}
	revalidateTag('user')

	return NextResponse.json(response)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
	const { userId } = await params
	const bearerToken = await getBearerToken()
	const response = await fetch(`${BASE_URL}/users/${userId}`, {
		method: 'DELETE',
		headers: {
			authorization: bearerToken,
		},
	})

	if (!response.ok) {
		const body = await response.json()
		const statusCode = response.status
		return NextResponse.json(
			{
				message: body.message,
				error: body.error,
				status: statusCode,
			},
			{
				status: statusCode,
			}
		)
	}
	revalidateTag('user')

	return NextResponse.json(response)
}
