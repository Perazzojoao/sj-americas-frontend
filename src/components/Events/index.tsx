import useEventList from "@/hooks/useEventList";
import EventList from "./EventList";
import { getEventList } from "@/services";

const Events = async () => {
  return (
    <EventList />
  );
}

export default Events;