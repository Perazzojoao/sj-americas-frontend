import { getTable } from '@/services'
import { useQuery } from '@tanstack/react-query'
import { table } from '@/@types'

export default function useTable(tableId: number) {
	const { data, error, isLoading, refetch } = useQuery<table>({
		queryKey: [`table-${tableId}`],
		queryFn: () => getTable(tableId),
	})

	const table = data ?? {} as table

	return { table, error, isLoading, refetch }
}
