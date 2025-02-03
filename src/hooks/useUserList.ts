import { user } from '@/@types'
import { NEXT_API_URL } from '@/services/baseUrl'
import { useQuery } from '@tanstack/react-query'

export default function useUserList() {
	const { data, error, isLoading, refetch } = useQuery<user[]>({
		queryKey: ['userList'],
		queryFn: () => fetch(`${NEXT_API_URL}/api/users`).then(res => res.json()),
	})

	const userList = data ?? []

	return { eventList: userList, error, isLoading, refetch }
}
