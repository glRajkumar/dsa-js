
import { colors, shades } from "@/utils/colors";
import { useGridState } from "./grid-state-context";

import { SelectWrapper } from "@/components/shadcn-ui/select";
import { Label } from "@/components/shadcn-ui/label";

export function Settings() {
  const {
    flow, colorsStart, shadesStart,
    updateColorsStart, updateShadesStart, updateFlow
  } = useGridState()

  return (
    <>
      <h6 className="mb-2 text-lg font-medium">Settings</h6>

      <div className="flex items-center flex-wrap gap-8 mb-2">
        <div className="flex items-center flex-wrap gap-2">
          <Label htmlFor="flow-order">Colors start</Label>
          <SelectWrapper
            value={colorsStart}
            onValueChange={updateColorsStart}
            triggerCls="w-28"
            contentCls="max-h-96"
            options={colors.map(c => ({ value: c, label: c }))}
          />
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <Label htmlFor="flow-order">Shades Start</Label>
          <SelectWrapper
            value={shadesStart}
            onValueChange={updateShadesStart}
            triggerCls="w-28"
            options={shades.map(s => ({ value: s, label: s }))}
          />
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <Label htmlFor="flow-order">Flow Order</Label>
          <SelectWrapper
            value={flow}
            onValueChange={updateFlow}
            triggerCls="w-28"
            options={[
              { value: "row", label: "Color" },
              { value: "col", label: "Shade" }
            ]}
          />
        </div>
      </div>
    </>
  )
}
