import { Fragment, useState } from "react"
import { X, GripVertical, GripHorizontal } from "lucide-react"

import { type colorsT, type shadesT, type bgT, colors, shades } from "@/utils/colors"
import { cn } from "@/lib/utils"

import { DialogWrapper } from "@/components/shadcn-ui/dialog"
import { Button } from "@/components/shadcn-ui/button"
import { Label } from "@/components/shadcn-ui/label"

function reorder<T>(list: T[], from: number, to: number): T[] {
  if (from === to) return list
  const next = [...list]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

export function ColorSystem() {
  const [excludedCells, setExcludedCells] = useState<Set<bgT>>(new Set())
  const [excludedRows, setExcludedRows] = useState<Set<shadesT>>(new Set())
  const [excludedCols, setExcludedCols] = useState<Set<colorsT>>(new Set())

  const [rowOrder, setRowOrder] = useState<shadesT[]>([...shades])
  const [colOrder, setColOrder] = useState<colorsT[]>([...colors])

  const [dragRowOver, setDragRowOver] = useState<number | null>(null)
  const [dragColOver, setDragColOver] = useState<number | null>(null)

  const isRowExcluded = (shade: shadesT) => excludedRows.has(shade)
  const isColExcluded = (color: colorsT) => excludedCols.has(color)

  const isCellExcluded = (color: colorsT, shade: shadesT) =>
    excludedCells.has(`bg-${color}-${shade}`)

  function toggleCol(color: colorsT) {
    setExcludedCols(prev => {
      const next = new Set(prev)
      next.has(color) ? next.delete(color) : next.add(color)
      return next
    })
  }

  function toggleRow(shade: shadesT) {
    setExcludedRows(prev => {
      const next = new Set(prev)
      next.has(shade) ? next.delete(shade) : next.add(shade)
      return next
    })
  }

  function toggleCell(twc: bgT) {
    setExcludedCells(prev => {
      const next = new Set(prev)
      next.has(twc) ? next.delete(twc) : next.add(twc)
      return next
    })
  }

  return (
    <DialogWrapper
      title="Color System"
      trigger={<Button variant="outline" size="sm">Color System</Button>}
      contentCls="sm:max-w-3xl"
    >
      <Label>Colors Available</Label>

      <div className="overflow-x-auto">
        <div
          className="grid w-fit border-l border-t select-none"
          style={{
            gridTemplateColumns: `repeat(${colOrder.length + 2}, 1fr)`,
            gridTemplateRows: `repeat(${rowOrder.length + 2}, 1fr)`
          }}
        >
          <span className="size-8 border-r border-b" />

          {colOrder.map(color => (
            <button
              key={color}
              onClick={() => toggleCol(color)}
              className={cn(
                "size-8 border-r border-b flex items-center justify-center transition",
                isColExcluded(color) && "line-through opacity-40"
              )}
            >
              <X className="size-4" />
            </button>
          ))}

          <span className="size-8 border-b border-r" />

          {rowOrder.map((shade, rowIdx) => (
            <Fragment key={shade}>
              <button
                onClick={() => toggleRow(shade)}
                className={cn(
                  "size-8 border-b border-r flex items-center justify-center transition",
                  isRowExcluded(shade) && "line-through opacity-40"
                )}
              >
                <X className="size-4" />
              </button>

              {colOrder.map(color => {
                const twc = `bg-${color}-${shade}` as bgT
                const disabled =
                  isRowExcluded(shade) ||
                  isColExcluded(color) ||
                  isCellExcluded(color, shade)

                return (
                  <button
                    key={twc}
                    title={twc}
                    onClick={() => toggleCell(twc)}
                    className={cn(
                      "size-8 border-r border-b transition",
                      twc,
                      disabled && "opacity-30 grayscale"
                    )}
                  />
                )
              })}

              <button
                draggable
                onDragStart={e => {
                  e.dataTransfer.setData("row", String(rowIdx))
                  e.currentTarget.classList.add("opacity-40", "scale-95")
                }}
                onDragEnd={e => {
                  e.currentTarget.classList.remove("opacity-40", "scale-95")
                  setDragRowOver(null)
                }}
                onDragOver={e => {
                  e.preventDefault()
                  setDragRowOver(rowIdx)
                }}
                onDragLeave={() => setDragRowOver(null)}
                onDrop={e => {
                  const from = Number(e.dataTransfer.getData("row"))
                  setRowOrder(prev => reorder(prev, from, rowIdx))
                  setDragRowOver(null)
                }}
                className={cn(
                  "size-8 border-b border-r flex items-center justify-center cursor-move transition",
                  dragRowOver === rowIdx &&
                  "ring-2 ring-blue-500 ring-offset-1"
                )}
              >
                <GripVertical className="size-4" />
              </button>
            </Fragment>
          ))}

          <span className="size-8 border-b border-r" />

          {colOrder.map((_, colIdx) => (
            <button
              key={colIdx}
              draggable
              onDragStart={e => {
                e.dataTransfer.setData("col", String(colIdx))
                e.currentTarget.classList.add("opacity-40", "scale-95")
              }}
              onDragEnd={e => {
                e.currentTarget.classList.remove("opacity-40", "scale-95")
                setDragColOver(null)
              }}
              onDragOver={e => {
                e.preventDefault()
                setDragColOver(colIdx)
              }}
              onDragLeave={() => setDragColOver(null)}
              onDrop={e => {
                const from = Number(e.dataTransfer.getData("col"))
                setColOrder(prev => reorder(prev, from, colIdx))
                setDragColOver(null)
              }}
              className={cn(
                "size-8 border-b border-r flex items-center justify-center cursor-move transition-all",
                dragColOver === colIdx &&
                "ring-2 ring-blue-500 ring-offset-1"
              )}
            >
              <GripHorizontal className="size-4" />
            </button>
          ))}

          <span className="size-8 border-b border-r" />
        </div>
      </div>
    </DialogWrapper>
  )
}
