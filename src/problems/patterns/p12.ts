
// Brute Force: TC - O(N^2) SC - O(1)
export function p12(n: number) {
  for (let i = 0; i < n; i++) {
    let firstHalf = ""
    let secondHalf = ""

    for (let j = 0; j < n; j++) {
      const curr = j <= i ? `${j + 1}` : " "
      firstHalf += curr
      secondHalf = curr + secondHalf
    }

    console.log(firstHalf + secondHalf)
  }
}
