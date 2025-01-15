'use client'
import { Button } from "@/components/ui/button";
import Event from "./Event";
import useEventList from "@/hooks/useEventList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import CreateEventForm from "./Event/EventForm/createEventForm";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";

const CreateEventDialog = () => {
  return (
    <Dialog >
      <DialogTrigger asChild className="flex justify-between items-center">
        <Button className="max-w-72 grow">
          Criar evento
          <FaPlus className="ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[360px] rounded-lg bg-card">
        <DialogHeader>
          <DialogTitle className="text-primary">Criar evento</DialogTitle>
        </DialogHeader>

        <CreateEventForm />

      </DialogContent>
    </Dialog>
  )
}

const EventList = () => {
  const { eventList } = useEventList();
  const [search, setSearch] = useState("");

  function handleSearchChange(text: string) {
    setSearch(text);
  }

  return (
    <div>
      <div className="w-full flex justify-center items-center gap-4 mb-6">
        <Input
          className="bg-card w-3/5 sm:w-3/6"
          placeholder="Buscar evento"
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      <section className="w-full flex justify-between gap-5 items-center mb-5">
        <h1 className="text-2xl font-semibold text-primary">Lista de eventos</h1>
        <CreateEventDialog />
      </section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {eventList
          .filter((event) => event.name.toLowerCase().includes(search.toLowerCase()))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((event) => (
            <Event key={event.id} {...event} />
          ))
        }
      </div>
    </div>
  );
}

export default EventList;