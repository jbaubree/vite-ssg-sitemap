import { writeFileSync } from 'fs'
import { join, parse, resolve } from 'path'
import { SitemapStream, streamToPromise } from 'sitemap'
import { ensurePrefix, ensureSuffix } from '@antfu/utils'
import format from 'xml-formatter'
import glob from 'fast-glob'

import { resolveOptions } from './options'
import type { ResolvedOptions, UserOptions } from './types'

export default function generateSitemap(options: UserOptions = {}) {
  const resolvedOptions: ResolvedOptions = resolveOptions(options)
  const routes = getRoutes(resolvedOptions)

  if (!routes.length) return

  const formattedSitemap = getFormattedSitemap(resolvedOptions, routes)

  const stream = new SitemapStream()
  formattedSitemap.forEach(item => stream.write(item))
  streamToPromise(stream).then((sitemap) => {
    writeXmlFile(getResolvedPath('sitemap.xml', resolvedOptions), sitemap.toString('utf-8'), resolvedOptions)
  })
  stream.end()
  writeRobotFile(getResolvedPath('robots.txt', resolvedOptions), resolvedOptions)
}

export function getRoutes(options: ResolvedOptions) {
  return [
    ...glob.sync('**/*.html', { cwd: options.outDir }).map((route) => {
      const parsedRoute = parse(route.replace(/index\.html/g, ''))
      return (
        join('/', parsedRoute.dir, parsedRoute.name)
      )
    }),
    ...options.dynamicRoutes.map(route => join('/', join(parse(route).dir, parse(route).name))),
  ]
}

export function getFormattedSitemap(options: ResolvedOptions, routes: string[]) {
  return routes.map(route => ({
    url: new URL(route, options.hostname).href,
    changefreq: options.changefreq,
    priority: options.priority,
    lastmod: options.lastmod,
  }))
}

export function writeXmlFile(resolvedPath: string, str: string, options: ResolvedOptions) {
  writeFileSync(resolvedPath, options.readable ? format(str) : str)
}

export function writeRobotFile(resolvedPath: string, options: ResolvedOptions) {
  const str = 'User-agent: *\n'
    .concat(`${options.allowRobots ? 'Allow' : 'Disallow'}: /\n\n`)
    .concat(`Sitemap: ${getFinalSitemapPath(options)}`)
  writeFileSync(resolvedPath, str)
}

export function getFinalSitemapPath(options: ResolvedOptions) {
  return `${ensureSuffix('/', options.hostname)}sitemap.xml`
}

export function getResolvedPath(file: string, resolvedOptions: ResolvedOptions) {
  return resolve(`${ensurePrefix('./', resolvedOptions.outDir)}/${file}`)
}
