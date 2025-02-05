'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userFormSchema, userFormSchemaType } from "./userFormSchema";
import { toast } from "@/hooks/use-toast";
import useUserList from "@/hooks/useUserList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";
import { Role } from "@/@types";

const CreateUserForm = () => {
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<userFormSchemaType>({
    resolver: zodResolver(userFormSchema),
  })

  useEffect(() => {
    setValue('role', Role.USER);
  }, [])

  const { refetch } = useUserList();

  async function onSubmit(data: userFormSchemaType) {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        toast({
          title: "Falha ao criar usuário",
          variant: "destructive"
        })
        return;
      } else {
        toast({
          title: "Usuário criado com sucesso",
        })
        refetch();
      }
    } catch (error) {
      console.log("error:", error);
    }
  }
  return (
    <form className="grid gap-4 py-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-4 items-center gap-x-4 gap-y-1">
        <h3 className="text-right">
          Nome de usuário
        </h3>
        <Input
          id="user_name"
          {...register('user_name')}
          className="col-span-3"
        />
        {errors.user_name && (
          <span className="col-span-3 col-start-2 text-errorMessage text-xs">
            {errors.user_name.message}
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-x-4 gap-y-1">
        <h3 className="text-right">
          Senha
        </h3>
        <Input
          id="password"
          type="password"
          {...register('password')}
          className="col-span-3"
        />
        {errors.password && (
          <span className="col-span-3 col-start-2 text-errorMessage text-xs">
            {errors.password.message}
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-x-4 gap-y-1">
        <h3 className="text-right">
          Tipo de usuário
        </h3>
        <Select defaultValue="USER" onValueChange={(value: Role) => { setValue('role', value) }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent className="col-span-3 col-start-2">
            <SelectItem value="USER">USER</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <span className="col-span-3 col-start-2 text-errorMessage text-xs">
            {errors.role.message}
          </span>
        )}
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          <Loader2 className={`animate-spin ${isSubmitting ? 'block' : 'hidden'}`} />
          Criar usuário
        </Button>
      </DialogFooter>
    </form>

  );
}

export default CreateUserForm;