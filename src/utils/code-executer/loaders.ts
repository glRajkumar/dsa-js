import type { fnT, clsT, ParamT, jsonMetaDataT, FunctionMetadataT, ClassMetadataT } from "./schema"
import { extractMetadataFromFile } from "./extractor"
import * as path from "path"

function mergeMetadata(params: ParamT[] = [], newParams: ParamT[] = []): ParamT[] {
  return params.map((oldParam) => {
    const updated = newParams.find((p) => p.name === oldParam.name)

    if (updated) {
      return {
        ...oldParam,
        ...updated,
        constraints: {
          ...oldParam.constraints,
          ...updated.constraints,
        },
      }
    }

    return oldParam
  })
}

export async function loadMetadata(filePath: string): Promise<(fnT | clsT)[]> {
  const source = path.join("src", filePath)
  const codePath = path.join(process.cwd(), source)
  const metadata = extractMetadataFromFile(codePath)

  const final: (fnT | clsT)[] = []

  const modules = import.meta.glob("/src/problems/**/*.ts")
  const module = await modules[`/${source.replace(/\\/g, "/")}`]()

  const staticMeta = (module as any)["metadata"] as jsonMetaDataT ?? {}

  for (const item of metadata) {
    const fn = (module as any)[item.name]
    if (!fn) continue

    if (item.type === "funtion") {
      const staticItem = staticMeta[item.name] as FunctionMetadataT ?? {}

      final.push({
        ...item,
        ...staticItem,
        params: mergeMetadata(item.params, staticItem?.params),
        compiledFn: fn,
      })

    } else {
      const staticItem = staticMeta[item.name] as ClassMetadataT ?? {}

      final.push({
        ...item,
        ...staticItem,
        constructor: {
          ...item.constructor,
          ...staticItem.constructor,
        },
        methods: item.methods?.map(m => {
          const staticMethod = staticItem?.methods?.find(sm => sm.name === m.name)
          return {
            ...m,
            params: mergeMetadata(m.params, staticMethod?.params)
          }
        }),
        compiledFCls: fn,
      })
    }
  }

  return final
}
