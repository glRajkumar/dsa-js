
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 2,
      output: " A \nABA"
    },
    {
      input: 3,
      output: "  A  \n ABA \nABCBA"
    },
    {
      input: 5,
      output: "    A    \n   ABA   \n  ABCBA  \n ABCDCBA \nABCDEDCBA"
    }
  ],
  meta: {
    p17: {
      type: "function",
      name: "p17",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 5,
        constraints: {
          min: 1,
          max: 26,
        }
      }]
    },
  }
}
