'use server'
import { cookies } from 'next/headers'

export async function getBearerToken() {
	const token = (await cookies()).get('token')
	return `Bearer ${token?.value}`
}
