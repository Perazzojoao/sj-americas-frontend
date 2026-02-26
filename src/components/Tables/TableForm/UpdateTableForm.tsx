'use client'

import { table } from '@/@types'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import useTableList from '@/hooks/useTableList'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, X } from 'lucide-react'
import { KeyboardEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { singleTableFormSchema, singleTableFormSchemaType } from './tableFormSchema'

const UpdateTableForm = ({ id, seats, guestNames, owner, isTaken, isPaid, eventId }: table) => {
  const [guestNameInput, setGuestNameInput] = useState('')

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<singleTableFormSchemaType>({
    resolver: zodResolver(singleTableFormSchema),
    defaultValues: {
      seats,
      owner,
      is_paid: isPaid,
      guest_names: guestNames ?? [],
    },
  })

  const { invalidateTableListCache } = useTableList(eventId)
  const watchedSeats = watch('seats') ?? seats
  const watchedGuestNames = watch('guest_names') ?? []

  useEffect(() => {
    setValue('seats', seats)
    setValue('guest_names', guestNames ?? [])
  }, [guestNames, seats, setValue])

  function handleAddGuestName() {
    const formattedName = guestNameInput.trim()

    if (!formattedName) return

    if (watchedGuestNames.length >= watchedSeats) {
      toast({
        title: 'Limite de nomes atingido',
        description: 'A quantidade de nomes não pode ser maior que o número de cadeiras',
        variant: 'destructive',
      })
      return
    }

    setValue('guest_names', [...watchedGuestNames, formattedName], {
      shouldValidate: true,
      shouldDirty: true,
    })
    setGuestNameInput('')
  }

  function handleRemoveGuestName(index: number) {
    setValue(
      'guest_names',
      watchedGuestNames.filter((_: string, nameIndex: number) => nameIndex !== index),
      { shouldValidate: true, shouldDirty: true }
    )
  }

  function handleGuestInputEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') return

    event.preventDefault()
    handleAddGuestName()
  }

  async function onSubmit(data: singleTableFormSchemaType) {
    try {
      const response = await fetch(`/api/tables/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        toast({
          title: 'Falha ao atualizar evento',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Evento atualizado com sucesso',
      })

      await invalidateTableListCache()
    } catch (error) {
      console.log('error:', error)
    }
  }

  return (
    <form className='py-4' onSubmit={handleSubmit(onSubmit)}>
      <div className='grid items-start gap-4 lg:justify-center lg:grid-cols-[max-content_1px_minmax(0,320px)] lg:gap-5'>
        <div className='lg:w-fit'>
          <FieldGroup className='gap-3 lg:w-fit'>
            <Field orientation='responsive' className='lg:grid-cols-[108px_220px] lg:gap-2'>
              <FieldContent>
                <FieldLabel htmlFor='seats'>Cadeiras</FieldLabel>
              </FieldContent>
              <Select
                defaultValue={`${seats}`}
                onValueChange={value => {
                  setValue('seats', value == '4' ? 4 : 8, { shouldValidate: true })
                }}
              >
                <SelectTrigger id='seats' className='w-full max-w-[220px]'>
                  <SelectValue placeholder='Cadeiras' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='4'>4</SelectItem>
                  <SelectItem value='8'>8</SelectItem>
                </SelectContent>
              </Select>
              {errors.seats && (
                <FieldError>{errors.seats.message}</FieldError>
              )}
            </Field>

            <Field orientation='responsive' className='lg:grid-cols-[108px_220px] lg:gap-2'>
              <FieldContent>
                <FieldLabel htmlFor='lote'>Lote</FieldLabel>
              </FieldContent>
              <Input
                id='lote'
                type='text'
                defaultValue={owner ?? ''}
                {...register('owner')}
                className='w-full max-w-[220px]'
              />
              {errors.owner && (
                <FieldError>{errors.owner.message}</FieldError>
              )}
            </Field>

            <Field orientation='responsive' className='lg:grid-cols-[108px_220px] lg:gap-2'>
              <FieldContent>
                <FieldLabel htmlFor='payment'>Pagamento</FieldLabel>
              </FieldContent>
              <Select
                defaultValue={`${isPaid}`}
                onValueChange={value => {
                  setValue('is_paid', value === 'true')
                }}
              >
                <SelectTrigger id='payment' className='w-full max-w-[220px]' disabled={!isTaken}>
                  <SelectValue placeholder='Pagamento' />
                </SelectTrigger>
                <SelectContent>
                  {!isTaken ? (
                    <SelectItem value='false'>-</SelectItem>
                  ) : (
                    <>
                      <SelectItem value='false'>Pendente</SelectItem>
                      <SelectItem value='true'>Pago</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              {errors.is_paid && (
                <FieldError>{errors.is_paid.message}</FieldError>
              )}
            </Field>
          </FieldGroup>
        </div>

        <Separator className='lg:hidden' />
        <Separator orientation='vertical' className='hidden lg:block self-stretch' />

        <div className='h-fit lg:pt-0.5'>
          <h3 className='text-sm font-semibold mb-2'>Nomes na mesa</h3>
          <div className='flex flex-col sm:flex-row gap-2'>
            <Input
              type='text'
              value={guestNameInput}
              onChange={event => setGuestNameInput(event.target.value)}
              onKeyDown={handleGuestInputEnter}
              placeholder='Digite um nome'
              className='w-full sm:max-w-[260px]'
            />
            <Button type='button' onClick={handleAddGuestName} className='sm:w-auto'>
              Adicionar
            </Button>
          </div>

          <span className='text-xs text-muted-foreground block mt-2'>
            {watchedGuestNames.length}/{watchedSeats} nomes
          </span>

          {errors.guest_names && (
            <span className='text-errorMessage text-xs block mt-1'>
              {errors.guest_names.message}
            </span>
          )}

          <div className='mt-2.5 max-h-48 overflow-auto'>
            {watchedGuestNames.length === 0 ? (
              <span className='text-xs text-muted-foreground'>Nenhum nome adicionado</span>
            ) : (
              <ul className='space-y-2'>
                {watchedGuestNames.map((name: string, index: number) => (
                  <li
                    key={`${name}-${index}`}
                    className='flex items-center justify-between gap-2 text-sm border rounded-sm px-2 py-1'
                  >
                    <span className='truncate'>{name}</span>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => handleRemoveGuestName(index)}
                    >
                      <X className='w-4 h-4' />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <DialogFooter className='mt-4'>
        <Button type='submit'>
          <Loader2 className={`animate-spin ${isSubmitting ? 'block' : 'hidden'}`} />
          Salvar mudanças
        </Button>
      </DialogFooter>
    </form>
  )
}

export default UpdateTableForm
