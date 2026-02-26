import { tableFormSchemaType } from '@/components/Tables/TableForm/tableFormSchema'
import { getBearerToken } from '@/lib/getBearer'
import { BASE_URL } from '@/services/baseUrl'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

type BodyType = {
	data: tableFormSchemaType
	table_list_ids: number[]
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

export async function PATCH(request: NextRequest) {
	try {
		let parsedBody: BodyType
		try {
			parsedBody = await request.json()
		} catch {
			return badRequest('Request body is required')
		}

		const { data, table_list_ids } = parsedBody ?? {}
		if (!data || typeof data !== 'object') {
			return badRequest('Field data is required')
		}

		if (!Array.isArray(table_list_ids)) {
			return badRequest('Field table_list_ids is required')
		}

		const hasInvalidId = table_list_ids.some(id => !Number.isInteger(id) || id <= 0)
		if (hasInvalidId) {
			return badRequest('table_list_ids must contain only valid positive numbers')
		}

		const bearerToken = await getBearerToken()
		const formatedBody = { ...data, table_list_ids }
		const response = await fetch(`${BASE_URL}/table/multiples`, {
			method: 'PATCH',
			body: JSON.stringify(formatedBody),
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
					message: responseBody?.message ?? 'Failed to update tables',
					error: responseBody?.error ?? 'Request Failed',
					status: statusCode,
				},
				{
					status: statusCode,
				},
			)
		}

		revalidateTag('table')
		return NextResponse.json(responseBody ?? { success: true }, { status: response.status })
	} catch {
		return gatewayError()
	}
}
