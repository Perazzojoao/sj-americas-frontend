export type response = {
	statusCode: number
	message: string
	data: eventListResponse | eventResponse | tableListResponse | tableResponse | userListResponse | userResponse
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

export type userListResponse = {
	user_list: user[]
}

export type userResponse = {
	user: user
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
	password: string
	role: Role
	createdAt: string
	updatedAt: string
}

export enum Role {
	SUPER_ADMIN = 'SUPER_ADMIN',
	ADMIN = 'ADMIN',
	USER = 'USER',
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
