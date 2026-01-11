import { RowProvider } from './row';
import { ColProvider } from './col';
import { colors, shades } from '@/utils/colors';

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
      </div>
    </div>
  )
}
