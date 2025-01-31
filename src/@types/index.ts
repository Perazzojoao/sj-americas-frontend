import { ReactNode } from 'react'

export type response = {
	statusCode: number
	message: string
	data: eventListResponse | eventResponse | tableListResponse | tableResponse
}

export type eventListResponse = {
	event_list: event[]
}

export type eventResponse = {
	event: event
}

export type tableListResponse = {
	tables: table[]
}

export type tableResponse = {
	table: table
}

export type event = {
	id: number
	name: string
	date: string
	tableCount: number
	createdAt: string
	updatedAt: string
}

export type table = {
	id: number
	number: number
	seats: number
	owner: number | null
	eventId: number
	isTaken: boolean
	isPaid: boolean
	createdAt: string
	updatedAt: string
}

export type user = {
	id: number
	user_name: string
	role: Role
	createdAt: string
	updatedAt: string
}

export enum Role {
	ADMIN,
	USER,
}

export type LoginData = {
	token: string
	user: user
}

export type LoginResponse = {
	statusCode: number
	message: string
	data: LoginData
}
