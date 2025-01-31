import { eventFormSchemaType } from '@/components/Events/EventList/Event/EventForm/eventFormZod'
import { getEventList } from '@/services'
import { BASE_URL } from '@/services/baseUrl'
import { getBearerToken } from '@/lib/getBearer'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
	const response = await getEventList()
	return NextResponse.json(response)
}

export async function POST(request: NextRequest) {
	const bearerToken = await getBearerToken()
	const body: eventFormSchemaType = await request.json()
	const response = await fetch(`${BASE_URL}/event`, {
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
	revalidateTag('event')

	return NextResponse.json(response)
}
