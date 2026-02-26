import { eventFormSchemaType } from '@/components/Events/EventList/Event/EventForm/eventFormZod'
import { getBearerToken } from '@/lib/getBearer'
import { getEventList } from '@/services'
import { BASE_URL } from '@/services/baseUrl'
import { revalidateTag } from 'next/cache'
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

export async function GET() {
	try {
		const response = await getEventList()
		return NextResponse.json(response ?? [])
	} catch {
		return gatewayError()
	}
}

export async function POST(request: NextRequest) {
	try {
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
		const response = await fetch(`${BASE_URL}/event`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
				Authorization: bearerToken,
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
					message: responseBody?.message ?? 'Failed to create event',
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
