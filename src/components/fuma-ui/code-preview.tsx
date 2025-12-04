import { CodeBlock, CodeBlockTab, CodeBlockTabs, CodeBlockTabsList, CodeBlockTabsTrigger } from 'fumadocs-ui/components/codeblock'
import { createServerOnlyFn } from '@tanstack/react-start'
import types from 'typescript'
import path from 'path'
import fs from 'fs'

const getContent = createServerOnlyFn(async ({ data: filePath }) => {
  console.log(filePath)
  const absolute = path.join(process.cwd(), filePath)
  const code = await fs.promises.readFile(absolute, "utf8")
  return code
})

function compileTs(tsCode: string) {
  const result = types.transpileModule(tsCode, {
    compilerOptions: {
      module: types.ModuleKind.ESNext,
      target: types.ScriptTarget.ES2020,
      strict: true
    }
  })

  return result.outputText
}

type props = {
  path: string
}

export async function CodePreview({ path: filePath }: props) {
  const code = await getContent({ filePath })
  console.log(code)

  const tsCode = `function p1(n: string) {
  console.log("*** ***")
}`
  const jsCode = compileTs(tsCode)

  return (
    <CodeBlockTabs defaultValue="js">
      <CodeBlockTabsList>
        <CodeBlockTabsTrigger value="js">js</CodeBlockTabsTrigger>
        <CodeBlockTabsTrigger value="ts">ts</CodeBlockTabsTrigger>
      </CodeBlockTabsList>

      <CodeBlockTab value="js">
        <CodeBlock>{jsCode}</CodeBlock>
      </CodeBlockTab>

      <CodeBlockTab value="ts">
        <CodeBlock>{tsCode}</CodeBlock>
      </CodeBlockTab>
    </CodeBlockTabs>
  )
}
