import { writeFileSync } from 'fs'
import { parse, resolve } from 'path'
import { SitemapStream, streamToPromise } from 'sitemap'
import { ensurePrefix, ensureSuffix } from '@antfu/utils'
import format from 'xml-formatter'
import glob from 'fast-glob'

import { removeMaybeSuffix } from './utils'
import { resolveOptions } from './options'
import type { ResolvedOptions, UserOptions } from './types'

export default function generateSitemap(options: UserOptions = {}) {
  const resolvedOptions: ResolvedOptions = resolveOptions(options)
  const routes = [
    ...glob.sync('**/*.html', { cwd: resolvedOptions.outDir }).map((route) => {
      return ensurePrefix('/', resolvedOptions.nested ? route.replace(/index.html/g, '') : parse(route).name)
    }),
    ...resolvedOptions.dynamicRoutes.map(route => ensurePrefix('/', parse(route).name)),
  ]
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

export function getFormattedSitemap(options: ResolvedOptions, routes: string[]) {
  return routes.map(route => ({
    url: `${removeMaybeSuffix('/', options.hostname)}${route}`,
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
