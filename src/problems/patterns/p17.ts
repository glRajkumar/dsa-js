
// Brute Force: TC - O(N^2) SC - O(1)
export function p17(n: number) {
  for (let i = 0; i < n; i++) {
    const spaces = " ".repeat(n - i - 1)

    let firstHalf = ""
    let secondHalf = ""

    for (let j = 0; j <= i; j++) {
      firstHalf += String.fromCharCode(65 + j)
      secondHalf = j > 0 ? String.fromCharCode(65 + j - 1) + secondHalf : ""
    }

    let row = spaces + firstHalf + secondHalf + spaces
    console.log(row)
  }
}
