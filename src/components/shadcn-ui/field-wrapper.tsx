import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

import { cn, getKey, getLabel, getValue, parseAllowedPrimitive } from '@/lib/utils'

import { type comboboxProps, type multiSelectComboboxProps, Combobox, MultiSelectCombobox } from './combobox'
import { type selectProps, SelectWrapper as SelectPrimitiveWrapper } from './select'
import { Field, FieldLabel, FieldError, FieldDescription } from './field'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { RadioGroup, RadioGroupItem } from './radio-group'
import { Calendar } from './calendar'
import { Textarea } from './textarea'
import { Checkbox } from './checkbox'
import { Button } from './button'
import { Switch } from './switch'
import { Input } from './input'

type BaseProps = {
  name: string
  label?: React.ReactNode
  description?: React.ReactNode
  error?: { message?: string }
  invalid?: boolean
  className?: string
}

type InputProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement>
export function InputWrapper({ name, label, error, invalid, className, type = 'text', placeholder, description, ...props }: InputProps) {
  const isInvalid = invalid || !!error

  return (
    <Field className={className} data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder || `Enter ${label}`}
        aria-invalid={isInvalid}
        {...props}
      />

      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={[error]} />}
    </Field>
  )
}

type TextareaProps = BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>
export function TextareaWrapper({ name, label, error, invalid, className, placeholder, description, ...rest }: TextareaProps) {
  const isInvalid = invalid || !!error

  return (
    <Field className={className} data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
      <Textarea
        id={name}
        name={name}
        placeholder={placeholder || `Enter ${label}`}
        aria-invalid={isInvalid}
        {...rest}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={[error]} />}
    </Field>
  )
}

type RadioProps = BaseProps & {
  options: (allowedPrimitiveT | optionT)[]
  value?: allowedPrimitiveT
  onValueChange?: (value: allowedPrimitiveT) => void
}
export function RadioWrapper({ name, label, error, invalid, className, options, value, description, onValueChange }: RadioProps) {
  const isInvalid = invalid || !!error

  return (
    <Field className={className} data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={`${name}-0`}>{label}</FieldLabel>}
      <RadioGroup
        value={value ? String(value) : undefined}
        onValueChange={(val) => onValueChange?.(parseAllowedPrimitive(val))}
        className='flex items-center flex-wrap gap-4'
        aria-invalid={isInvalid}
      >
        {options.map((option, i) => (
          <div key={getKey(option, i)} className='flex items-center gap-2'>
            <RadioGroupItem value={`${getValue(option)}`} id={`${name}-${i}`} />
            <FieldLabel htmlFor={`${name}-${i}`} className='font-normal'>
              {getLabel(option)}
            </FieldLabel>
          </div>
        ))}
      </RadioGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={[error]} />}
    </Field>
  )
}

type CheckboxProps = BaseProps & {
  options: (allowedPrimitiveT | optionT)[]
  value?: allowedPrimitiveT[]
  onValueChange?: (value: allowedPrimitiveT[]) => void
}
export function CheckboxWrapper({ name, label, error, invalid, className, options, value = [], description, onValueChange }: CheckboxProps) {
  const isInvalid = invalid || !!error

  const toggleValue = (v: allowedPrimitiveT) => {
    if (value.includes(v)) {
      onValueChange?.(value.filter(x => x !== v))
    } else {
      onValueChange?.([...value, v])
    }
  }

  return (
    <Field className={className} data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={`${name}-0`}>{label}</FieldLabel>}
      <div className='flex items-center flex-wrap gap-4' aria-invalid={isInvalid}>
        {options.map((option, i) => {
          const val = getValue(option)
          const parsedVal = parseAllowedPrimitive(val)
          const isChecked = value.includes(parsedVal)

          return (
            <div key={getKey(option, i)} className='flex items-center gap-2 space-y-0'>
              <Checkbox
                id={`${name}-${i}`}
                checked={isChecked}
                onCheckedChange={() => toggleValue(parsedVal)}
              />
              <FieldLabel htmlFor={`${name}-${i}`} className='font-normal'>
                {getLabel(option)}
              </FieldLabel>
            </div>
          )
        })}
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={[error]} />}
    </Field>
  )
}

type SwitchProps = BaseProps & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}
export function SwitchWrapper({ name, label, error, invalid, className, checked, description, onCheckedChange }: SwitchProps) {
  const isInvalid = invalid || !!error

  return (
    <Field className={className} data-invalid={isInvalid}>
      <div className='flex items-center justify-between gap-4'>
        {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
        <Switch
          id={name}
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-label={typeof label === 'string' ? label : name}
          aria-invalid={isInvalid}
        />
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={[error]} />}
    </Field>
  )
}

type SelectProps = BaseProps & Omit<selectProps, 'value' | 'onValueChange'> & {
  value?: allowedPrimitiveT
  onValueChange?: (value: allowedPrimitiveT) => void
}
export function SelectWrapper({ name, label, error, invalid, className, options, placeholder, value, description, onValueChange, ...props }: SelectProps) {
  const isInvalid = invalid || !!error

  return (
    <Field className={className} data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
      <SelectPrimitiveWrapper
        {...props}
        id={name}
        options={options}
        value={value ? String(value) : undefined}
        placeholder={placeholder ?? `Select ${label}`}
        onValueChange={(val) => onValueChange?.(parseAllowedPrimitive(val))}
        aria-invalid={isInvalid}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={[error]} />}
    </Field>
  )
}

type DatePickerProps = BaseProps & Omit<React.ComponentProps<typeof Calendar>, 'selected' | 'onSelect'> & {
  value?: Date
  onSelect?: (date: Date | undefined) => void
}
export function DatePickerWrapper({ name, label, error, invalid, className, value, onSelect, description, ...calendarProps }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const isInvalid = invalid || !!error

  return (
    <Field className={className} data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={name}
            variant={'outline'}
            className={cn('w-full pl-3 text-left font-normal', !value && 'text-muted-foreground')}
            aria-invalid={isInvalid}
          >
            {value ? format(value, 'dd/MM/yyyy') : <span>Pick a date</span>}
            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            autoFocus
            mode='single'
            captionLayout='dropdown'
            selected={value}
            onSelect={(date) => {
              onSelect?.(date)
              setOpen(false)
            }}
            defaultMonth={value}
            {...calendarProps as any}
          />
        </PopoverContent>
      </Popover>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={[error]} />}
    </Field>
  )
}

type ComboboxProps = BaseProps & comboboxProps
export function ComboboxWrapper({ name, label, error, invalid, className, placeholder, value, description, onValueChange, ...rest }: ComboboxProps) {
  const isInvalid = invalid || !!error

  return (
    <Field className={className} data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
      <Combobox
        {...rest}
        id={name}
        value={value}
        placeholder={placeholder || `Select ${label}`}
        onValueChange={onValueChange}
        aria-invalid={isInvalid}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={[error]} />}
    </Field>
  )
}

type MultiSelectComboboxProps = BaseProps & multiSelectComboboxProps
export function MultiSelectComboboxWrapper({ name, label, error, invalid, className, placeholder, value, description, onValueChange, ...rest }: MultiSelectComboboxProps) {
  const isInvalid = invalid || !!error

  return (
    <Field className={className} data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
      <MultiSelectCombobox
        {...rest}
        id={name}
        value={value}
        placeholder={placeholder || `Select ${label}`}
        onValueChange={onValueChange}
        aria-invalid={isInvalid}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={[error]} />}
    </Field>
  )
}