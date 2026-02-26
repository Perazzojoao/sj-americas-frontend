import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

type FieldOrientation = 'vertical' | 'horizontal' | 'responsive'

type FieldProps = ComponentProps<'div'> & {
  orientation?: FieldOrientation
}

const fieldOrientationClassName: Record<FieldOrientation, string> = {
  vertical: 'flex flex-col gap-2',
  horizontal: 'flex items-center gap-3',
  responsive: 'grid gap-2 lg:grid-cols-[120px_minmax(0,1fr)] lg:items-center lg:gap-3',
}

function Field({ className, orientation = 'vertical', ...props }: FieldProps) {
  return (
    <div
      data-slot='field'
      data-orientation={orientation}
      className={cn(fieldOrientationClassName[orientation], className)}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot='field-group' className={cn('grid gap-3', className)} {...props} />
}

function FieldContent({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot='field-content' className={cn('grid gap-1', className)} {...props} />
}

function FieldLabel({ className, ...props }: ComponentProps<typeof Label>) {
  return <Label data-slot='field-label' className={cn('text-left lg:text-right', className)} {...props} />
}

function FieldError({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot='field-error'
      className={cn('text-errorMessage text-xs lg:col-start-2', className)}
      {...props}
    />
  )
}

export { Field, FieldContent, FieldError, FieldGroup, FieldLabel }
