import { createFileRoute } from '@tanstack/react-router'

import Params from '@/components/test-ui/params'

export const Route = createFileRoute('/test-ui')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='p-8'>
      <Params />
    </div>
  )
}
