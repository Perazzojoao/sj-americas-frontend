import { eventFormSchemaType } from '@/components/Events/EventList/Event/EventForm/eventFormZod'
import { getBearerToken } from '@/lib/getBearer'
import { BASE_URL } from '@/services/baseUrl'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

const parsePositiveId = (value: string | undefined): number | null => {
	if (!value || value === 'undefined' || value === 'null') return null
	const parsed = Number(value)
	if (!Number.isInteger(parsed) || parsed <= 0) return null
	return parsed
}

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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
	try {
		const { eventId } = await params
		const parsedEventId = parsePositiveId(eventId)

		if (!parsedEventId) {
			return badRequest('eventId is required and must be a valid positive number')
		}

		let body: eventFormSchemaType
		try {
			body = await request.json()
		} catch {
			return badRequest('Request body is required')
		}

		if (!body || typeof body !== 'object') {
			return badRequest('Request body is invalid')
		}

		const bearerToken = await getBearerToken()
		const response = await fetch(`${BASE_URL}/event/${parsedEventId}`, {
			method: 'PATCH',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
				authorization: bearerToken,
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
					message: responseBody?.message ?? 'Failed to update event',
					error: responseBody?.error ?? 'Request Failed',
					status: statusCode,
				},
				{
					status: statusCode,
				},
			)
		}

		revalidateTag('event')
		revalidateTag('table')
		return NextResponse.json(responseBody ?? { success: true }, { status: response.status })
	} catch {
		return gatewayError()
	}
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
	try {
		const { eventId } = await params
		const parsedEventId = parsePositiveId(eventId)

		if (!parsedEventId) {
			return badRequest('eventId is required and must be a valid positive number')
		}

		const bearerToken = await getBearerToken()
		const response = await fetch(`${BASE_URL}/event/${parsedEventId}`, {
			method: 'DELETE',
			headers: {
				authorization: bearerToken,
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
					message: responseBody?.message ?? 'Failed to delete event',
					error: responseBody?.error ?? 'Request Failed',
					status: statusCode,
				},
				{
					status: statusCode,
				},
			)
		}

		revalidateTag('event')
		return NextResponse.json(responseBody ?? { success: true }, { status: response.status })
	} catch {
		return gatewayError()
	}
}
