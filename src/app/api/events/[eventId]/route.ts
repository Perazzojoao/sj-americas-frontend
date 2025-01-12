import { BASE_URL } from '@/services/baseUrl'
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { eventFormZodType } from '@/components/Events/EventList/Event/EventForm/eventFormZod'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
	try {
		const { eventId } = await params
		const body: eventFormZodType = await request.json()
		const response = await fetch(`${BASE_URL}/event/${eventId}`, {
			method: 'PATCH',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		revalidateTag('event')

		return NextResponse.json(response)
	} catch (error) {
		throw new Error(String(error))
	}
}
