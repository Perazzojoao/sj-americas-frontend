import { getEvent } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { event } from "@/@types";

export default function useEvent(eventId: number) {
  const { data, error, isLoading, refetch } = useQuery<event>({
    queryKey: [`event-${eventId}`],
    queryFn: () => getEvent(eventId),
  });

  const event = data ?? {} as event;

  return { event, error, isLoading, refetch };

}