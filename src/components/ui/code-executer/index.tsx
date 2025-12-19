import { getProblemsContent } from "@/actions/files"

import { FunctionExecuterWrapper } from "./function-executer"
import { ClassExecuter } from "./class-executer"

type props = Pick<Awaited<ReturnType<typeof getProblemsContent>>, "filePath" | "executers"> & {
  contentCls?: string
}

export function CodeExecuter({ executers, ...rest }: props) {
  return (
    <div className="not-prose">
      {
        executers.map(ex => {
          if (ex.type === "function") {
            return <FunctionExecuterWrapper key={ex.name} {...rest} {...ex} />
          }
          return <ClassExecuter key={ex.name} {...rest} {...ex} />
        })
      }
    </div>
  )
}
