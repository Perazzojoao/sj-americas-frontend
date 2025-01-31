import { event, eventListResponse, eventResponse, response, table, tableListResponse, tableResponse } from '@/@types'
import { BASE_URL } from './baseUrl'
import { getBearerToken } from '../lib/getBearer'

export const getEventList = async (): Promise<event[]> => {
	const bearerToken = await getBearerToken()
	const response = await fetch(`${BASE_URL}/event`, {
		headers: {
			Authorization: bearerToken,
		},
		cache: 'force-cache',
		next: {
			tags: ['event'],
		},
	})
	const resp: response = await response.json()
	const data = resp.data as eventListResponse
	return data.event_list
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
	const resp: response = await response.json()
	const data = resp.data as eventResponse
	return data.event
}

export const getTableList = async (eventId: number | undefined = undefined): Promise<table[]> => {
	const bearerToken = await getBearerToken()
	const response = await fetch(`${BASE_URL}/table?eventId=${eventId}`, {
		headers: {
			Authorization: bearerToken,
		},
		cache: 'force-cache',
		next: {
			tags: ['table'],
		},
	})
	const resp: response = await response.json()
	const data = resp.data as tableListResponse
	return data.tables
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
	const resp: response = await response.json()
	const data = resp.data as tableResponse
	return data.table
}
