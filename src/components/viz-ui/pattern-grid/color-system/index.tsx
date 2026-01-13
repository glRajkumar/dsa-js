import { useState } from "react";
import { DialogFooterWrapper, DialogWrapper } from "@/components/shadcn-ui/dialog"
import { Button } from "@/components/shadcn-ui/button"

import { useGridData, useGridStore } from "./grid-store";
import { cn } from "@/lib/utils";

import { GridReorder } from './grid-reorder';
import { Settings } from "./settings";
import { Output } from "./output";

function Footer({ id }: { id: string }) {
  const rowOrder = useGridData(id, s => s?.rowOrder)

  function onSave() {
    console.log(rowOrder)
  }

  return (
    <DialogFooterWrapper
      cancel="Cancel"
      action="Save"
      onAction={onSave}
    />
  )
}

type props = {
  id: string
  children?: React.ReactNode
  className?: string
}
export function ColorsSystem({ id, children, className }: props) {
  return (
    <>
      <div className={cn("max-h-[70vh] overflow-y-auto pr-6 -mr-6", className)}>
        <Settings id={id} />
        <GridReorder id={id} />
        <Output id={id} />
      </div>

      {children}
    </>
  )
}

function Btn({ id, onOpen }: { id: string; onOpen: () => void }) {
  const init = useGridStore(s => s.init)

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        init(id)
        onOpen()
      }}
    >
      Color System
    </Button>
  )
}

export function ColorsSystemModal({ id }: { id: string }) {
  const [open, setOpen] = useState(false)

  return (
    <DialogWrapper
      open={open}
      title="Color System"
      // trigger={<Button variant="outline" size="sm">Color System</Button>}
      trigger={<Btn id={id} onOpen={() => setOpen(true)} />}
      contentCls="sm:max-w-3xl"
      cancel=""
      onOpenChange={setOpen}
    >
      <ColorsSystem id={id}>
        <Footer id={id} />
      </ColorsSystem>
    </DialogWrapper>
  )
}
