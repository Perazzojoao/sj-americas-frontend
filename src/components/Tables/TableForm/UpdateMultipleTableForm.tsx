'use client'

import { table } from '@/@types'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { tableFormSchemaType, tableFormSchema } from './tableFormSchema'
import { toast } from '@/hooks/use-toast'
import useTableList from '@/hooks/useTableList'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useMemo } from 'react'

type UpdateMultipleTableFormProps = {
  filteredTableList: table[]
  eventId: number
}

const UpdateMultipleTableForm = ({
  filteredTableList,
  eventId,
}: UpdateMultipleTableFormProps) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<tableFormSchemaType>({
    resolver: zodResolver(tableFormSchema),
  })

  const { refetch } = useTableList(eventId)

  const { isAllTaken, isAllPaid, isAllOwnersEqual, isAllSeatsEqual } = useMemo(() => {
    const isAllTaken = filteredTableList.every((table) => table.isTaken)
    const isAllPaid = filteredTableList.every(table => table.isPaid)
    const isAllSeatsEqual = filteredTableList.every((table) => table.seats === filteredTableList[0].seats)
    const isAllOwnersEqual = filteredTableList.every((table) => table.owner === filteredTableList[0].owner)
    return { isAllPaid, isAllSeatsEqual, isAllOwnersEqual, isAllTaken }
  }, [filteredTableList])

  useEffect(() => {
    setValue('seats', isAllSeatsEqual ? filteredTableList[0].seats : 0)
  },[])

  async function onSubmit(data: tableFormSchemaType) {
    if (data.is_paid === undefined) {
      data.is_paid = false
    }
    const payload = {
      data,
      table_list_ids: filteredTableList.map(table => table.id),
    }
    try {
      const response = await fetch(`/api/tables/multiples`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
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
      } else {
        toast({
          title: 'Evento atualizado com sucesso',
        })
      }

      refetch()
    } catch (error) {
      console.log('error:', error)
    }
  }

  return (
    <form className='grid gap-4 py-4' onSubmit={handleSubmit(onSubmit)}>
      <div className='grid grid-cols-4 items-center gap-x-4 gap-y-1'>
        <h3 className='text-right'>Cadeiras</h3>
        <Select
          defaultValue={isAllSeatsEqual ? `${filteredTableList[0].seats}` : ''}
          onValueChange={(value) => { setValue('seats', value == '4' ? 4 : 8) }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="-" />
          </SelectTrigger>
          <SelectContent className="col-span-3 col-start-2">
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="8">8</SelectItem>
          </SelectContent>
        </Select>
        {errors.seats && (
          <span className='col-span-3 col-start-2 text-errorMessage text-xs'>{errors.seats.message}</span>
        )}
      </div>
      <div className='grid grid-cols-4 items-center gap-x-4 gap-y-1'>
        <h3 className='text-right'>Lote</h3>
        <Input
          id='lote'
          type='text'
          {...register('owner')}
          className='col-span-2'
          defaultValue={!isAllOwnersEqual ? '' : filteredTableList[0].owner === null ? '' : filteredTableList[0].owner}
        />
        {errors.owner && (
          <span className='col-span-3 col-start-2 text-errorMessage text-xs'>{errors.owner.message}</span>
        )}
      </div>
      <div className='grid grid-cols-4 items-center gap-x-4 gap-y-1'>
        <h3 className='text-right sm:block hidden'>Pagamento</h3>
        <div className='col-start-2'>
          <Select
            defaultValue={isAllPaid ? 'true' : 'false'}
            onValueChange={value => {
              setValue('is_paid', value === 'true' ? true : false)
            }}
          >
            <SelectTrigger className='w-[180px]' disabled={!isAllTaken}>
              <SelectValue placeholder='Pagamento' />
            </SelectTrigger>
            <SelectContent className='col-span-3 col-start-2'>
              {!isAllTaken ? (
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
          <span className='col-span-3 col-start-2 text-errorMessage text-xs'>{errors.is_paid.message}</span>
        )}
      </div>
      <DialogFooter>
        <Button type='submit'>
          <Loader2 className={`animate-spin ${isSubmitting ? 'block' : 'hidden'}`} />
          Salvar mudanças
        </Button>
      </DialogFooter>
    </form>
  )
}

export default UpdateMultipleTableForm
