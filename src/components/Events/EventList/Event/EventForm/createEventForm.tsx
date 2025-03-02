'use client'
import { Input } from "@/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema, eventFormSchemaType } from "./eventFormZod";
import { useForm } from "react-hook-form";
import useEventList from "@/hooks/useEventList";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"
import { DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CreateEventForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<eventFormSchemaType>({
    resolver: zodResolver(eventFormSchema),
  })

  const { refetch } = useEventList();

  async function onSubmit(data: eventFormSchemaType) {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        toast({
          title: "Falha ao criar evento",
          variant: "destructive"
        })
        return;
      } else {
        toast({
          title: "Evento criado com sucesso",
        })
      }

      refetch();
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
          onValueChange={(value) => { setValue('table_count', parseInt(value)) }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Mesas" />
          </SelectTrigger>
          <SelectContent className="col-span-3 col-start-2">
            <SelectItem value="68">68</SelectItem>
            <SelectItem value="78">78</SelectItem>
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
          Criar evento
        </Button>
      </DialogFooter>
    </form>
  );
}

export default CreateEventForm;

