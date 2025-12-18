import { useMemo, useState } from "react"
import { useFormContext } from "react-hook-form"
import { Plus, Trash } from "lucide-react"

import { getArrayDefault, getObjectDefault } from "@/utils/code-executer/get-default"
import { getLeafStructure } from "@/utils/code-executer/schema"
import { cn } from "@/lib/utils"

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shadcn-ui/card"
import { InputWrapper, SwitchWrapper, SelectWrapper as EnumSelectWrapper } from "@/components/shadcn-ui/field-wrapper-rhf"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/shadcn-ui/field"
import { TooltipWrapper } from "@/components/shadcn-ui/tooltip"
import { SelectWrapper } from "@/components/shadcn-ui/select"
import { Textarea } from "@/components/shadcn-ui/textarea"
import { Button } from "@/components/shadcn-ui/button"
import { Switch } from "@/components/shadcn-ui/switch"
import { Badge } from "@/components/shadcn-ui/badge"
import { Input } from "@/components/shadcn-ui/input"

function getDefaultType(val: any) {
  if (typeof val === "object") {
    if (val === null) return "String"
    if (Array.isArray(val)) return "Array"
    return "Object"
  }

  if (typeof val === "boolean") return "Boolean"
  if (typeof val === "number") return "Number"
  return "String"
}

function LabelTooltip({ title, content }: { title: "Object" | "Array", content: ReturnType<typeof getLeafStructure> }) {
  return (
    <TooltipWrapper
      trigger={<Badge variant="secondary">{title}</Badge>}
      content={<pre>{JSON.stringify(content, null, 2).replaceAll('"', "")}</pre>}
      contentCls="px-4"
    />
  )
}

function ObjTextField({ name, type, isInvalid }: { name: string, type: string, isInvalid: boolean }) {
  const { clearErrors, setValue, setError, watch } = useFormContext()
  const oldVal = watch(name)

  const [val, setVal] = useState(oldVal ? JSON.stringify(oldVal, null, 2) : "")

  function getVal() {
    try {
      const str = JSON.stringify(oldVal, null, 2)
      return val === str ? str : val

    } catch (error) {
      return val
    }
  }

  function onBlur() {
    if (!val) return
    try {
      const value = JSON.parse(val)
      setValue(name, value)
      clearErrors(name)

    } catch (error) {
      setError(name, { message: `Error on ${type}`, type: "custom" }, { shouldFocus: true })
    }
  }

  return (
    <Textarea
      id={name}
      rows={6}
      value={getVal()}
      onBlur={onBlur}
      onChange={e => setVal(e.target.value)}
      placeholder={`Enter JSON ${type}`}
      aria-invalid={isInvalid}
    />
  )
}

type labelT = { label: string }
type FieldRendererProps = paramT & labelT
export function FieldRenderer({ type, defaultValue, required, ...rest }: FieldRendererProps) {
  if (!type) return <DynamicTypeField {...rest as untypedParamT & labelT} />

  switch (type) {
    case "boolean": return <BooleanField {...rest as booleanParamT & labelT} />
    case "object": return <ObjectField {...rest as objectParamT & labelT} />
    case "number": return <NumberField {...rest as numberParamT & labelT} />
    case "array": return <ArrayField {...rest as arrayParamT & labelT} />
    case "enum": return <EnumField {...rest as enumParamT & labelT} />
    default: return <StringField {...rest as stringParamT & labelT} />
  }
}

