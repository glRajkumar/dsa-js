import { useState } from "react"
import { FieldValues, Path, useFieldArray, useFormContext } from "react-hook-form"
import { Plus, Trash } from "lucide-react"

import type {
  paramT,
  arrayConstraintT,
  objectConstraintT,
  ConstraintLeafT,
  stringConstraintT,
  numberConstraintT,
} from "@/utils/code-executer/schema"

import { getDefaultValueByConstraints } from "@/utils/code-executer/get-default"
import { cn } from "@/lib/utils"

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn-ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn-ui/select"
import { InputWrapper, SwitchWrapper } from "@/components/shadcn-ui/field-wrapper-rhf"
import { Textarea } from "@/components/shadcn-ui/textarea"
import { Button } from "@/components/shadcn-ui/button"
import { Badge } from "@/components/shadcn-ui/badge"
import { Input } from "@/components/shadcn-ui/input"
import { Label } from "@/components/shadcn-ui/label"

interface ParamFieldProps<T extends FieldValues> {
  param: paramT
  name: Path<T>
}

export function ParamField<T extends FieldValues>({ param, name }: ParamFieldProps<T>) {
  if (!param.type) {
    return (
      <DynamicTypeField
        name={name}
        label={param.name}
        description={param.description}
      />
    )
  }

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
          constraints={param?.constraints}
        />
      )
  }
}

interface DynamicTypeFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  description?: string
}

function DynamicTypeField<T extends FieldValues>({
  name,
  label,
  description,
}: DynamicTypeFieldProps<T>) {
  const { setValue, watch } = useFormContext<T>()
  const [selectedType, setSelectedType] = useState<string>("string")
  const currentValue = watch(name)

  const handleTypeChange = (newType: string) => {
    setSelectedType(newType)
    switch (newType) {
      case "boolean":
        setValue(name, false as any)
        break
      case "number":
        setValue(name, 0 as any)
        break
      case "array":
        setValue(name, [] as any)
        break
      case "object":
        setValue(name, {} as any)
        break
      default:
        setValue(name, "" as any)
    }
  }

  const handleJsonChange = (value: string) => {
    try {
      const parsed = JSON.parse(value)
      setValue(name, parsed as any)
    } catch (e) {
      // Invalid JSON, don't update
      console.log(e)
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <Select value={selectedType} onValueChange={handleTypeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="string">String</SelectItem>
          <SelectItem value="number">Number</SelectItem>
          <SelectItem value="boolean">Boolean</SelectItem>
          <SelectItem value="array">Array</SelectItem>
          <SelectItem value="object">Object</SelectItem>
        </SelectContent>
      </Select>

      {selectedType === "string" && (
        <Input
          value={(currentValue as string) || ""}
          onChange={(e) => setValue(name, e.target.value as any)}
          placeholder="Enter string value"
        />
      )}

      {selectedType === "number" && (
        <Input
          type="number"
          value={(currentValue as number) || 0}
          onChange={(e) => setValue(name, Number(e.target.value) as any)}
          placeholder="Enter number"
        />
      )}

      {selectedType === "boolean" && (
        <Select
          value={String(currentValue)}
          onValueChange={(v) => setValue(name, (v === "true") as any)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">True</SelectItem>
            <SelectItem value="false">False</SelectItem>
          </SelectContent>
        </Select>
      )}

      {(selectedType === "array" || selectedType === "object") && (
        <Textarea
          value={JSON.stringify(currentValue, null, 2)}
          onChange={(e) => handleJsonChange(e.target.value)}
          placeholder={`Enter JSON ${selectedType}`}
          className="font-mono text-sm"
          rows={6}
        />
      )}
    </div>
  )
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
  constraints = {},
}: StringFieldProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <InputWrapper
      name={name}
      label={label}
      control={control}
      description={description}
      placeholder={`Enter ${label}`}
      {...constraints}
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
  constraints = {},
}: NumberFieldProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <InputWrapper
      name={name}
      type="number"
      label={label}
      control={control}
      description={description}
      placeholder={`Enter ${label}`}
      {...constraints}
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
  constraints?: ConstraintLeafT
  label?: string
}

function ArrayItemRenderer<T extends FieldValues>({
  itemName,
  index,
  constraints,
}: ArrayItemProps<T>) {
  const label = `Item ${index + 1}`

  if (!constraints) {
    return (
      <DynamicTypeField
        name={itemName}
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
          constraints={constraints.constraints}
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

  const handleAdd = () => {
    const defaultVal = constraints?.template
      ? getDefaultValueByConstraints(constraints.template)
      : ""
    append(defaultVal as any)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{label}</CardTitle>

          <Badge variant="secondary" className="ml-2">
            Array{constraints?.template ? `[${constraints.template.type}]` : ""}
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
            onClick={handleAdd}
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
          const itemConstraint = constraints?.byIndex?.[index] || constraints?.template

          return (
            <div
              key={field.id}
              className={cn(
                "flex gap-2",
                itemConstraint?.type === "boolean" ? "items-center" : "items-start"
              )}
            >
              <div className="flex-1">
                <ArrayItemRenderer
                  index={index}
                  itemName={itemName}
                  constraints={itemConstraint}
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
                className={cn(itemConstraint?.type !== "boolean" && "mt-6")}
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
  constraints?: ConstraintLeafT
}

function ObjectFieldRenderer<T extends FieldValues>({
  label,
  fieldName,
  constraints,
}: ObjectFieldRendererProps<T>) {
  if (!constraints) {
    return (
      <DynamicTypeField
        name={fieldName}
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
          constraints={constraints.constraints}
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

  const isLeafConstraint = constraints && 'type' in constraints
  const propertyConstraints = !isLeafConstraint ? constraints as Record<string, ConstraintLeafT> : undefined

  const handleAddKey = () => {
    if (!newKey.trim() || currentValue[newKey] !== undefined) {
      return
    }

    const defaultVal = propertyConstraints?.[newKey]
      ? getDefaultValueByConstraints(propertyConstraints[newKey])
      : ""

    setValue(name, {
      ...currentValue,
      [newKey]: defaultVal,
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
        {objectKeys?.map((key) => {
          const fieldName = `${name}.${key}` as Path<T>
          const keyConstraint = propertyConstraints?.[key]

          return (
            <div
              key={key}
              className={cn(
                "flex gap-2",
                keyConstraint?.type === "boolean" ? "items-center" : "items-start"
              )}
            >
              <div className="flex-1">
                <ObjectFieldRenderer
                  label={key}
                  fieldName={fieldName}
                  constraints={keyConstraint}
                />
              </div>

              <Button
                size="icon"
                type="button"
                variant="ghost"
                onClick={() => handleDeleteKey(key)}
                className={cn(keyConstraint?.type !== "boolean" && "mt-6")}
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
