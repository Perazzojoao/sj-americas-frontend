import { event } from "@/@types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import EventForm from "./EventForm";
import { useRef } from "react";

const Event = (event: event) => {
  const { name, date, tableCount } = event;
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;
  const day = new Date(date).getUTCDate();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSaveChanges = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <Card className="sm:max-w-sm text-primary shadow-md">
      <CardHeader className="flex flex-row justify-between ">
        <CardTitle>{name}</CardTitle>
        <CardDescription>{`${day}/${month}/${year}`}</CardDescription>
      </CardHeader>
      <CardContent className="font-semibold flex justify-between items-center">
        <div>
          Mesas: <span className="font-normal text-muted-foreground">{tableCount}</span>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary">Editar</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-w-[360px] rounded-lg bg-white">
            <DialogHeader>
              <DialogTitle className="text-primary">Editar evento</DialogTitle>
            </DialogHeader>

            <EventForm ref={formRef} {...event} />

            <DialogFooter>
              <Button type="button" onClick={handleSaveChanges}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>

  );
}

export default Event;