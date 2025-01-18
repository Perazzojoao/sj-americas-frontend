import { tableFormSchemaType } from "@/components/Tables/TableForm/tableFormSchema"
import { BASE_URL } from "@/services/baseUrl"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

type BodyType = {
data: tableFormSchemaType,
table_list_ids: number[]
}

export async function PATCH(request: NextRequest) {
	const { data, table_list_ids }: BodyType = await request.json()
  const formatedBody = {...data, table_list_ids}
	const response = await fetch(`${BASE_URL}/table/multiples`, {
		method: 'PATCH',
		body: JSON.stringify(formatedBody),
		headers: {
			'Content-Type': 'application/json',
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