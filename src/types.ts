/**
 * Plugin options.
 */
interface Options {
  /**
   * Base URI
   * @default 'http://localhost/'
   */
  hostname: string
  /**
   * Array of strings with dynamic routes.
   * Example: ['/routes1', '/route2/subroute']
   * @default []
   */
  dynamicRoutes: string[]
  /**
   * Output directory
   * @default 'dist'
   */
  outDir: string
  /**
   * Change frequency option for sitemap
   * @default 'daily'
   */
  changefreq: string
  /**
   * Priority option for sitemap
   * @default 1
   */
  priority: number
  /**
   * Last modification option for sitemap
   * @default new Date()
   */
  lastmod: Date
  /**
   * Converts XML into a human readable format
   * @default false
   */
  readable: boolean
  /**
   * Array of robots policies
   */
  robotsPolicy?: RobotsPolicy[]
}

interface RobotsPolicy {
  userAgent: string
  disallow?: string | string[]
  allow?: string | string[]
  crawlDelay?: number
}

export type UserOptions = Partial<Options>

export interface ResolvedOptions extends Options {}
