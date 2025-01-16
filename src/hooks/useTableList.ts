import { table } from "@/@types";
import { getTableList } from "@/services";
import { NEXT_API_URL } from "@/services/baseUrl";
import { useQuery } from "@tanstack/react-query";

export default function useTableList(eventId: number | undefined = undefined) {
  const { data, error, isLoading, refetch } = useQuery<table[]>({
    queryKey: ["tableList", eventId],
    queryFn: () => fetch(`${NEXT_API_URL}/api/tables/${eventId}`).then((res) => res.json()),
  })

  const tableList = data ?? [];

  return { tableList, error, isLoading, refetch };
}