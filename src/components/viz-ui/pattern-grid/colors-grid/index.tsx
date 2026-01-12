import { DialogFooterWrapper, DialogWrapper } from "@/components/shadcn-ui/dialog"
import { Button } from "@/components/shadcn-ui/button"

import { GridStateProvider, useGridState } from "./grid-state-context";
import { cn } from "@/lib/utils";

import { GridReorder } from './grid-reorder';
import { Settings } from "./settings";
import { Output } from "./output";

function Footer() {
  const { rowOrder } = useGridState()

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

export function ColorsGrid({ children, className }: { children?: React.ReactNode, className?: string }) {
  return (
    <GridStateProvider>
      <div className={cn("max-h-[70vh] overflow-y-auto pr-6 -mr-6", className)}>
        <Settings />
        <GridReorder />
        <Output />
      </div>

      {children}
    </GridStateProvider>
  )
}

export function ColorsGridModal() {
  return (
    <DialogWrapper
      title="Color System"
      trigger={<Button variant="outline" size="sm">Color System</Button>}
      contentCls="sm:max-w-3xl"
      cancel=""
    >
      <ColorsGrid>
        <Footer />
      </ColorsGrid>
    </DialogWrapper>
  )
}
