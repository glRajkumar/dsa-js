import { createFileRoute } from '@tanstack/react-router'
import { FormProvider, useForm } from 'react-hook-form'

import type { paramT } from '@/utils/code-executer/schema'
import { getDefaultValues } from '@/utils/code-executer/get-default'

import { Card, CardContent } from '@/components/shadcn-ui/card'
import { ParamField } from '@/components/ui/code-executer/params'
import { Button } from '@/components/shadcn-ui/button'

export const Route = createFileRoute('/test-ui')({
  component: RouteComponent,
})

const paramsData: paramT[] = [
  {
    name: "noConstraints",
    description: "somedescription",
  },
  {
    name: "name",
    type: "string",
    description: "somedescription",
    defaultValue: "somedescription",
    constraints: {
      minLength: 1,
      maxLength: 10,
    },
  },
  {
    name: "age",
    type: "number",
    description: "somedescription",
    defaultValue: 5,
    constraints: {
      min: 1,
      max: 10,
      step: 1,
    },
  },
  {
    name: "isMarried",
    type: "boolean",
    description: "somedescription",
    defaultValue: false,
  },
  {
    name: "objString",
    type: "object",
    description: "somedescription",
    defaultValue: {
      x: 799,
      y: "hjhjjk",
    },
    constraints: {
      type: "string",
      constraints: {
        minLength: 1,
        maxLength: 10,
      }
    },
  },
  {
    name: "objNumber",
    type: "object",
    description: "somedescription",
    defaultValue: {
      x: 6,
      y: 5,
    },
    constraints: {
      type: "number",
      constraints: {
        min: 1,
        max: 10,
        step: 1,
      },
    },
  },
  {
    name: "objBoolean",
    type: "object",
    description: "somedescription",
    defaultValue: {
      x: true,
      y: false,
    },
    constraints: {
      type: "boolean",
    },
  },
  {
    name: "objObject",
    type: "object",
    description: "somedescription",
    defaultValue: {
      inner1: "somevalue",
      inner2: 5,
      inner3: true,
      inner4: {
        i4i1: "somevalue",
        i4i2: 5,
        i4i3: true,
        i4i4: {
          x: "jghk"
        }
      }
    },
    constraints: {
      type: "object",
      constraints: {
        inner1: {
          type: "string",
          constraints: {
            minLength: 1,
            maxLength: 10,
          },
        },
        inner2: {
          type: "number",
          constraints: {
            min: 1,
            max: 10,
            step: 1,
          },
        },
        inner3: {
          type: "boolean",
        },
        inner4: {
          type: "object",
          constraints: {
            i4i1: {
              type: "string",
              constraints: {
                minLength: 1,
                maxLength: 10,
              },
            },
            i4i2: {
              type: "number",
              constraints: {
                min: 1,
                max: 10,
              },
            },
            i4i3: {
              type: "boolean",
            },
            i4i4: {
              type: "object",
              constraints: {
                i4i4i1: {
                  type: "string",
                }
              },
            },
          },
        },
      }
    },
  },
  {
    name: "objNoConstraint",
    type: "object",
    description: "somedescription",
    defaultValue: {
      x: "somevalue",
      y: true,
      z: 6,
    },
  },
  {
    name: "arrString",
    type: "array",
    description: "somedescription",
    defaultValue: ["jfhh", "hjhjjk"],
    constraints: {
      // template:{
      //   type: "string",
      //   constraints: {
      //     maxLength: 10,
      //     minLength: 1,
      //   }
      // },
      byIndex: {
        0: { type: "string", constraints: { minLength: 2 } },
        1: { type: "string", constraints: { maxLength: 10 } },
      }
    },
  },
  {
    name: "arrNumber",
    type: "array",
    description: "somedescription",
    defaultValue: [6, 5],
    constraints: {
      template: {
        type: "number",
        constraints: {
          min: 1,
          max: 10,
          step: 1,
        },
      }
    },
  },
  {
    name: "arrBoolean",
    type: "array",
    description: "somedescription",
    defaultValue: [true, false],
    constraints: {
      template: {
        type: "boolean"
      }
    },
  },
  {
    name: "arrObject",
    type: "array",
    description: "somedescription",
    defaultValue: [{
      inner1: "ghk",
      inner2: 3,
      inner3: true,
      inner4: {
        i4i1: "gjhk",
        i4i2: 2,
        i4i3: false,
        i4i4: {
          x: "yhtg",
          y: "nidh",
          z: "iksh"
        }
      }
    }],
    constraints: {
      template: {
        type: "object",
        constraints: {
          inner1: {
            type: "string",
            constraints: {
              minLength: 1,
              maxLength: 10,
            },
          },
          inner2: {
            type: "number",
            constraints: {
              min: 1,
              max: 10,
              step: 1,
            },
          },
          inner3: {
            type: "boolean",
          },
          inner4: {
            type: "object",
            constraints: {
              i4i1: {
                type: "string",
                constraints: {
                  minLength: 1,
                  maxLength: 10,
                },
              },
              i4i2: {
                type: "number",
                constraints: {
                  min: 1,
                  max: 10,
                },
              },
              i4i3: {
                type: "boolean",
              },
              i4i4: {
                type: "object",
                constraints: {
                  i4i4i1: {
                    type: "string"
                  }
                },
              },
            },
          },
        },
      }
    },
  },
  {
    name: "arrNoConstraint",
    type: "array",
    description: "somedescription",
    defaultValue: [1, "db", true],
  },
]

function RouteComponent() {
  const methods = useForm({
    defaultValues: getDefaultValues(paramsData),
  })

  function handleSubmit(data: any) {
    console.log(data)
  }

  return (
    <div className='p-8'>
      <Card>
        <CardContent>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleSubmit)}
              className='space-y-4 [&_[role="group"]]:gap-1'
            >
              {paramsData.map((param) => (
                <ParamField
                  key={param.name}
                  param={param}
                  name={param.name}
                />
              ))}

              <Button type="submit">
                Get Data
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  )
}
