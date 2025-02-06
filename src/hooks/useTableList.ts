import { table } from "@/@types";
import { useQuery } from "@tanstack/react-query";

export default function useTableList(eventId: number | undefined = undefined) {
  const { data, error, isLoading, refetch } = useQuery<table[]>({
    queryKey: ["tableList", eventId],
    queryFn: () => fetch(`/api/tables/${eventId}`).then((res) => res.json()),
  })

  const tableList = data ?? [];

  return { tableList, error, isLoading, refetch };
}