
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 2,
      output: "1\n1 2"
    },
    {
      input: 3,
      output: "1\n1 2\n1 2 3"
    },
    {
      input: 5,
      output: "1\n1 2\n1 2 3\n1 2 3 4\n1 2 3 4 5"
    }
  ],
  meta: {
    p3_1: {
      type: "function",
      name: "p3_1",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 2,
        constraints: {
          min: 1,
          max: 18,
        }
      }]
    },
    p3_2: {
      type: "function",
      name: "p3_2",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 2,
        constraints: {
          min: 1,
          max: 18,
        }
      }]
    },
  }
}
