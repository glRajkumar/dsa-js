import { useState } from 'react'
import { GripHorizontal } from "lucide-react";

import { RestrictToHorizontalAxis } from '@dnd-kit/abstract/modifiers';
import { DragDropProvider, useDroppable } from "@dnd-kit/react";
import { RestrictToElement } from '@dnd-kit/dom/modifiers';
import { CollisionPriority } from '@dnd-kit/abstract';
import { useSortable } from '@dnd-kit/react/sortable';
import { move } from '@dnd-kit/helpers';

import { colors, shades } from "@/utils/colors";

function ColDroppable({ children, id }: { children: React.ReactNode, id: string }) {
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

function ColDraggable({ id, index, group, children }: { id: string, index: number, group: string, children: React.ReactNode }) {
  const { ref, handleRef } = useSortable({
    id,
    type: "col",
    index,
    group,
    modifiers: [
      RestrictToElement.configure({ element: document.getElementById("col-p") }),
      RestrictToHorizontalAxis
    ]
  })

  return (
    <div ref={ref} className='flex flex-col'>
      <button
        ref={handleRef}
        className="size-8 border-r border-b flex items-center justify-center"
      >
        <GripHorizontal className="size-4 pointer-events-none" />
      </button>

      {children}
    </div>
  )
}

export function ColProvider() {
  const [items, setItems] = useState([...colors])

  return (
    <div className='absolute right-0 border'>
      <DragDropProvider
        onDragOver={(event) => {
          setItems((items) => move(items, event))
        }}
      >
        <ColDroppable id="col">
          <div
            id='col-p'
            className="w-fit flex border-l border-t"
          >
            {items.map((clr, i) => (
              <ColDraggable
                key={clr}
                id={clr}
                index={i}
                group={`col-${clr}`}
              >
                {
                  shades.map(sh => (
                    <button
                      key={sh}
                      title={clr}
                      className={`size-8 border-r border-b bg-${clr}-${sh}`}
                    />
                  ))
                }
              </ColDraggable>
            ))}
          </div>
        </ColDroppable>
      </DragDropProvider>
    </div>
  )
}
