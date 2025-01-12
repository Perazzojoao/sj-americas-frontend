import { event } from '@/@types'
import { NEXT_API_URL } from '@/services/baseUrl'
import { useQuery } from '@tanstack/react-query'

export default function useEventList() {
	const { data, error, isLoading, refetch } = useQuery<event[]>({
		queryKey: ['eventList'],
		queryFn: () => fetch(`${NEXT_API_URL}/api/events`).then((res) => res.json()),
	})

	const eventList = data ?? []

	return { eventList, error, isLoading, refetch }
}
