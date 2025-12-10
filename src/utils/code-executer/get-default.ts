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

function mergeArrayConstraints(oldC?: arrayConstraintT, newC?: arrayConstraintT): arrayConstraintT | undefined {
  if (!oldC && !newC) return undefined
  if (!oldC) return newC
  if (!newC) return oldC

  return {
    ...oldC,
    ...newC,
    template: newC.template ?? oldC.template,
    byIndex: {
      ...oldC.byIndex,
      ...newC.byIndex,
    },
  }
}

function mergeObjectConstraints(oldC?: objectConstraintT, newC?: objectConstraintT): objectConstraintT | undefined {
  if (!oldC && !newC) return undefined
  if (!oldC) return newC
  if (!newC) return oldC

  if ('type' in oldC || 'type' in newC) {
    return newC
  }

  return {
    ...oldC,
    ...newC,
  }
}

export function mergeParams(params: paramT[] = [], newParams: paramT[] = []): paramT[] {
  return params.map((oldParam) => {
    const updated = newParams.find((p) => p.name === oldParam.name)
    if (!updated) return oldParam

    if (oldParam.type !== updated.type) {
      return updated
    }

    if (oldParam.type === "array" && updated.type === "array") {
      return {
        ...oldParam,
        ...updated,
        constraints: mergeArrayConstraints(
          oldParam.constraints,
          updated.constraints
        ),
      }
    }

    if (oldParam.type === "object" && updated.type === "object") {
      return {
        ...oldParam,
        ...updated,
        constraints: mergeObjectConstraints(
          oldParam.constraints,
          updated.constraints
        ),
      }
    }

    if (oldParam.type === "string" && updated.type === "string") {
      return {
        ...oldParam,
        ...updated,
        constraints: {
          ...oldParam.constraints,
          ...updated.constraints,
        },
      }
    }

    if (oldParam.type === "number" && updated.type === "number") {
      return {
        ...oldParam,
        ...updated,
        constraints: {
          ...oldParam.constraints,
          ...updated.constraints,
        },
      }
    }

    if (oldParam.type === "boolean" && updated.type === "boolean") {
      return {
        ...oldParam,
        ...updated,
      }
    }

    return {
      ...oldParam,
      ...updated,
    }
  }) as any
}