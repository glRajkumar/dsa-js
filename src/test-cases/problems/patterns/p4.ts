
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 2,
      output: "1\n2 2"
    },
    {
      input: 3,
      output: "1\n2 2\n3 3 3"
    },
    {
      input: 5,
      output: "1\n2 2\n3 3 3\n4 4 5 4\n5 5 5 5 5"
    }
  ],
  meta: {
    p4_1: {
      type: "function",
      name: "p4_1",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 2,
        constraints: {
          min: 1,
          max: 9,
        }
      }]
    },
    p4_2: {
      type: "function",
      name: "p4_2",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 2,
        constraints: {
          min: 1,
          max: 9,
        }
      }]
    },
  }
}
