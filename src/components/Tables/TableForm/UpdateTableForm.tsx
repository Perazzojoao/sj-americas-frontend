'use client'

import { table } from "@/@types";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { tableFormSchemaType, tableFormSchema } from "./tableFormSchema";
import { toast } from "@/hooks/use-toast";
import useTableList from "@/hooks/useTableList";

const UpdateTableForm = ({ id, seats, owner, eventId }: table) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<tableFormSchemaType>({
    resolver: zodResolver(tableFormSchema),
  })

  const { refetch } = useTableList(eventId);

  async function onSubmit(data: tableFormSchemaType) {
    try {
      const response = await fetch(`/api/tables/${id}`, {
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

      refetch();
    } catch (error) {
      console.log("error:", error);
    }
  }

  return (
    <form className="grid gap-4 py-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-4 items-center gap-x-4 gap-y-1">
        <h3 className="text-right">
          Cadeiras
        </h3>
        <Input
          id="cadeiras"
          type="number"
          defaultValue={seats}
          {...register('seats')}
        />
        {errors.seats && (
          <span className="col-span-3 col-start-2 text-errorMessage text-xs">
            {errors.seats.message}
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-x-4 gap-y-1">
        <h3 className="text-right">
          Lote
        </h3>
        <Input
          id="lote"
          type="text"
          defaultValue={owner ?? ''}
          {...register('owner')}
        />
        {errors.owner && (
          <span className="col-span-3 col-start-2 text-errorMessage text-xs">
            {errors.owner.message}
          </span>
        )}
      </div>
      <DialogFooter>
        <Button type="submit" >
          <Loader2 className={`animate-spin ${isSubmitting ? 'block' : 'hidden'}`} />
          Salvar mudanças
        </Button>
      </DialogFooter>
    </form>
  );
}

export default UpdateTableForm;