import { useState } from "react"

import type { logT } from "@/utils/code-executer/schema"

export function UseLogs() {
  const [logs, setLogs] = useState<logT[]>([])

  const addLog = (log: Omit<logT, 'id'>) => {
    setLogs(prev => [
      ...prev,
      {
        ...log,
        id: `${Date.now()}-${Math.random()}`,
      }
    ])
  }

  const clearLogs = () => setLogs([])

  return {
    logs,
    addLog,
    clearLogs,
  }
}
