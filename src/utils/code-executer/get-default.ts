import type { arrayConstraintT, objectConstraintT, paramT, ConstraintLeafT } from "./schema"

function getPrimitiveFallback(type: string) {
  switch (type) {
    case "string": return ""
    case "number": return 0
    case "boolean": return false
    default: return null
  }
}

function getDefaultValueForParam(param: paramT): any {
  const { type, defaultValue } = param

  if (defaultValue !== undefined) return defaultValue
  if (!type) return null

  return getPrimitiveFallback(type)
}

function getDefaultForConstraintLeaf(constraints: ConstraintLeafT): any {
  switch (constraints.type) {
    case "string":
      return constraints.constraints?.minLength ?? ""
    case "number":
      return constraints.constraints?.min ?? 0
    case "boolean":
      return false
    case "array":
      return getArrayDefault(constraints.constraints)
    case "object":
      return getObjectDefault(constraints.constraints)
    default:
      return null
  }
}

function getObjectDefault(constraints?: objectConstraintT): any {
  if (!constraints) {
    return {}
  }

  if ('type' in constraints) {
    return getDefaultForConstraintLeaf(constraints as ConstraintLeafT)
  }

  const obj: Record<string, any> = {}

  for (const key in constraints) {
    const field = constraints[key]
    if (field) {
      obj[key] = getDefaultForConstraintLeaf(field)
    }
  }

  return obj
}

function getArrayDefault(constraints?: arrayConstraintT): any[] {
  if (constraints?.defaultValue !== undefined) {
    return constraints.defaultValue
  }

  if (!constraints?.template) {
    const minItems = constraints?.min ?? 0
    return Array(minItems).fill("")
  }

  const minItems = constraints.min ?? 0
  const defaultItem = getDefaultForConstraintLeaf(constraints.template)

  return Array(minItems).fill(null).map(() =>
    typeof defaultItem === "object" ? { ...defaultItem } : defaultItem
  )
}

export function getDefaultValues(params: paramT[]) {
  const result: Record<string, any> = {}

  for (const param of params) {
    result[param.name] = getDefaultValueForParam(param)
  }

  return result
}

export const getDefaultValueByConstraints = (constraints?: ConstraintLeafT | arrayConstraintT) => {
  if (!constraints) return ""

  if ('type' in constraints) {
    return getDefaultForConstraintLeaf(constraints)
  }

  return getArrayDefault(constraints)
}
