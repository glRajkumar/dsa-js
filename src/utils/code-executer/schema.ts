import { z } from "zod"

function generateLeafSchema(constraint: ConstraintLeafT): z.ZodTypeAny {
  let schema: z.ZodTypeAny

  switch (constraint.type) {
    case "string": {
      schema = z.string()
      const { constraints } = constraint
      if (constraints?.minLength !== undefined) {
        schema = (schema as z.ZodString).min(constraints.minLength,
          `Minimum length is ${constraints.minLength}`)
      }
      if (constraints?.maxLength !== undefined) {
        schema = (schema as z.ZodString).max(constraints.maxLength,
          `Maximum length is ${constraints.maxLength}`)
      }
      if (constraints?.pattern) {
        schema = (schema as z.ZodString).regex(new RegExp(constraints.pattern),
          `Must match pattern: ${constraints.pattern}`)
      }
      return schema
    }
    case "number": {
      schema = z.number()
      const { constraints } = constraint
      if (constraints?.min !== undefined) {
        schema = (schema as z.ZodNumber).min(constraints.min,
          `Minimum value is ${constraints.min}`)
      }
      if (constraints?.max !== undefined) {
        schema = (schema as z.ZodNumber).max(constraints.max,
          `Maximum value is ${constraints.max}`)
      }
      return schema
    }
    case "boolean": {
      return z.boolean()
    }
    case "enum": {
      return z.enum(constraint.constraints.values as [string, ...string[]])
    }
    case "array": {
      const { constraints } = constraint
      let itemSchema: z.ZodTypeAny = z.any()

      if (constraints?.template) {
        itemSchema = generateLeafSchema(constraints.template)
      }

      if (constraints?.by) {
        schema = z.array(z.any()).superRefine((arr, ctx) => {
          arr.forEach((item, index) => {
            let result: any

            if (constraints?.by?.[index]) {
              const indexConstraint = constraints?.by?.[index]
              const curr = generateLeafSchema(indexConstraint)
              result = curr.safeParse(item)
            } else {
              result = itemSchema.safeParse(item)
            }

            if (!result.success) {
              result.error.issues.forEach((issue: any) => {
                ctx.addIssue({
                  ...issue,
                  path: [index, ...issue.path],
                })
              })
            }
          })
        })

      } else {
        schema = z.array(itemSchema)
      }

      if (constraints?.min !== undefined) {
        schema = (schema as z.ZodArray<any>).min(constraints.min, `Minimum ${constraints.min} items required`)
      } else if (constraints?.by) {
        const max = Math.max(...Object.keys(constraints?.by).map(Number)) ?? -1
        const min = max + 1
        schema = (schema as z.ZodArray<any>).min(min, `Minimum ${min} items required`)
      }

      if (constraints?.max !== undefined) {
        schema = (schema as z.ZodArray<any>).max(constraints.max, `Maximum ${constraints.max} items allowed`)
      }

      return schema
    }
    case "object": {
      const { constraints } = constraint

      if (!constraints) {
        return z.record(z.string(), z.any())
      }

      if ('type' in constraints) {
        const valSchema = generateLeafSchema(constraints as ConstraintLeafT)
        return z.record(z.string(), valSchema)
      }

      const { template, by } = constraints as objectConstraintT

      if (by) {
        const shape: Record<string, z.ZodTypeAny> = {}
        for (const [key, leaf] of Object.entries(by)) {
          shape[key] = generateLeafSchema(leaf)
        }
        return z.object(shape)
      }

      if (template) {
        const valSchema = generateLeafSchema(template)
        return z.record(z.string(), valSchema)
      }

      return z.record(z.string(), z.any())
    }
    default: {
      return z.any()
    }
  }
}

export function generateZodSchema(params: paramT[]) {
  const shape: Record<string, z.ZodTypeAny> = {}

  params.forEach(param => {
    let schema: z.ZodTypeAny

    const constraintLeaf: ConstraintLeafT = {
      type: param.type ?? 'any' as any,
      constraints: (param as any)?.constraints,
    }

    schema = generateLeafSchema(constraintLeaf)

    if (!param.required) {
      schema = schema.optional()
    }

    if (param.defaultValue !== undefined) {
      schema = schema.default(param.defaultValue)
    }

    shape[param.name] = schema
  })

  return z.object(shape)
}

type SchemaStructure =
  | string
  | { [key: string]: SchemaStructure }
  | SchemaStructure[]

type SchemaObject = { [key: string]: SchemaStructure }

export function getLeafStructure(leaf: ConstraintLeafT): SchemaStructure {
  switch (leaf.type) {
    case 'boolean': return 'boolean'
    case 'string': return 'string'
    case 'number': return 'number'
    case 'enum': return 'enum'

    case 'object':
      if (leaf.constraints) {
        const result: SchemaObject = {}

        if ('template' in leaf.constraints && leaf.constraints.template) {
          result.template = getLeafStructure(leaf.constraints.template)
        }

        if ('by' in leaf.constraints && leaf.constraints.by) {
          for (const [key, value] of Object.entries(leaf.constraints.by)) {
            result[key] = getLeafStructure(value)
          }
        }

        return result
      }
      return 'object'

    case 'array':
      if (leaf.constraints) {
        const result: SchemaObject = {}

        if ('template' in leaf.constraints && leaf.constraints.template) {
          result.template = getLeafStructure(leaf.constraints.template)
        }

        if ('by' in leaf.constraints && leaf.constraints.by) {
          for (const [key, value] of Object.entries(leaf.constraints.by)) {
            result[key] = getLeafStructure(value)
          }
        }

        return result
      }
      return 'array'

    default:
      return 'any'
  }
}