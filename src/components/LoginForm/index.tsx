'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginFormaSchemaType, loginFormSchema } from "./loginFormSchema"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginFormaSchemaType>({
    resolver: zodResolver(loginFormSchema),
  })

  const route = useRouter()

  const onSubmit = async (data: loginFormaSchemaType) => {
    try {
      const response = await fetch(`/api/login`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        toast({
          title: "Erro ao fazer login",
          variant: "destructive"
        })
        return;
      }

      toast({
        title: "Login feito com sucesso",
      })
      route.push('/')
    } catch (error) {
      console.log("error:", error);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Digite seu nome de usuário e senha para acessar o painel de administração.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="user_name">Nome de usuário</Label>
                <Input
                  id="user_name"
                  type="text"
                  {...register("user_name")}
                  required
                />
                {errors.user_name && (
                  <span className="text-errorMessage text-xs">
                    {errors.user_name.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                </div>
                <Input id="password" type="password" {...register("password")} required />
                {errors.password && (
                  <span className="text-errorMessage text-xs">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <Button type="submit" className="w-full">
                <Loader2 className={`animate-spin ${isSubmitting ? 'block' : 'hidden'}`} />
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
