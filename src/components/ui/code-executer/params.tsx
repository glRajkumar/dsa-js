import { useState } from "react"
import { FieldValues, Path, useFieldArray, useFormContext } from "react-hook-form"
import { Plus, Trash } from "lucide-react"

import type {
  paramT,
  arrayConstraintT,
  objectConstraintT,
  stringConstraintT,
  numberConstraintT,
} from "@/utils/code-executer/schema"

import { cn } from "@/lib/utils"

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn-ui/card"
import { InputWrapper, SwitchWrapper } from "@/components/shadcn-ui/field-wrapper-rhf"
import { Button } from "@/components/shadcn-ui/button"
import { Badge } from "@/components/shadcn-ui/badge"
import { Input } from "@/components/shadcn-ui/input"

interface ParamFieldProps<T extends FieldValues> {
  param: paramT
  name: Path<T>
}

export function ParamField<T extends FieldValues>({ param, name }: ParamFieldProps<T>) {
  switch (param.type) {
    case "array":
      return (
        <ArrayField
          name={name}
          label={param.name}
          description={param.description}
          constraints={param.constraints}
        />
      )

    case "object":
      return (
        <ObjectField
          name={name}
          label={param.name}
          description={param.description}
          constraints={param.constraints}
        />
      )

    case "boolean":
      return (
        <BooleanField
          name={name}
          label={param.name}
          description={param.description}
        />
      )

    case "number":
      return (
        <NumberField
          name={name}
          label={param.name}
          description={param.description}
          constraints={param.constraints}
        />
      )

    default:
      return (
        <StringField
          name={name}
          label={param.name}
          description={param.description}
          constraints={param.constraints}
        />
      )
  }
}

interface StringFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  description?: string
  constraints?: stringConstraintT
}

function StringField<T extends FieldValues>({
  name,
  label,
  description,
  constraints: { defaultValue, ...rest } = {},
}: StringFieldProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <InputWrapper
      name={name}
      label={label}
      control={control}
      description={description}
      placeholder={defaultValue || `Enter ${label}`}
      {...rest}
    />
  )
}

interface NumberFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  description?: string
  constraints?: numberConstraintT
}

function NumberField<T extends FieldValues>({
  name,
  label,
  description,
  constraints: { defaultValue, ...rest } = {},
}: NumberFieldProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <InputWrapper
      name={name}
      type="number"
      label={label}
      control={control}
      description={description}
      placeholder={defaultValue?.toString() || `Enter ${label}`}
      {...rest}
    />
  )
}

interface BooleanFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  description?: string
}

function BooleanField<T extends FieldValues>({
  name,
  label,
  description,
}: BooleanFieldProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <SwitchWrapper
      name={name}
      label={label}
      control={control}
      description={description}
      className="[&_div]:justify-start"
    />
  )
}

interface ArrayItemProps<T extends FieldValues> {
  itemName: Path<T>
  index: number
  constraints?: arrayConstraintT
  label?: string
}

function ArrayItemRenderer<T extends FieldValues>({
  itemName,
  index,
  constraints,
}: ArrayItemProps<T>) {
  const { control } = useFormContext<T>()

  const label = `Item ${index + 1}`

  if (!constraints) {
    return (
      <InputWrapper
        name={itemName}
        control={control}
        label={label}
      />
    )
  }

  switch (constraints.type) {
    case "array":
      return (
        <ArrayField
          name={itemName}
          label={label}
          constraints={constraints.constraints}
        />
      )

    case "object":
      return (
        <ObjectField
          name={itemName}
          label={label}
          constraints={constraints?.constraints?.[itemName]}
        />
      )

    case "boolean":
      return (
        <BooleanField
          name={itemName}
          label={label}
        />
      )

    case "number":
      return (
        <NumberField
          name={itemName}
          label={label}
          constraints={constraints.constraints}
        />
      )

    default:
      return (
        <StringField
          name={itemName}
          label={label}
          constraints={constraints.constraints}
        />
      )
  }
}

interface ArrayFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  description?: string
  constraints?: arrayConstraintT
}

