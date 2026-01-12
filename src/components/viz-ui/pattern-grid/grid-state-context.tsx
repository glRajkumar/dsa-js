import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { colors, shades, type colorsT, type shadesT, type bgT } from '@/utils/colors'

interface GridState {
  rowOrder: shadesT[]
  colOrder: colorsT[]
  cellGrid: bgT[][]
}

interface GridStateContextValue extends GridState {
  moveRow: (fromIndex: number, toIndex: number) => void
  moveCol: (fromIndex: number, toIndex: number) => void
  moveCell: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void
  getCellAt: (rowIdx: number, colIdx: number) => bgT | undefined
  setCellAt: (rowIdx: number, colIdx: number, value: bgT) => void
}

const GridStateContext = createContext<GridStateContextValue | null>(null)

function initializeGrid(): GridState {
  const rowOrder = [...shades]
  const colOrder = [...colors]
  const cellGrid: bgT[][] = rowOrder.map(shade =>
    colOrder.map(color => `bg-${color}-${shade}` as bgT)
  )

  return { rowOrder, colOrder, cellGrid }
}

export function GridStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GridState>(initializeGrid)

  const moveRow = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return

    setState(prev => {
      const newRowOrder = [...prev.rowOrder]
      const [moved] = newRowOrder.splice(fromIndex, 1)
      newRowOrder.splice(toIndex, 0, moved)

      const newCellGrid = [...prev.cellGrid]
      const [movedRow] = newCellGrid.splice(fromIndex, 1)
      newCellGrid.splice(toIndex, 0, movedRow)

      return {
        ...prev,
        rowOrder: newRowOrder,
        cellGrid: newCellGrid,
      }
    })
  }, [])

  const moveCol = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return

    setState(prev => {
      const newColOrder = [...prev.colOrder]
      const [moved] = newColOrder.splice(fromIndex, 1)
      newColOrder.splice(toIndex, 0, moved)

      const newCellGrid = prev.cellGrid.map(row => {
        const newRow = [...row]
        const [movedCell] = newRow.splice(fromIndex, 1)
        newRow.splice(toIndex, 0, movedCell)
        return newRow
      })

      return {
        ...prev,
        colOrder: newColOrder,
        cellGrid: newCellGrid,
      }
    })
  }, [])

  const moveCell = useCallback((fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    if (fromRow === toRow && fromCol === toCol) return

    setState(prev => {
      const newCellGrid = prev.cellGrid.map(row => [...row])
      const temp = newCellGrid[fromRow][fromCol]
      newCellGrid[fromRow][fromCol] = newCellGrid[toRow][toCol]
      newCellGrid[toRow][toCol] = temp

      return {
        ...prev,
        cellGrid: newCellGrid,
      }
    })
  }, [])

  const getCellAt = useCallback((rowIdx: number, colIdx: number) => {
    return state.cellGrid[rowIdx]?.[colIdx]
  }, [state.cellGrid])

  const setCellAt = useCallback((rowIdx: number, colIdx: number, value: bgT) => {
    setState(prev => {
      const newCellGrid = prev.cellGrid.map(row => [...row])
      if (newCellGrid[rowIdx]) {
        newCellGrid[rowIdx][colIdx] = value
      }
      return {
        ...prev,
        cellGrid: newCellGrid,
      }
    })
  }, [])

  return (
    <GridStateContext.Provider
      value={{
        ...state,
        moveRow,
        moveCol,
        moveCell,
        getCellAt,
        setCellAt,
      }}
    >
      {children}
    </GridStateContext.Provider>
  )
}

export function useGridState() {
  const context = useContext(GridStateContext)
  if (!context) {
    throw new Error('useGridState must be used within GridStateProvider')
  }
  return context
}
