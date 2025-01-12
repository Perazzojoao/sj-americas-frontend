'use client'
import Event from "./Event";
import useEventList from "@/hooks/useEventList";

const EventList = () => {
  const { eventList } = useEventList();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-violet-700 mb-3">Lista de eventos</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {eventList.map((event) => (
          <Event key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
}

export default EventList;