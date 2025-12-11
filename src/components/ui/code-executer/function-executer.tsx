import { FormProvider, useForm } from 'react-hook-form'

import type { functionMetadataT } from "@/utils/code-executer/schema"
import { getDefaultValues } from '@/utils/code-executer/get-default'
import { getFnOrCls } from "@/utils/code-executer/extractor"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card"
import { Button } from "@/components/shadcn-ui/button"
import { Badge } from "@/components/shadcn-ui/badge"

import { ParamField } from "./params"

type props = functionMetadataT & {
  prefix?: string
  onExecute?: (args: any[]) => void
}
export function FunctionExecuter({ name, params, description, isAsync, prefix = "Function", onExecute = () => { } }: props) {
  const methods = useForm({
    defaultValues: params ? getDefaultValues(params) : {}
  })

  function handleSubmit(data: any) {
    console.log(data)
  }

  return (
    <Card className="mb-4 gap-4">
      <CardHeader className="flex items-center justify-between">
        <div className="space-y-1">
          <CardTitle className='flex items-center gap-2'>
            {prefix && <span className="font-medium">{prefix}: </span>}
            {name}
            {isAsync && <Badge>Async</Badge>}
          </CardTitle>

          {description && <CardDescription>{description}</CardDescription>}
        </div>

        <CardAction>
          <Button
            size="sm"
            variant="secondary"
            className="border"
            // onClick={() => onExecute(Object.values(values))}
            onClick={() => handleSubmit(methods.getValues())}
          >
            Execute
          </Button>
        </CardAction>
      </CardHeader>

      {
        params && params?.length > 0 &&
        <CardContent className="space-y-4">
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleSubmit)}
              className='space-y-4 [&_[role="group"]]:gap-1'
            >
              {params.map((param) => (
                <ParamField
                  key={param.name}
                  param={param}
                  name={param.name}
                />
              ))}
            </form>
          </FormProvider>
        </CardContent>
      }
    </Card>
  )
}

export function FunctionExecuterWrapper({ filePath, ...rest }: Omit<props, "onExecute"> & { filePath: string }) {
  const executeFunction = async (args: any[]) => {
    const fn = await getFnOrCls(filePath, rest.name)
    const result = fn(...args)
    console.log(result)
  }

  return (
    <FunctionExecuter
      {...rest}
      onExecute={executeFunction}
    />
  )
}