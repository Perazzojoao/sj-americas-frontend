'use client'
import { z } from 'zod';

export const eventFormZod = z.object({
    name: z
      .string()
      .min(3, 'Nome deve ter no mínimo 3 caracteres*')
      .max(25, 'Nome deve ter no máximo 25 caracteres*'),
    date: z
      .string()
      .date('Data inválida*')
      .refine((val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Zerar horas para comparar apenas a data
        return date >= today;
      }, {
        message: 'Data não pode estar no passado*'
      }),
    tableCount: z
      .preprocess(
        (val) => parseInt(val as string), 
        z.number()
          .min(1, 'Número de mesas deve ser maior que 0*')
          .max(200, 'Número de mesas deve ser menor que 200*')
      )
      .refine((val) => Number.isInteger(val), {
        message: 'Número de mesas deve ser um número inteiro*',
      })
});

export type eventFormZodType = z.infer<typeof eventFormZod>;