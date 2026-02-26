import { z } from 'zod'

const baseTableFormSchema = z.object({
	seats: z.preprocess(
		val => parseInt(val as string),
		z
			.number()
			.int({ message: 'Número de cadeiras deve ser um número inteiro*' })
			.min(1, 'Número de cadeiras deve ser maior que 0*')
			.max(10, 'Número de cadeiras deve ser menor que 10*'),
	),
	owner: z
		.preprocess(
			val => (val ? parseInt(val as string) : null),
			z
				.number()
				.int({ message: 'Número do lote deve ser um número inteiro*' })
				.min(1, 'Número do lote deve ser maior que 0*')
				.max(340, 'Número do lote deve ser menor que 341*')
				.nullable(),
		)
		.nullable()
		.optional(),
	is_paid: z.boolean().optional(),
})

export const tableFormSchema = baseTableFormSchema

export const singleTableFormSchema = baseTableFormSchema
	.extend({
		guest_names: z
			.array(z.string().trim().min(1, 'Nome não pode estar vazio*').max(80, 'Nome deve ter no máximo 80 caracteres*'))
			.max(10, 'Lista de nomes deve conter no máximo 10 itens*')
			.optional()
			.default([]),
	})
	.superRefine((data, ctx) => {
		const guestNames = data.guest_names ?? []
		if (guestNames.length > data.seats) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['guest_names'],
				message: 'Quantidade de nomes não pode ser maior que o número de cadeiras*',
			})
		}
	})

export type tableFormSchemaType = z.infer<typeof tableFormSchema>
export type singleTableFormSchemaType = z.infer<typeof singleTableFormSchema>
