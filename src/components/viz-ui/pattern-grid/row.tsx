import { GripVertical } from "lucide-react";

import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
import { RestrictToElement } from '@dnd-kit/dom/modifiers';
import { useSortable } from '@dnd-kit/react/sortable';

import { useGridState } from './grid-state-context';
import { Droppable } from "./droppable";

type props = {
  id: string
  index: number
  group: string
  children: React.ReactNode
}
function RowDraggable({ id, index, group, children }: props) {
  const { ref, handleRef } = useSortable({
    id,
    type: "row",
    index,
    group,
    modifiers: [
      RestrictToElement.configure({ element: document.getElementById("row-p") }),
      RestrictToVerticalAxis
    ]
  })

  return (
    <div ref={ref} className='flex items-center'>
      <button
        ref={handleRef}
        className="size-8 border-r border-b flex items-center justify-center"
      >
        <GripVertical className="size-4 pointer-events-none" />
      </button>

      {children}
    </div>
  )
}

export function RowProvider() {
  const { rowOrder, colOrder, cellGrid } = useGridState()

  return (
    <div className='absolute bottom-0 border'>
      <Droppable id='row'>
        <div
          id='row-p'
          className="w-fit border-l border-t"
        >
          {
            rowOrder.map((sh, rowIdx) => (
              <RowDraggable
                key={sh}
                id={sh}
                index={rowIdx}
                group={`row-${sh}`}
              >
                {
                  colOrder.map((clr, colIdx) => {
                    const cellValue = cellGrid[rowIdx]?.[colIdx] || `bg-${clr}-${sh}`
                    return (
                      <button
                        key={`${clr}-${rowIdx}-${colIdx}`}
                        title={cellValue}
                        className={`size-8 border-r border-b ${cellValue}`}
                      />
                    )
                  })
                }
              </RowDraggable>
            ))
          }
        </div>
      </Droppable>
    </div>
  )
}