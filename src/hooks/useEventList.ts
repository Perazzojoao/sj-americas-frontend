import { event } from '@/@types'
import { useQuery } from '@tanstack/react-query'

export default function useEventList() {
	const { data, error, isLoading, refetch } = useQuery<event[]>({
		queryKey: ['eventList'],
		queryFn: () => fetch(`/api/events`).then((res) => res.json()),
	})

	const eventList = data ?? []

	return { eventList, error, isLoading, refetch }
}
