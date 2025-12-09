import { z } from "zod"

export const PrimitiveZ = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.undefined(),
])
export type primitiveT = z.infer<typeof PrimitiveZ>
export type primOrArrOrObjT = primitiveT | primArrT | primObjT

type primArrT = Array<primOrArrOrObjT>
type primObjT = {
  [key: string]: primOrArrOrObjT
}

export const PrimOrArrOrObjZ: z.ZodType<primOrArrOrObjT> = z.lazy(() => z.union([
  PrimitiveZ,
  z.array(PrimOrArrOrObjZ),
  z.record(z.string(), PrimOrArrOrObjZ),
]))

export const NumberConstraintZ = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  defaultValue: z.number().optional(),
})

export const StringConstraintZ = z.object({
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
  defaultValue: z.string().optional(),
})

export const BooleanConstraintZ = z.object({
  defaultValue: z.boolean().optional(),
})

export type numberConstraintT = z.infer<typeof NumberConstraintZ>
export type stringConstraintT = z.infer<typeof StringConstraintZ>
export type booleanConstraintT = z.infer<typeof BooleanConstraintZ>

export type arrayConstraintT = {
  min?: number
  max?: number
  canIncludeFalsy?: boolean
} & (
    | { type: "string"; constraints?: stringConstraintT; defaultValue?: string[] }
    | { type: "number"; constraints?: numberConstraintT; defaultValue?: number[] }
    | { type: "boolean"; constraints?: booleanConstraintT; defaultValue?: boolean[] }
    | { type: "array"; constraints?: arrayConstraintT; defaultValue?: primOrArrOrObjT[] }
    | { type: "object"; constraints?: Record<string, objectConstraintT>; defaultValue?: Record<string, primOrArrOrObjT>[] }
  )

export type objectConstraintT =
  | { type: "string"; constraints?: stringConstraintT; defaultValue?: Record<string, string> }
  | { type: "number"; constraints?: numberConstraintT; defaultValue?: Record<string, number> }
  | { type: "boolean"; constraints?: booleanConstraintT; defaultValue?: Record<string, boolean> }
  | { type: "array"; constraints?: arrayConstraintT; defaultValue?: Record<string, primOrArrOrObjT[]> }
  | { type: "object"; constraints?: Record<string, objectConstraintT>; defaultValue?: Record<string, primOrArrOrObjT> }

const CommonArrayConstraintZ = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  canIncludeFalsy: z.boolean().optional(),
})

export const ArrayConstraintZ: z.ZodType<arrayConstraintT> = z.discriminatedUnion("type", [
  CommonArrayConstraintZ.extend({
    type: z.literal("string"),
    constraints: StringConstraintZ.optional(),
    defaultValue: z.array(z.string()).optional(),
  }),

  CommonArrayConstraintZ.extend({
    type: z.literal("number"),
    constraints: NumberConstraintZ.optional(),
    defaultValue: z.array(z.number()).optional(),
  }),

  CommonArrayConstraintZ.extend({
    type: z.literal("boolean"),
    constraints: BooleanConstraintZ.optional(),
    defaultValue: z.array(z.boolean()).optional(),
  }),

  z.lazy(() =>
    CommonArrayConstraintZ.extend({
      type: z.literal("array"),
      constraints: z.lazy(() => ArrayConstraintZ).optional(),
      defaultValue: z.array(PrimOrArrOrObjZ).optional(),
    })
  ),

  z.lazy(() =>
    CommonArrayConstraintZ.extend({
      type: z.literal("object"),
      constraints: z.record(z.string(), z.lazy(() => ObjectConstraintZ)).optional(),
      defaultValue: z.array(z.record(z.string(), PrimOrArrOrObjZ)).optional(),
    })
  )
])

export const ObjectConstraintZ: z.ZodType<objectConstraintT> = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("string"),
    constraints: StringConstraintZ.optional(),
    defaultValue: z.record(z.string(), z.string()).optional(),
  }),

  z.object({
    type: z.literal("number"),
    constraints: NumberConstraintZ.optional(),
    defaultValue: z.record(z.string(), z.number()).optional(),
  }),

  z.object({
    type: z.literal("boolean"),
    constraints: BooleanConstraintZ.optional(),
    defaultValue: z.record(z.string(), z.boolean()).optional(),
  }),

  z.lazy(() => z.object({
    type: z.literal("array"),
    constraints: z.lazy(() => ArrayConstraintZ).optional(),
    defaultValue: z.record(z.string(), z.array(PrimOrArrOrObjZ)).optional(),
  })),

  z.lazy(() => z.object({
    type: z.literal("object"),
    constraints: z.record(z.string(), z.lazy(() => ObjectConstraintZ)).optional(),
    defaultValue: z.record(z.string(), PrimOrArrOrObjZ).optional(),
  }))
])

const CommonParamZ = z.object({
  name: z.string(),
  required: z.boolean().optional(),
  description: z.string().optional(),
})

export const ParamZ = z.discriminatedUnion("type", [
  CommonParamZ.extend({
    type: z.literal("string"),
    constraints: StringConstraintZ.optional(),
  }),
  CommonParamZ.extend({
    type: z.literal("number"),
    constraints: NumberConstraintZ.optional(),
  }),
  CommonParamZ.extend({
    type: z.literal("boolean"),
    constraints: BooleanConstraintZ.optional(),
  }),
  CommonParamZ.extend({
    type: z.literal("array"),
    constraints: ArrayConstraintZ.optional(),
  }),
  CommonParamZ.extend({
    type: z.literal("object"),
    constraints: ObjectConstraintZ.optional(),
  }),
])

export const FunctionMetadataZ = z.object({
  type: z.literal("function"),
  name: z.string(),
  params: z.array(ParamZ).optional(),
  isAsync: z.boolean().optional(),
  description: z.string().optional(),
})

export const ClassMetadataZ = z.object({
  type: z.literal("class"),
  name: z.string(),
  construct: z.array(ParamZ).optional(),
  methods: z.array(FunctionMetadataZ).optional(),
  description: z.string().optional(),
})

export const TestCaseZ = z.object({
  input: PrimOrArrOrObjZ,
  output: PrimOrArrOrObjZ,
})

export const MetaZ = z.record(
  z.string(),
  z.union([FunctionMetadataZ, ClassMetadataZ])
)

export const JsonMetaDataZ = z.object({
  testCases: z.array(TestCaseZ).optional(),
  meta: MetaZ,
})

export const LogZ = z.object({
  input: PrimOrArrOrObjZ,
  output: PrimOrArrOrObjZ,
  error: z.string().optional(),
  method: z.string().optional(),
})

export const FnOrClsArrZ = z.array(
  z.union([FunctionMetadataZ, ClassMetadataZ])
)

export type paramT = z.infer<typeof ParamZ>
export type functionMetadataT = z.infer<typeof FunctionMetadataZ>
export type classMetadataT = z.infer<typeof ClassMetadataZ>
export type fnOrClsArrT = z.infer<typeof FnOrClsArrZ>
export type jsonMetaDataT = z.infer<typeof JsonMetaDataZ>
export type testCaseT = z.infer<typeof TestCaseZ>
export type metaT = z.infer<typeof MetaZ>
export type logT = z.infer<typeof LogZ>
