import { table } from '@/@types'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export default function useTableList(eventId: number | undefined = undefined) {
	const queryClient = useQueryClient()

	const { data, error, isLoading, refetch } = useQuery<table[]>({
		queryKey: ['tableList', eventId],
		queryFn: () => fetch(`/api/tables/${eventId}`).then(res => res.json()),
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
