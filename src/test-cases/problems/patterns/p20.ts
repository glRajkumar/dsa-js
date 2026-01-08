
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 3,
      output: "*    *\n**  **\n******\n**  **\n*    *"
    },
    {
      input: 4,
      output: "*      *\n**    **\n***  ***\n********\n***  ***\n**    **\n*      *"
    },
    {
      input: 5,
      output: "*        *\n**      **\n***    ***\n****  ****\n**********\n****  ****\n***    ***\n**      **\n*        *"
    }
  ],
  meta: {
    p20: {
      type: "function",
      name: "p20",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 5,
        constraints: {
          min: 3,
          max: 22,
        }
      }]
    },
  }
}
