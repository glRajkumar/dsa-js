import { useState } from 'react'

import { DragDropProvider, useDroppable } from "@dnd-kit/react";
import { RestrictToElement } from '@dnd-kit/dom/modifiers';
import { CollisionPriority } from '@dnd-kit/abstract';
import { useSortable } from '@dnd-kit/react/sortable';
import { move } from '@dnd-kit/helpers';

import { twBgClrs } from "@/utils/colors";

function CellDroppable({ children, id }: { children: React.ReactNode, id: string }) {
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

function CellDraggable({ id, index, group, clr }: { id: string, index: number, group: string, clr: string }) {
  const { ref } = useSortable({
    id,
    type: "cell",
    index,
    group,
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
  const [items, setItems] = useState([...twBgClrs])

  return (
    <div className='absolute left-[33px] bottom-0'>
      <DragDropProvider
        onDragOver={(event) => {
          setItems((items) => move(items, event))
        }}
      >
        <CellDroppable id='cell'>
          <div
            id='cell-p'
            className="w-fit flex flex-wrap border-l border-t"
          >
            {
              items.map((clr, i) => (
                <CellDraggable
                  key={clr}
                  id={clr}
                  index={i}
                  group={`cell`}
                  clr={clr}
                />
              ))
            }
          </div>
        </CellDroppable>
      </DragDropProvider>
    </div>
  )
}