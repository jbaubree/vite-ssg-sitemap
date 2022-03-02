import type { ResolvedOptions, UserOptions } from './types'

export function resolveOptions(userOptions: UserOptions): ResolvedOptions {
  return Object.assign(
    {
      hostname: 'http://localhost/',
      dynamicRoutes: [],
      outDir: 'dist',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date(),
      readable: false,
      allowRobots: true,
    },
    userOptions,
  )
}
