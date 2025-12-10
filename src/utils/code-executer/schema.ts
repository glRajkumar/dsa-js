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
})

export const StringConstraintZ = z.object({
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
})

export type numberConstraintT = z.infer<typeof NumberConstraintZ>
export type stringConstraintT = z.infer<typeof StringConstraintZ>

export type ConstraintLeafT =
  | { type: "string"; constraints?: stringConstraintT }
  | { type: "number"; constraints?: numberConstraintT }
  | { type: "boolean" }
  | { type: "array"; constraints?: arrayConstraintT }
  | { type: "object"; constraints?: objectConstraintT }

export type objectConstraintT =
  | ConstraintLeafT
  | Record<string, ConstraintLeafT>

export type arrayConstraintT = {
  min?: number
  max?: number
  canIncludeFalsy?: boolean
  defaultValue?: primOrArrOrObjT[]
  template?: ConstraintLeafT
  byIndex?: Record<number, ConstraintLeafT>
}

export const ConstraintLeafZ: z.ZodType<ConstraintLeafT> = z.lazy(() =>
  z.discriminatedUnion("type", [
    z.object({
      type: z.literal("string"),
      constraints: StringConstraintZ.optional(),
    }),
    z.object({
      type: z.literal("number"),
      constraints: NumberConstraintZ.optional(),
    }),
    z.object({
      type: z.literal("boolean"),
    }),
    z.object({
      type: z.literal("array"),
      constraints: z.lazy(() => ArrayConstraintZ).optional(),
    }),
    z.object({
      type: z.literal("object"),
      constraints: z.lazy(() => ObjectConstraintZ).optional(),
    }),
  ]),
)

export const ObjectConstraintZ: z.ZodType<objectConstraintT> = z.lazy(() =>
  z.union([
    ConstraintLeafZ,
    z.record(z.string(), ConstraintLeafZ),
  ])
)

export const ArrayConstraintZ: z.ZodType<arrayConstraintT> = z.lazy(() =>
  z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    canIncludeFalsy: z.boolean().optional(),
    defaultValue: z.array(PrimOrArrOrObjZ).optional(),
    template: ConstraintLeafZ.optional(),
    byIndex: z.record(z.number(), ConstraintLeafZ).optional(),
  })
)

const CommonParamZ = z.object({
  name: z.string(),
  required: z.boolean().optional(),
  description: z.string().optional(),
})

const UntypedParamZ = CommonParamZ.extend({
  type: z.undefined().optional(),
  constraints: z.undefined().optional(),
  defaultValue: PrimOrArrOrObjZ.optional(),
})

const StringParamZ = CommonParamZ.extend({
  type: z.literal("string"),
  constraints: StringConstraintZ.optional(),
  defaultValue: z.string().optional(),
})

const NumberParamZ = CommonParamZ.extend({
  type: z.literal("number"),
  constraints: NumberConstraintZ.optional(),
  defaultValue: z.number().optional(),
})

const BooleanParamZ = CommonParamZ.extend({
  type: z.literal("boolean"),
  defaultValue: z.boolean().optional(),
})

const ArrayParamZ = CommonParamZ.extend({
  type: z.literal("array"),
  constraints: ArrayConstraintZ.optional(),
  defaultValue: z.array(PrimOrArrOrObjZ).optional(),
})

const ObjectParamZ = CommonParamZ.extend({
  type: z.literal("object"),
  constraints: ObjectConstraintZ.optional(),
  defaultValue: z.record(z.string(), PrimOrArrOrObjZ).optional(),
})

export const ParamZ = z.union([
  StringParamZ,
  NumberParamZ,
  BooleanParamZ,
  ArrayParamZ,
  ObjectParamZ,
  UntypedParamZ,
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
