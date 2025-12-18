
type MergeableConstraint<ByKey extends string | number> = {
  template?: ConstraintLeafT
  by?: Record<ByKey, ConstraintLeafT>
}

function mergeConstraints<ByKey extends string | number, T extends MergeableConstraint<ByKey>>(oldC?: T, newC?: T): T | undefined {
  if (!oldC && !newC) return undefined
  if (!oldC) return newC
  if (!newC) return oldC

  return {
    ...oldC,
    ...newC,
    template: newC.template ?? oldC.template,
    by: {
      ...(oldC.by ?? {}),
      ...(newC.by ?? {}),
    },
  }
}

export function mergeParams(params: paramT[] = [], newParams: paramT[] = []): paramT[] {
  const newParamsMap = new Map(newParams.map(p => [p.name, p]))

  return params.map((oldParam) => {
    const updated = newParamsMap.get(oldParam.name)
    if (!updated) return oldParam

    if (oldParam.type !== updated.type) return updated

    if (oldParam.type === "array") {
      return {
        ...oldParam,
        ...updated,
        constraints: mergeConstraints<number, arrayConstraintT>(
          oldParam?.constraints,
          (updated as arrayParamT)?.constraints
        ),
      }
    }

    if (oldParam.type === "object") {
      return {
        ...oldParam,
        ...updated,
        constraints: mergeConstraints<string, objectConstraintT>(
          oldParam?.constraints,
          (updated as objectParamT)?.constraints
        ),
      }
    }

    if (oldParam.type === "string" || oldParam.type === "number") {
      return {
        ...oldParam,
        ...updated,
        constraints: {
          ...oldParam.constraints,
          ...(updated as stringParamT)?.constraints,
        },
      }
    }

    return {
      ...oldParam,
      ...updated,
    }
  }) as paramT[]
}