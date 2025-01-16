import { z } from 'zod'

export const tableFormSchema = z.object({
	seats: z.preprocess(
		val => parseInt(val as string),
		z
			.number()
			.int({ message: 'Número de cadeiras deve ser um número inteiro*' })
			.min(1, 'Número de cadeiras deve ser maior que 0*')
			.max(10, 'Número de cadeiras deve ser menor que 10*')
	),
	owner: z
		.preprocess(
			val => val ? parseInt(val as string) : null,
			z
				.number()
				.int({ message: 'Número do lote deve ser um número inteiro*' })
				.min(1, 'Número do lote deve ser maior que 0*')
				.max(301, 'Número do lote deve ser menor que 301*')
        .nullable()
		)
		.nullable()
    .optional()
})

export type tableFormSchemaType = z.infer<typeof tableFormSchema>
