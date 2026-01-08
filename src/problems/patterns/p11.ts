
// Brute Force: TC - O(N^2) SC - O(1)
export function p11(n: number) {
  for (let i = 0; i < n; i++) {
    let start = i % 2 === 0 ? 1 : 0
    let row = `${start}`

    for (let j = 0; j < i; j++) {
      start = 1 - start
      row += start
    }

    console.log(row)
  }
}
