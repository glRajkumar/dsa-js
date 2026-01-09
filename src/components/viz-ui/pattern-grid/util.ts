
export type CellSize = "small" | "compact" | "large"

export const sizeClasses: Record<CellSize, string> = {
  small: "size-6",
  compact: "size-10 p-1",
  large: "size-16",
}

export function strToArr(str: string) {
  const splited = str.split("\n")
  const max = Math.max(...splited.map(i => i.length))

  return splited.reduce<string[]>((acc, row) => {
    const chars = row.split("")

    const missing = max - chars.length
    for (let i = 0; i < missing; i++) {
      chars.push("")
    }

    acc.push(...chars)
    return acc
  }, [])
}