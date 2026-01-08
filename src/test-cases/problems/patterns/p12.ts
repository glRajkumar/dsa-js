
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 2,
      output: "1  1\n1221"
    },
    {
      input: 3,
      output: "1    1\n12  21\n123321"
    },
    {
      input: 5,
      output: "1        1\n12      21\n123    321\n1234  4321\n1234554321"
    }
  ],
  meta: {
    p12: {
      type: "function",
      name: "p12",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 5,
        constraints: {
          min: 2,
          max: 9,
        }
      }]
    },
  }
}
