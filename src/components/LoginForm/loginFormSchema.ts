import { z } from 'zod'

export const loginFormSchema = z.object({
	user_name: z.string().min(3, 'Nome de usuário deve ter no mínimo 3 caracteres*'),
	password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres*'),
})

export type loginFormaSchemaType = z.infer<typeof loginFormSchema>
