import { Fragment, useState } from 'react'
import { GripHorizontal, GripVertical } from "lucide-react";

import { RestrictToHorizontalAxis, RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
import { DragDropProvider, DragOverlay, useDroppable } from "@dnd-kit/react";
import { RestrictToElement } from '@dnd-kit/dom/modifiers';
import { CollisionPriority } from '@dnd-kit/abstract';
import { useSortable } from '@dnd-kit/react/sortable';
import { move } from '@dnd-kit/helpers';

import { colors, shades, twBgClrs } from "@/utils/colors";

function Droppable({ children, id }: { children: React.ReactNode, id: string }) {
  const { ref } = useDroppable({
    id,
    type: id,
    collisionPriority: CollisionPriority.Low,
  })

  return (
    <div
      ref={ref}
    >
      {children}
    </div>
  )
}

function Draggable({ id, isVer, index, type, group }: { id: string, isVer: boolean, index: number, type: string, group: string }) {
  const { ref } = useSortable({
    id,
    type,
    index,
    group,
    modifiers: [
      RestrictToElement.configure({ element: document.getElementById("ujh") }),
      type === "row" ? RestrictToVerticalAxis : RestrictToHorizontalAxis
    ]
  })

  return (
    <button
      ref={ref}
      className="size-8 border-r border-b flex items-center justify-center"
    >
      {isVer ? <GripVertical className="size-4 pointer-events-none" /> : <GripHorizontal className="size-4 pointer-events-none" />}
    </button>
  )
}

function DragOverLayHelp() {
  return (
    <DragOverlay>
      {source => {
        const curr = source.id.toString()
        const isShade = curr.startsWith("shade")

        return (
          <div className={`flex items-center w-fit bg-white border ${isShade ? "flex-col border-b-0" : "border-r-0"}`}>
            <button
              className={`size-8 shrink-0 flex items-center justify-center ${isShade ? "border-b" : "border-r"}`}
            >
              {!isShade ? <GripVertical className="size-4" /> : <GripHorizontal className="size-4" />}
            </button>

            {
              isShade
                ? shades.map(s => (
                  <button
                    key={s}
                    className={`size-8 shrink-0 ${isShade ? "border-b" : "border-r"} ${`bg-${curr.replace("shade-", "")}-${s}`}`}
                  />
                ))
                : colors.map((s, i) => (
                  <button
                    key={s}
                    className={`size-8 shrink-0 ${isShade ? "border-b" : "border-r"} ${twBgClrs[(3 * colors.length) + i]}`}
                  />
                ))
            }
          </div>
        )
      }}
    </DragOverlay>
  )
}

export function NewUi() {
  const [items, setItems] = useState([...twBgClrs])

  return (
    <div className="p-5 border my-8">
      <DragDropProvider
        onDragOver={(event) => {
          console.log(event)
          // setItems((items) => move(items, event))
        }}
      >
        <Droppable id='col'>
          <Droppable id='row'>
            <div
              id='ujh'
              className="grid w-fit border-l border-t"
              style={{
                gridTemplateColumns: `repeat(${colors.length + 1}, 1fr)`,
                gridTemplateRows: `repeat(${shades.length}, 1fr)`
              }}
            >
              <span className='size-8 border-r border-b'></span>
              {colors.map((clr, i) => (
                <Draggable
                  key={clr}
                  id={`shade-${clr}`}
                  isVer={false}
                  index={i + 1}
                  type='col'
                  group='col'
                />
              ))}

              {
                items.map((tw, i) => (
                  <Fragment key={tw}>
                    {
                      (i % colors.length) === 0 &&
                      <Draggable
                        key={`color-${i}`}
                        id={`color-${i}`}
                        isVer
                        index={i + 1}
                        type='row'
                        group='row'
                      />
                    }

                    <button
                      title={tw}
                      className={`size-8 border-r border-b ${tw}`}
                    />
                  </Fragment>
                ))
              }
            </div>
          </Droppable>
        </Droppable>

        <DragOverLayHelp />
      </DragDropProvider>
    </div>
  )
}
