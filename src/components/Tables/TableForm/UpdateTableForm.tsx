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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const UpdateTableForm = ({ id, seats, owner, isTaken, isPaid, eventId }: table) => {
  const {
    register,
    setValue,
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
        <Select defaultValue={`${seats}`} onValueChange={(value) => { setValue('seats', value === '4' ? 4 : 8) }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Cadeiras" />
          </SelectTrigger>
          <SelectContent className="col-span-3 col-start-2">
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="8">8</SelectItem>
          </SelectContent>
        </Select>
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
          className="col-span-2"
        />
        {errors.owner && (
          <span className="col-span-3 col-start-2 text-errorMessage text-xs">
            {errors.owner.message}
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-x-4 gap-y-1">
        <h3 className="text-right sm:block hidden">
          Pagamento
        </h3>
        <div className="col-start-2">
          <Select defaultValue={`${isPaid}`} onValueChange={(value) => { setValue('is_paid', value === 'true' ? true : false) }}>
            <SelectTrigger className="w-[180px]" disabled={!isTaken}>
              <SelectValue placeholder="Pagamento" />
            </SelectTrigger>
            <SelectContent className="col-span-3 col-start-2">
              {!isTaken ?
                <SelectItem value="false">-</SelectItem>
                :
                <>
                  <SelectItem value="false">Pendente</SelectItem>
                  <SelectItem value="true">Pago</SelectItem>
                </>
              }
            </SelectContent>
          </Select>
        </div>
        {errors.is_paid && (
          <span className="col-span-3 col-start-2 text-errorMessage text-xs">
            {errors.is_paid.message}
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