import { useState } from 'react'
import { GripVertical } from "lucide-react";

import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
import { DragDropProvider, useDroppable } from "@dnd-kit/react";
import { RestrictToElement } from '@dnd-kit/dom/modifiers';
import { CollisionPriority } from '@dnd-kit/abstract';
import { useSortable } from '@dnd-kit/react/sortable';
import { move } from '@dnd-kit/helpers';

import { colors, shades } from "@/utils/colors";

function RowDroppable({ children, id }: { children: React.ReactNode, id: string }) {
  const { ref } = useDroppable({
    id,
    type: id,
    collisionPriority: CollisionPriority.Low,
  })

  return (
    <div ref={ref}>
      {children}
    </div>
  )
}

function RowDraggable({ id, index, group, children }: { id: string, index: number, group: string, children: React.ReactNode }) {
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
  const [items, setItems] = useState([...shades])

  return (
    <div className='absolute bottom-0 border'>
      <DragDropProvider
        onDragOver={(event) => {
          setItems((items) => move(items, event))
        }}
      >
        <RowDroppable id='row'>
          <div
            id='row-p'
            className="w-fit border-l border-t"
          >
            {
              items.map((sh, i) => (
                <RowDraggable
                  key={sh}
                  id={sh}
                  index={i}
                  group={`row-${sh}`}
                >
                  {
                    colors.map(clr => (
                      <button
                        key={clr}
                        title={clr}
                        className={`size-8 border-r border-b bg-${clr}-${sh}`}
                      />
                    ))
                  }
                </RowDraggable>
              ))
            }
          </div>
        </RowDroppable>
      </DragDropProvider>
    </div>
  )
}