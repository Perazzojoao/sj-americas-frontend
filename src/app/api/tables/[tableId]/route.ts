import { tableFormSchemaType } from '@/components/Tables/TableForm/tableFormSchema'
import { getTableList } from '@/services'
import { BASE_URL } from '@/services/baseUrl'
import { getBearerToken } from '@/lib/getBearer'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ tableId: string }> }) {
	const { tableId } = await params
	const response = await getTableList(parseInt(tableId))
	return NextResponse.json(response)
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ tableId: string }> }) {
	const { tableId } = await params
	const bearerToken = await getBearerToken()
	const body: tableFormSchemaType = await request.json()
	const response = await fetch(`${BASE_URL}/table/${tableId}`, {
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
	revalidateTag('table')

	return NextResponse.json(response)
}
