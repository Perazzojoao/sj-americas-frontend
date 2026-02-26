import {
	event,
	eventListResponse,
	eventResponse,
	response,
	table,
	tableListResponse,
	tableResponse,
	user,
	userListResponse,
} from '@/@types'
import { getBearerToken } from '../lib/getBearer'
import { BASE_URL } from './baseUrl'

const safeJson = async (apiResponse: Response): Promise<response | null> => {
	try {
		return (await apiResponse.json()) as response
	} catch {
		return null
	}
}

export const getEventList = async (): Promise<event[]> => {
	const bearerToken = await getBearerToken()
	const response = await fetch(`${BASE_URL}/event`, {
		headers: {
			Authorization: bearerToken,
		},
		cache: 'force-cache',
		next: {
			tags: ['event'],
			revalidate: 60 * 5, // 5 minutes
		},
	})
	if (!response.ok) return []
	const resp = await safeJson(response)
	const data = resp?.data as eventListResponse | undefined
	return data?.event_list ?? []
}

export const getEvent = async (eventId: number): Promise<event> => {
	const bearerToken = await getBearerToken()
	const response = await fetch(`${BASE_URL}/event/${eventId}`, {
		headers: {
			Authorization: bearerToken,
		},
		cache: 'force-cache',
		next: {
			tags: [`event-${eventId}`, 'event'],
		},
	})
	if (!response.ok) {
		throw new Error('Failed to fetch event')
	}
	const resp = await safeJson(response)
	const data = resp?.data as eventResponse | undefined

	if (!data?.event) {
		throw new Error('Event data is undefined')
	}

	return data.event
}

export const getTableList = async (eventId: number | undefined = undefined): Promise<table[]> => {
	const bearerToken = await getBearerToken()
	if (!eventId || !Number.isInteger(eventId) || eventId <= 0) {
		return []
	}
	const response = await fetch(`${BASE_URL}/table?eventId=${eventId}`, {
		headers: {
			Authorization: bearerToken,
		},
		cache: 'force-cache',
		next: {
			tags: ['table'],
		},
	})
	if (!response.ok) return []
	const resp = await safeJson(response)
	const data = resp?.data as tableListResponse | undefined
	return data?.tables ?? []
}

export const getTable = async (tableId: number): Promise<table> => {
	const bearerToken = await getBearerToken()
	const response = await fetch(`${BASE_URL}/table/${tableId}`, {
		headers: {
			Authorization: bearerToken,
		},
		cache: 'force-cache',
		next: {
			tags: [`table-${tableId}`, 'table'],
		},
	})
	if (!response.ok) {
		throw new Error('Failed to fetch table')
	}
	const resp = await safeJson(response)
	const data = resp?.data as tableResponse | undefined

	if (!data?.table) {
		throw new Error('Table data is undefined')
	}

	return data.table
}

export const getUserList = async (): Promise<user[]> => {
	const bearerToken = await getBearerToken()
	const response = await fetch(`${BASE_URL}/users`, {
		headers: {
			Authorization: bearerToken,
		},
		cache: 'force-cache',
		next: {
			tags: ['user'],
		},
	})
	if (!response.ok) return []
	const resp = await safeJson(response)
	const data = resp?.data as userListResponse | undefined
	return data?.user_list
}
