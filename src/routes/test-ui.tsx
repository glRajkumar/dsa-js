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
    name: "name",
    type: "string",
    description: "somedescription",
    constraints: {
      minLength: 1,
      maxLength: 10,
      defaultValue: "somevalue",
    },
  },
  {
    name: "age",
    type: "number",
    description: "somedescription",
    constraints: {
      min: 1,
      max: 10,
      step: 1,
      defaultValue: 5,
    },
  },
  {
    name: "isMarried",
    type: "boolean",
    description: "somedescription",
    constraints: {
      defaultValue: false,
    },
  },
  {
    name: "objString",
    type: "object",
    description: "somedescription",
    constraints: {
      type: "string",
      constraints: {
        minLength: 1,
        maxLength: 10,
        defaultValue: "somevalue",
      },
      defaultValue: {
        x: "jfhh",
        y: "hjhjjk",
      }
    },
  },
  {
    name: "objNumber",
    type: "object",
    description: "somedescription",
    constraints: {
      type: "number",
      constraints: {
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 5,
      },
      defaultValue: {
        x: 6,
        y: 5,
      }
    },
  },
  {
    name: "objBoolean",
    type: "object",
    description: "somedescription",
    constraints: {
      type: "boolean",
      constraints: {
        defaultValue: true,
      },
      defaultValue: {
        x: true,
        y: false,
      }
    },
  },
  {
    name: "objObject",
    type: "object",
    description: "somedescription",
    constraints: {
      type: "object",
      constraints: {
        inner1: {
          type: "string",
          constraints: {
            minLength: 1,
            maxLength: 10,
            defaultValue: "somevalue",
          },
        },
        inner2: {
          type: "number",
          constraints: {
            min: 1,
            max: 10,
            step: 1,
            defaultValue: 5,
          },
        },
        inner3: {
          type: "boolean",
          constraints: {
            defaultValue: true,
          },
        },
        inner4: {
          type: "object",
          constraints: {
            i4i1: {
              type: "string",
              constraints: {
                minLength: 1,
                maxLength: 10,
                defaultValue: "somevalue",
              },
            },
            i4i2: {
              type: "number",
              constraints: {
                min: 1,
                max: 10,
                defaultValue: 5,
              },
            },
            i4i3: {
              type: "boolean",
              constraints: {
                defaultValue: false,
              },
            },
            i4i4: {
              type: "object",
              constraints: {
                i4i4i1: {
                  type: "string",
                  defaultValue: {
                    x: "jkj"
                  }
                }
              },
            },
          },
        },
      },
      defaultValue: {
        obj1: {
          inner1: "ghk",
          inner2: 3,
          inner3: true,
          inner4: {
            obj1: {
              i4i1: "gjhk",
              i4i2: 2,
              i4i3: false,
              i4i4: {
                x: "yhtg",
                y: "nidh",
                z: "iksh"
              }
            }
          }
        }
      }
    },
  },
  {
    name: "objNoConstraint",
    type: "object",
    description: "somedescription",
    constraints: {
      type: "object",
      defaultValue: {
        obj1: {
          x: "somevalue",
          y: true,
          z: 6,
        }
      }
    }
  },
  {
    name: "arrString",
    type: "array",
    description: "somedescription",
    constraints: {
      type: "string",
      constraints: {
        minLength: 1,
        maxLength: 10,
        defaultValue: "somevalue",
      },
      defaultValue: ["jfhh", "hjhjjk"]
    },
  },
  {
    name: "arrNumber",
    type: "array",
    description: "somedescription",
    constraints: {
      type: "number",
      constraints: {
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 5,
      },
      defaultValue: [6, 5]
    },
  },
  {
    name: "arrBoolean",
    type: "array",
    description: "somedescription",
    constraints: {
      type: "boolean",
      constraints: {
        defaultValue: true,
      },
      defaultValue: [true, false]
    },
  },
  {
    name: "arrObject",
    type: "array",
    description: "somedescription",
    constraints: {
      type: "object",
      constraints: {
        inner1: {
          type: "string",
          constraints: {
            minLength: 1,
            maxLength: 10,
            defaultValue: "somevalue",
          },
        },
        inner2: {
          type: "number",
          constraints: {
            min: 1,
            max: 10,
            step: 1,
            defaultValue: 5,
          },
        },
        inner3: {
          type: "boolean",
          constraints: {
            defaultValue: true,
          },
        },
        inner4: {
          type: "object",
          constraints: {
            i4i1: {
              type: "string",
              constraints: {
                minLength: 1,
                maxLength: 10,
                defaultValue: "somevalue",
              },
            },
            i4i2: {
              type: "number",
              constraints: {
                min: 1,
                max: 10,
                defaultValue: 5,
              },
            },
            i4i3: {
              type: "boolean",
              constraints: {
                defaultValue: false,
              },
            },
            i4i4: {
              type: "object",
              constraints: {
                i4i4i1: {
                  type: "string",
                  defaultValue: {
                    x: "jkj"
                  }
                }
              },
            },
          },
        },
      },
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
      }]
    },
  },
  {
    name: "arrNoConstraint",
    type: "array",
    description: "somedescription",
    constraints: {
      type: "array",
      defaultValue: [1, "db", true]
    }
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
