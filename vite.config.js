import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()], // Resolve os paths do tsconfig.json como o @ --> src/
  test: {
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
    dir: 'src', // Essa linha
    // workspace: [
    //   {
    //     extends: true,
    //     test: {
    //       environment: 'prisma',
    //     },
    //   },
    // ],
  },
})
