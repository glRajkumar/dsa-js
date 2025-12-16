import { Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/shadcn-ui/card'
import { Button } from '@/components/shadcn-ui/button'
import { Badge } from '@/components/shadcn-ui/badge'

export function Results({ logs, onClear }: { logs: logT[], onClear: () => void }) {
  if (logs.length === 0) {
    return (
      <Card className="mb-4">
        <CardContent className="text-center py-8 text-gray-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No execution results yet</p>
          <p className="text-sm">Execute functions to see results here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Execution Results</CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={onClear}
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </Button>
      </CardHeader>

      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`p-3 rounded-lg border ${log?.error
              ? 'bg-red-50 border-red-200'
              : 'bg-green-50 border-green-200'
              }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {log?.error ? (
                  <XCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}

                <span className="font-semibold">{log.name}</span>

                <Badge variant={log?.error ? 'destructive' : 'secondary'}>
                  {log?.error}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <strong className="text-gray-700">Input:</strong>
                <pre className="mt-1 p-2 bg-white rounded border text-xs overflow-x-auto">
                  {JSON.stringify(log.input, null, 2)}
                </pre>
              </div>

              {log.error ? (
                <div>
                  <strong className="text-red-700">Error:</strong>
                  <pre className="mt-1 p-2 bg-white rounded border text-xs overflow-x-auto text-red-600">
                    {log.error}
                  </pre>
                </div>
              ) : (
                <div>
                  <strong className="text-gray-700">Output:</strong>
                  <pre className="mt-1 p-2 bg-white rounded border text-xs overflow-x-auto">
                    {JSON.stringify(log.output, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}