interface basePropsT {
  name: string
  label: string
  description?: string
}
function DynamicTypeField({
  name,
  label,
  description,
}: basePropsT) {
  const { formState: { errors }, setValue, watch } = useFormContext()
  const currentValue = watch(name)

  const [selectedType, setSelectedType] = useState(getDefaultType(currentValue))
  const isInvalid = !!errors?.[name]

  const handleTypeChange = (newType: string) => {
    setSelectedType(newType)
    switch (newType) {
      case "Boolean":
        setValue(name, false as any)
        break
      case "Number":
        setValue(name, 0 as any)
        break
      case "Array":
        setValue(name, [] as any)
        break
      case "Object":
        setValue(name, {} as any)
        break
      default:
        setValue(name, "" as any)
    }
  }

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}

      <SelectWrapper
        value={selectedType}
        onValueChange={handleTypeChange}
        triggerCls="mb-1"
        options={["String", "Number", "Boolean", "Array", "Object"]}
      />

      {selectedType === "String" && (
        <Input
          id={name}
          value={(currentValue as string) ?? ""}
          onChange={(e) => setValue(name, e.target.value as any)}
          placeholder="Enter string value"
        />
      )}

      {selectedType === "Number" && (
        <Input
          id={name}
          type="number"
          value={(currentValue as number) ?? 0}
          onChange={e => {
            const val = e.target.valueAsNumber
            const final = Number.isNaN(val) ? "" : val
            setValue(name, final as any)
          }}
          placeholder="Enter number value"
        />
      )}

      {selectedType === "Boolean" && (
        <div>
          <Switch
            id={name}
            checked={!!currentValue}
            onCheckedChange={(v) => setValue(name, v as any)}
          />
        </div>
      )}

      {(selectedType === "Array" || selectedType === "Object") && (
        <ObjTextField
          name={name}
          type={selectedType}
          isInvalid={isInvalid}
        />
      )}

      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={[{ message: errors?.[name]?.message as string }]} />}
    </Field>
  )
}

type StringFieldProps = basePropsT & {
  constraints?: stringConstraintT
}
function StringField({ constraints, ...props }: StringFieldProps) {
  const { control } = useFormContext()

  return (
    <InputWrapper
      control={control}
      placeholder={`Enter ${props.label}`}
      {...props}
      {...constraints}
    />
  )
}

type NumberFieldProps = basePropsT & {
  constraints?: numberConstraintT
}
function NumberField({ constraints, ...props }: NumberFieldProps) {
  const { control } = useFormContext()

  return (
    <InputWrapper
      type="number"
      control={control}
      placeholder={`Enter ${props.label}`}
      {...props}
      {...constraints}
    />
  )
}

function BooleanField(props: basePropsT) {
  const { control } = useFormContext()

  return (
    <SwitchWrapper
      control={control}
      className="[&_div]:justify-start"
      {...props}
    />
  )
}

type EnumFieldProps = basePropsT & {
  constraints: enumConstraintT
}
function EnumField({ constraints, ...props }: EnumFieldProps) {
  const { control } = useFormContext()

  return (
    <EnumSelectWrapper
      control={control}
      options={constraints.values as string[]}
      {...props}
    />
  )
}

type ArrayFieldProps = basePropsT & {
  constraints?: arrayConstraintT
}
function ArrayField({
  name,
  label,
  description,
  constraints,
}: ArrayFieldProps) {
  const { formState: { errors }, watch, setValue } = useFormContext()
  const currentValue: any[] = watch(name) as any ?? []

  const list = useMemo(() => {
    return currentValue?.map((_, k) => {
      let root = constraints?.by?.[k] || constraints?.template
      if (root?.type === "object" && root?.constraints && (root?.constraints?.by?.[k] || root?.constraints?.template)) {
        root = root?.constraints?.by?.[k] || root?.constraints?.template
      }
      return {
        name: `${name}.${k}`,
        label: `Item ${k}`,
        ...(root)
      } as any
    })
  }, [currentValue, constraints])

  const handleAdd = () => {
    const i = currentValue.length
    const defaults = getArrayDefault(constraints)
    setValue(name, [...currentValue, defaults[i] ?? defaults[0] ?? ""] as any)
  }

  const handleDelete = (i: number) => {
    setValue(name, currentValue?.filter((_, j) => i !== j) as any)
  }

  return (
    <Card className="@container overflow-x-auto">
      <CardHeader className="flex items-center gap-2 flex-wrap min-w-80">
        <div className="flex items-center gap-2 flex-wrap mr-auto">
          <CardTitle>{label}</CardTitle>

          <LabelTooltip
            title="Array"
            content={getLeafStructure({ type: "array", constraints })}
          />

          <Badge variant="outline">
            {currentValue?.length} items
          </Badge>

          {constraints?.min !== undefined && (
            <Badge variant="outline">
              min: {constraints.min}
            </Badge>
          )}

          {constraints?.max !== undefined && (
            <Badge variant="outline">
              max: {constraints.max}
            </Badge>
          )}
        </div>

        {description && (
          <CardDescription className="@md:order-1 w-full">{description}</CardDescription>
        )}

        <CardAction>
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={handleAdd}
            disabled={constraints?.max !== undefined && currentValue.length >= constraints.max}
          >
            <Plus className="h-4 w-4" />
            Add {constraints?.max !== undefined && `(${currentValue.length}/${constraints.max})`}
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3 min-w-80">
        {list.map((param, i) => (
          <div
            key={param.name}
            className="relative group"
          >
            <FieldRenderer {...param} />

            <Button
              size="icon"
              type="button"
              variant="ghost"
              onClick={() => handleDelete(i)}
              className={cn("size-auto p-0 hidden group-hover:block absolute right-2 text-muted-foreground hover:text-destructive", param?.type !== "boolean" ? "top-1" : "top-0")}
            >
              <Trash className="h-1 w-1" />
            </Button>
          </div>
        ))}
      </CardContent>

      {
        errors && Object.keys(errors)?.length > 0 &&
        <CardFooter className="text-sm text-destructive">
          Invalid Input, check out reference schema for validation
        </CardFooter>
      }
    </Card>
  )
}

