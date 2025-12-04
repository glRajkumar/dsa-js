import viteTsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import mdx from 'fumadocs-mdx/vite';

import * as MdxConfig from './source.config';

const config = defineConfig({
  optimizeDeps: {
    include: ["hast-util-to-jsx-runtime"],
  },
  plugins: [
    devtools(),
    mdx(MdxConfig),
    nitro(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
