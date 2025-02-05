import { Role } from '@/@types'
import { z } from 'zod'

export const userFormSchema = z.object({
	user_name: z
		.string()
		.min(3, { message: 'Nome de usuário deve ter no mínimo 3 caracteres' })
		.regex(/^[a-zA-Z0-9_-]*$/, {
			message: 'Nome de usuário não pode conter espaços nem acentos',
		}),
	password: z
		.string()
		.regex(/^$|^.{6,}$/, {
			message: 'A senha deve ter no mínimo 6 caracteres',
		})
		.transform(value => (value === '' ? undefined : value))
		.optional(),
	role: z.nativeEnum(Role, { message: 'Função deve ser admin ou user' }).default(Role.USER),
})

export type userFormSchemaType = z.infer<typeof userFormSchema>
