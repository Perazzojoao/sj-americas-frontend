import { userFormSchemaType } from '@/components/Users/UsersForm/userFormSchema'
import { getBearerToken } from '@/lib/getBearer'
import { getUserList } from '@/services'
import { BASE_URL } from '@/services/baseUrl'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
	const response = await getUserList()
	return NextResponse.json(response)
}

export async function POST(request: NextRequest) {
	const bearerToken = await getBearerToken()
	const body: userFormSchemaType = await request.json()
	const response = await fetch(`${BASE_URL}/users`, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
			Authorization: bearerToken,
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
