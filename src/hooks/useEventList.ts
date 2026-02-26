import { event } from '@/@types'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export default function useEventList() {
	const queryClient = useQueryClient()

	const { data, error, isLoading, refetch } = useQuery<event[]>({
		queryKey: ['eventList'],
		queryFn: () => fetch(`/api/events`).then(res => res.json()),
		staleTime: 1000 * 60, // 60 seconds
	})

	async function invalidateEventListCache() {
		await queryClient.invalidateQueries({ queryKey: ['eventList'] })
	}

	const eventList = data ?? []

	return { eventList, error, isLoading, refetch, invalidateEventListCache }
}
