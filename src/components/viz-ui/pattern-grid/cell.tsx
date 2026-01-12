import { RestrictToElement } from '@dnd-kit/dom/modifiers';
import { useSortable } from '@dnd-kit/react/sortable';

import { useGridState } from './grid-state-context';
import { Droppable } from "./droppable";

type props = {
  id: string
  rowIdx: number
  colIdx: number
  clr: string
}
function CellDraggable({ id, rowIdx, colIdx, clr }: props) {
  const flatIndex = rowIdx * 19 + colIdx

  const { ref } = useSortable({
    id,
    type: "cell",
    index: flatIndex,
    group: "cell",
    modifiers: [
      RestrictToElement.configure({ element: document.getElementById("cell-p") }),
    ]
  })

  return (
    <button
      ref={ref}
      title={clr}
      className={`size-8 border-r border-b ${clr}`}
    />
  )
}

export function CellProvider() {
  const { rowOrder, colOrder, cellGrid } = useGridState()

  return (
    <div className='absolute left-[33px] bottom-0'>
      <Droppable id='cell'>
        <div
          id='cell-p'
          className="w-fit border-l border-t"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${colOrder.length}, 1fr)`,
            gridTemplateRows: `repeat(${rowOrder.length}, 1fr)`,
          }}
        >
          {
            rowOrder.map((shade, rowIdx) =>
              colOrder.map((color, colIdx) => {
                const cellValue = cellGrid[rowIdx]?.[colIdx] || `bg-${color}-${shade}`
                const cellId = `bg-${color}-${shade}`
                return (
                  <CellDraggable
                    key={`${rowIdx}-${colIdx}-${cellId}`}
                    id={cellId}
                    rowIdx={rowIdx}
                    colIdx={colIdx}
                    clr={cellValue}
                  />
                )
              })
            )
          }
        </div>
      </Droppable>
    </div>
  )
}