
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 2,
      output: "B\nA B"
    },
    {
      input: 3,
      output: "C\nB C\nA B C"
    },
    {
      input: 5,
      output: "E\nD E\nC D E\nB C D E\nA B C D E"
    }
  ],
  meta: {
    p18: {
      type: "function",
      name: "p18",
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
