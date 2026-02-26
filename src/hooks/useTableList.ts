import { table } from '@/@types'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export default function useTableList(eventId: number | undefined = undefined) {
	const queryClient = useQueryClient()
	const isValidEventId = Number.isInteger(eventId) && (eventId as number) > 0

	const { data, error, isLoading, refetch } = useQuery<table[]>({
		queryKey: ['tableList', eventId],
		enabled: isValidEventId,
		queryFn: async () => {
			const response = await fetch(`/api/tables/${eventId}`)
			const payload: unknown = await response.json()

			if (Array.isArray(payload)) {
				return payload as table[]
			}

			if (
				typeof payload === 'object' &&
				payload !== null &&
				'data' in payload &&
				typeof payload.data === 'object' &&
				payload.data !== null &&
				'tables' in payload.data &&
				Array.isArray(payload.data.tables)
			) {
				return payload.data.tables as table[]
			}

			return []
		},
	})

	async function invalidateTableListCache() {
		if (eventId) {
			await queryClient.invalidateQueries({ queryKey: ['tableList', eventId] })
			return
		}

		await queryClient.invalidateQueries({ queryKey: ['tableList'] })
	}

	const tableList = data ?? []

	return { tableList, error, isLoading, refetch, invalidateTableListCache }
}
