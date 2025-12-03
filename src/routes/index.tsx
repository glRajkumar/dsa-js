import { createFileRoute, Link } from '@tanstack/react-router'
import { HomeLayout } from 'fumadocs-ui/layouts/home'

import { baseOptions } from '@/lib/layout.shared'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="flex flex-col flex-1 justify-center px-4 py-8 text-center">
        <Link
          to="/docs/$"
          params={{ _splat: '' }}
        >
          Open Docs
        </Link>
      </div>
    </HomeLayout>
  )
}
