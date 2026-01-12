import { CollisionPriority } from "@dnd-kit/abstract";
import { useDroppable } from "@dnd-kit/react";

type props = { children: React.ReactNode, id: string }
export function Droppable({ children, id }: props) {
  const { ref } = useDroppable({
    id,
    type: id,
    collisionPriority: CollisionPriority.Low,
  })

  return <div ref={ref}>{children}</div>
}
