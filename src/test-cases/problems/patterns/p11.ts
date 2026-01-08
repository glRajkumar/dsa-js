
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 2,
      output: "1\n0 1"
    },
    {
      input: 3,
      output: "1\n0 1\n1 0 1"
    },
    {
      input: 5,
      output: "1\n0 1\n1 0 1\n0 1 0 1\n1 0 1 0 1"
    }
  ],
  meta: {
    p11: {
      type: "function",
      name: "p11",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 5,
        constraints: {
          min: 2,
          max: 20,
        }
      }]
    },
  }
}
