'use client'

import { table } from '@/@types'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
      <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]'>
        <div className='grid gap-4'>
          <div className='grid grid-cols-4 items-center gap-x-4 gap-y-1'>
            <h3 className='text-right'>Cadeiras</h3>
            <Select
              defaultValue={`${seats}`}
              onValueChange={value => {
                setValue('seats', value == '4' ? 4 : 8, { shouldValidate: true })
              }}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Cadeiras' />
              </SelectTrigger>
              <SelectContent className='col-span-3 col-start-2'>
                <SelectItem value='4'>4</SelectItem>
                <SelectItem value='8'>8</SelectItem>
              </SelectContent>
            </Select>
            {errors.seats && (
              <span className='col-span-3 col-start-2 text-errorMessage text-xs'>
                {errors.seats.message}
              </span>
            )}
          </div>

          <div className='grid grid-cols-4 items-center gap-x-4 gap-y-1'>
            <h3 className='text-right'>Lote</h3>
            <Input
              id='lote'
              type='text'
              defaultValue={owner ?? ''}
              {...register('owner')}
              className='col-span-2'
            />
            {errors.owner && (
              <span className='col-span-3 col-start-2 text-errorMessage text-xs'>
                {errors.owner.message}
              </span>
            )}
          </div>

          <div className='grid grid-cols-4 items-center gap-x-4 gap-y-1'>
            <h3 className='text-right sm:block hidden'>Pagamento</h3>
            <div className='col-start-2'>
              <Select
                defaultValue={`${isPaid}`}
                onValueChange={value => {
                  setValue('is_paid', value === 'true')
                }}
              >
                <SelectTrigger className='w-[180px]' disabled={!isTaken}>
                  <SelectValue placeholder='Pagamento' />
                </SelectTrigger>
                <SelectContent className='col-span-3 col-start-2'>
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
            </div>
            {errors.is_paid && (
              <span className='col-span-3 col-start-2 text-errorMessage text-xs'>
                {errors.is_paid.message}
              </span>
            )}
          </div>
        </div>

        <div className='border rounded-md p-3 h-fit'>
          <h3 className='text-sm font-semibold mb-2'>Nomes na mesa</h3>
          <div className='flex gap-2'>
            <Input
              type='text'
              value={guestNameInput}
              onChange={event => setGuestNameInput(event.target.value)}
              onKeyDown={handleGuestInputEnter}
              placeholder='Digite um nome'
            />
            <Button type='button' onClick={handleAddGuestName}>
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

          <div className='mt-3 max-h-48 overflow-auto'>
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
