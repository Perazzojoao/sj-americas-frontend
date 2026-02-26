'use client'
import { event } from "@/@types";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import useEventList from "@/hooks/useEventList";
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { eventFormSchema, eventFormSchemaType } from "./eventFormZod";

const EventForm = ({ name, date, tableCount, id }: event) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<eventFormSchemaType>({
    resolver: zodResolver(eventFormSchema),
  })

  useEffect(() => {
    setValue('table_count', tableCount)
  }, [])
  const { invalidateEventListCache } = useEventList();

  async function onSubmit(data: eventFormSchemaType) {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        toast({
          title: "Falha ao atualizar evento",
          variant: "destructive"
        })
        return;
      } else {
        toast({
          title: "Evento atualizado com sucesso",
        })
      }

      await invalidateEventListCache();
    } catch (error) {
      console.log("error:", error);
    }
  }

  return (
    <form className="grid gap-4 py-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-4 items-center gap-x-4 gap-y-1">
        <h3 className="text-right">
          Nome
        </h3>
        <Input
          id="nome"
          defaultValue={name}
          {...register('name')}
          className="col-span-3"
        />
        {errors.name && (
          <span className="col-span-3 col-start-2 text-errorMessage text-xs">
            {errors.name.message}
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-x-4 gap-y-1">
        <h3 className="text-right">
          Data
        </h3>
        <Input
          id="data"
          type="date"
          defaultValue={date}
          {...register('date')}
          className="col-span-3"
        />
        {errors.date && (
          <span className="col-span-3 col-start-2 text-errorMessage text-xs">
            {errors.date.message}
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-x-4 gap-y-1">
        <h3 className="text-right">
          Mesas
        </h3>
        <Select
          defaultValue={`${tableCount}`}
          onValueChange={(value) => { setValue('table_count', parseInt(value)) }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Cadeiras" />
          </SelectTrigger>
          <SelectContent className="col-span-3 col-start-2">
            <SelectItem value="68">68</SelectItem>
            <SelectItem value="78">78</SelectItem>
            <SelectItem value="88">88</SelectItem>
          </SelectContent>
        </Select>
        {errors.table_count && (
          <span className="col-span-3 col-start-2 text-errorMessage text-xs">
            {errors.table_count.message}
          </span>
        )}
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          <Loader2 className={`animate-spin ${isSubmitting ? 'block' : 'hidden'}`} />
          Salvar mudanças
        </Button>
      </DialogFooter>
    </form>
  );
}

export default EventForm;