type ObjectFieldProps = basePropsT & {
  constraints?: objectConstraintT
}
function ObjectField({
  name,
  label,
  description,
  constraints,
}: ObjectFieldProps) {
  const { formState: { errors }, setValue, watch } = useFormContext()
  const [newKey, setNewKey] = useState("")

  const currentValue: Record<string, unknown> = watch(name) as any ?? {}
  const objectKeys = Object.keys(currentValue)

  const list = useMemo(() => {
    return Object.keys(currentValue).map(k => {
      let root = constraints?.by?.[k] || constraints?.template
      if (root?.type === "object" && root?.constraints && (root?.constraints?.by?.[k] || root?.constraints?.template)) {
        root = root?.constraints?.by?.[k] || root?.constraints?.template
      }
      return {
        name: `${name}.${k}`,
        label: k,
        ...(root)
      } as any
    })
  }, [currentValue, constraints])

  const handleAdd = () => {
    const key = newKey.trim()
    if (!key || currentValue[key] !== undefined) return
    const defaults = getObjectDefault(constraints)

    setValue(name, {
      ...currentValue,
      [newKey]: defaults?.[newKey] ?? ""
    } as any)
    setNewKey("")
  }

  const handleDelete = (key: string) => {
    const newVal = { ...currentValue }
    delete newVal[key]
    setValue(name, newVal as any)
  }

  return (
    <Card className="@container overflow-x-auto">
      <CardHeader className="flex items-center gap-2 flex-wrap min-w-80">
        <div className="flex items-center gap-2 flex-wrap mr-auto">
          <CardTitle>{label}</CardTitle>

          <LabelTooltip
            title="Object"
            content={getLeafStructure({ type: "object", constraints })}
          />

          <Badge variant="outline">{objectKeys.length} keys</Badge>
        </div>

        {description && (
          <CardDescription className="@md:order-1 w-full">{description}</CardDescription>
        )}

        <CardAction className="flex items-center gap-2">
          <Input
            value={newKey}
            onChange={e => setNewKey(e.target.value)}
            placeholder="Key name"
            className="h-9"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAdd()
              }
            }}
          />
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={handleAdd}
            disabled={!newKey.trim() || currentValue[newKey.trim()] !== undefined}
            className="h-9"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden @lg:block">Add</span>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3 min-w-80">
        {list.map((param) => (
          <div
            key={param.name}
            className="relative group"
          >
            <FieldRenderer {...param} />

            <Button
              size="icon"
              type="button"
              variant="ghost"
              onClick={() => handleDelete(param?.label)}
              className={cn("size-auto p-0 hidden group-hover:block absolute right-2 text-muted-foreground hover:text-destructive", param?.type !== "boolean" ? "top-1" : "top-0")}
            >
              <Trash className="h-1 w-1" />
            </Button>
          </div>
        ))}
      </CardContent>

      {
        errors && Object.keys(errors)?.length > 0 &&
        <CardFooter className="text-sm text-destructive">
          Invalid Input, check out reference schema for validation
        </CardFooter>
      }
    </Card>
  )
}
