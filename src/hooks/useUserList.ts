import { user } from '@/@types'
import { useQuery } from '@tanstack/react-query'

export default function useUserList() {
	const { data, error, isLoading, refetch } = useQuery<user[]>({
		queryKey: ['userList'],
		queryFn: () => fetch(`/api/users`).then(res => res.json()),
	})

	const userList = data ?? []

	return { userList, error, isLoading, refetch }
}
