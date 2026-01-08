
// Brute Force: TC - O(N^2) SC - O(1)
export function p20(n: number) {
  for (let i = 0; i < n; i++) {
    let firstHalf = ""
    let secondHalf = ""

    for (let j = 0; j < n; j++) {
      let curr = i >= j ? "*" : " "
      firstHalf += curr
      secondHalf = curr + secondHalf
    }

    console.log(firstHalf + secondHalf)
  }

  for (let i = 1; i < n; i++) {
    let firstHalf = ""
    let secondHalf = ""

    for (let j = 0; j < n; j++) {
      let curr = i > j ? " " : "*"
      firstHalf = curr + firstHalf
      secondHalf += curr
    }

    console.log(firstHalf + secondHalf)
  }
}