function ArrayField<T extends FieldValues>({
  name,
  label,
  description,
  constraints,
}: ArrayFieldProps<T>) {
  const { control } = useFormContext<T>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  })

  const getDefaultValue = () => {
    if (!constraints) return ""

    switch (constraints.type) {
      case "string":
        return constraints.constraints?.defaultValue || ""
      case "number":
        return constraints.constraints?.defaultValue || 0
      case "boolean":
        return constraints.constraints?.defaultValue || false
      case "array":
        return []
      case "object":
        return {}
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{label}</CardTitle>

          <Badge variant="secondary" className="ml-2">
            Array[{constraints?.type || "any"}]
          </Badge>

          <Badge variant="outline" className="ml-1">
            {fields.length} items
          </Badge>
        </div>

        {description && (
          <CardDescription>{description}</CardDescription>
        )}

        <CardAction>
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={() => append(getDefaultValue() as any)}
            disabled={constraints?.max !== undefined && fields.length >= constraints.max}
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3">
        {fields.map((field, index) => {
          const itemName = `${name}.${index}` as Path<T>
          return (
            <div key={field.id} className={cn("flex gap-2", constraints?.type === "boolean" ? "items-center" : "items-start")}>
              <div className="flex-1">
                <ArrayItemRenderer
                  index={index}
                  itemName={itemName}
                  constraints={constraints}
                />
              </div>

              <Button
                size="icon"
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
                disabled={
                  constraints?.min !== undefined &&
                  fields.length <= constraints.min
                }
                className={cn(constraints?.type !== "boolean" && "mt-6")}
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

interface ObjectFieldRendererProps<T extends FieldValues> {
  label: string
  fieldName: Path<T>
  constraints?: objectConstraintT
}

function ObjectFieldRenderer<T extends FieldValues>({
  label,
  fieldName,
  constraints,
}: ObjectFieldRendererProps<T>) {
  const { control } = useFormContext<T>()

  if (!constraints) {
    return (
      <InputWrapper
        name={fieldName}
        control={control}
        label={label}
      />
    )
  }

  switch (constraints.type) {
    case "array":
      return (
        <ArrayField
          name={fieldName}
          label={label}
          constraints={constraints.constraints}
        />
      )

    case "object":
      return (
        <ObjectField
          name={fieldName}
          label={label}
          constraints={constraints?.constraints?.[fieldName]}
        />
      )

    case "boolean":
      return (
        <BooleanField
          name={fieldName}
          label={label}
        />
      )

    case "number":
      return (
        <NumberField
          name={fieldName}
          label={label}
          constraints={constraints.constraints}
        />
      )

    default:
      return (
        <StringField
          name={fieldName}
          label={label}
          constraints={constraints.constraints}
        />
      )
  }
}

interface ObjectFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  description?: string
  constraints?: objectConstraintT
}

function ObjectField<T extends FieldValues>({
  name,
  label,
  description,
  constraints,
}: ObjectFieldProps<T>) {
  const { setValue, watch } = useFormContext<T>()
  const [newKey, setNewKey] = useState("")

  const currentValue: any = watch(name) || {}
  const objectKeys = Object.keys(currentValue)

  const getDefaultValue = () => {
    if (!constraints) return ""

    switch (constraints.type) {
      case "string":
        return constraints.constraints?.defaultValue || ""
      case "number":
        return constraints.constraints?.defaultValue || 0
      case "boolean":
        return constraints.constraints?.defaultValue || false
      default:
        return ""
    }
  }

  const handleAddKey = () => {
    if (!newKey.trim() || currentValue[newKey] !== undefined) {
      return
    }

    setValue(name, {
      ...currentValue,
      [newKey]: getDefaultValue(),
    } as any)

    setNewKey("")
  }

  const handleDeleteKey = (key: string) => {
    const newValue = { ...currentValue }
    delete newValue[key]
    setValue(name, newValue as any)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{label}</CardTitle>

          <Badge variant="secondary">Object</Badge>

          <Badge variant="outline" className="ml-1">
            {objectKeys.length} keys
          </Badge>
        </div>

        {description && (
          <CardDescription>{description}</CardDescription>
        )}

        <CardAction>
          <div className="flex gap-2">
            <Input
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              placeholder="Key name"
              className="h-9"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddKey()
                }
              }}
            />
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={handleAddKey}
              disabled={!newKey.trim() || currentValue[newKey] !== undefined}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3">
        {
          objectKeys?.map((key) => {
            const fieldName = `${name}.${key}` as Path<T>

            return (
              <div key={key} className={cn("flex gap-2", constraints?.type === "boolean" ? "items-center" : "items-start")}>
                <div className="flex-1">
                  <ObjectFieldRenderer
                    label={key}
                    fieldName={fieldName}
                    constraints={constraints}
                  />
                </div>

                <Button
                  size="icon"
                  type="button"
                  variant="ghost"
                  onClick={() => handleDeleteKey(key)}
                  className={cn(constraints?.type !== "boolean" && "mt-6")}
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            )
          })
        }
      </CardContent>
    </Card>
  )
}
