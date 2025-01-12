import { table } from "@/@types";
import { getTableList } from "@/services";
import { useQuery } from "@tanstack/react-query";

export default function useTablesList(eventId: number | undefined = undefined) {
  const { data, error, isLoading, refetch } = useQuery<table[]>({
    queryKey: ["tableList", eventId],
    queryFn: () => getTableList(eventId),
  })

  const tableList = data ?? [];

  return { tableList, error, isLoading, refetch };
}