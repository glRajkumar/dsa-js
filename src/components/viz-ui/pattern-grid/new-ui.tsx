import { colors, shades } from '@/utils/colors';
import { CellProvider } from './cell';
import { RowProvider } from './row';
import { ColProvider } from './col';

export function NewUi() {
  return (
    <div className="p-5 border my-8">
      <div className='relative'
        style={{
          width: `${((colors.length + 1) * 32) + 2}px`,
          height: `${((shades.length + 1) * 32) + 2}px`,
        }}
      >
        <RowProvider />
        <ColProvider />
        <CellProvider />
      </div>
    </div>
  )
}
