import { BASE_URL } from '@/services/baseUrl'
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { eventFormSchemaType } from '@/components/Events/EventList/Event/EventForm/eventFormZod'
import { getBearerToken } from '@/lib/getBearer'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
	const { eventId } = await params
	const body: eventFormSchemaType = await request.json()
	const bearerToken = await getBearerToken()
	const response = await fetch(`${BASE_URL}/event/${eventId}`, {
		method: 'PATCH',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
			'authorization': bearerToken,
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
	revalidateTag('table')

	return NextResponse.json(response)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
	const { eventId } = await params
	const response = await fetch(`${BASE_URL}/event/${eventId}`, {
		method: 'DELETE',
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
