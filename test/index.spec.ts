import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, expect, test } from 'vitest'
import format from 'xml-formatter'

import generateSitemap, { getFinalSitemapPath, getFormattedSitemap, getResolvedPath, getRoutes, writeRobotFile, writeXmlFile } from '../src'
import { resolveOptions } from '../src/options'
import { generateTestFiles } from './utils'
import { ROBOTS_FILE, SITEMAP_FILE } from './variables'

describe('Index', () => {
  test('Generate sitemap', async() => {
    expect(existsSync(SITEMAP_FILE)).toBe(false)
    expect(existsSync(ROBOTS_FILE)).toBe(false)

    generateSitemap()

    expect(existsSync(SITEMAP_FILE)).toBe(false)
    expect(existsSync(ROBOTS_FILE)).toBe(false)

    generateTestFiles()

    const options = {
      dynamicRoutes: ['/'],
      allowRobots: false,
    }
    generateSitemap(options)
    expect(readFileSync(ROBOTS_FILE).toString('utf-8')).toEqual(
      'User-agent: *\nDisallow: /\n\nSitemap: http://localhost/sitemap.xml',
    )
  })

  test('Get routes', async() => {
    expect(getRoutes(resolveOptions({}))).toEqual([])
    expect(getRoutes(resolveOptions({ dynamicRoutes: ['/', 'route', '/route/sub-route'] }))).toEqual([
      '/',
      '/route',
      '/route/sub-route',
    ])

    generateTestFiles()

    expect(getRoutes(resolveOptions({}))).toEqual([
      '/test',
      '/sub-path/deeper-path',
      '/sub-path',
    ])

    expect(getRoutes(resolveOptions({ dynamicRoutes: ['/', 'route', '/route/sub-route'] }))).toEqual([
      '/test',
      '/sub-path/deeper-path',
      '/sub-path',
      '/',
      '/route',
      '/route/sub-route',
    ])
  })

  test('Get sitemap links', async() => {
    expect(getFormattedSitemap(resolveOptions({}), [])).toEqual([])
    expect(getFormattedSitemap(resolveOptions({}), ['/route'])).toMatchInlineSnapshot([{
      lastmod: expect.any(Date),
    }], `
      [
        {
          "changefreq": "daily",
          "lastmod": Any<Date>,
          "priority": 1,
          "url": "http://localhost/route",
        },
      ]
    `)
  })

  test('Write XML file', async() => {
    const TEMPLATE = '<?xml version="1.0" encoding="UTF-8"?><urlset></urlset>'

    writeXmlFile(SITEMAP_FILE, TEMPLATE, resolveOptions({}))
    expect(readFileSync(SITEMAP_FILE).toString('utf-8')).toEqual(TEMPLATE)
    writeXmlFile(SITEMAP_FILE, TEMPLATE, resolveOptions({ readable: true }))
    expect(readFileSync(SITEMAP_FILE).toString('utf-8')).toEqual(format(TEMPLATE))
  })

  test('Write robots file', async() => {
    writeRobotFile(ROBOTS_FILE, resolveOptions({}))
    expect(readFileSync(ROBOTS_FILE).toString('utf-8')).toEqual(
      'User-agent: *\nAllow: /\n\nSitemap: http://localhost/sitemap.xml',
    )
    writeRobotFile(ROBOTS_FILE, resolveOptions({ allowRobots: false }))
    expect(readFileSync(ROBOTS_FILE).toString('utf-8')).toEqual(
      'User-agent: *\nDisallow: /\n\nSitemap: http://localhost/sitemap.xml',
    )
  })

  test('Get final sitemap path', async() => {
    expect(getFinalSitemapPath(resolveOptions({}))).toEqual(
      'http://localhost/sitemap.xml',
    )
    expect(getFinalSitemapPath(resolveOptions({
      hostname: 'http://test.com/',
    }))).toEqual(
      'http://test.com/sitemap.xml',
    )
  })

  test('Get resolved path', async() => {
    expect(getResolvedPath('test.txt', resolveOptions({}))).toEqual(
      resolve('./dist/test.txt'),
    )
  })
})
