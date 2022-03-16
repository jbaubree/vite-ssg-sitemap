import { existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { describe, expect, test } from 'vitest'
import format from 'xml-formatter'

import generateSitemap, { getFinalSitemapPath, getFormattedSitemap, getResolvedPath, writeRobotFile, writeXmlFile } from '../src'
import { resolveOptions } from '../src/options'
import { ROBOTS_FILE, SITEMAP_FILE, TEST_FILE } from './variables'

describe('Index', () => {
  test('Generate sitemap', async() => {
    expect(existsSync(SITEMAP_FILE)).toBe(false)
    expect(existsSync(ROBOTS_FILE)).toBe(false)

    generateSitemap()

    expect(existsSync(SITEMAP_FILE)).toBe(false)
    expect(existsSync(ROBOTS_FILE)).toBe(false)

    writeFileSync(TEST_FILE, '')
    const options = {
      dynamicRoutes: ['/'],
    }
    generateSitemap(options)
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
    await writeRobotFile(ROBOTS_FILE, resolveOptions({}))
    expect(readFileSync(ROBOTS_FILE).toString('utf-8')).toBe(
      'User-agent: *\nAllow: /\nSitemap: http://localhost/sitemap.xml\n',
    )
    await writeRobotFile(ROBOTS_FILE, resolveOptions({
      robotsPolicy: [
        {
          userAgent: 'googleBot',
          disallow: '/search/',
        },
        {
          userAgent: 'facebookBot',
          allow: '/search/',
        },
        {
          userAgent: '*',
          crawlDelay: 10,
        },
        {
          userAgent: 'OtherBot',
          allow: ['/allow-for-all-bots', '/allow-only-for-other-bot'],
          disallow: ['/admin', '/login'],
        },
      ],
    }))
    expect(readFileSync(ROBOTS_FILE).toString('utf-8')).toBe(
      'User-agent: googleBot\nDisallow: /search/\n\nUser-agent: facebookBot\nAllow: /search/\n\nUser-agent: *\nCrawl-delay: 10\n\nUser-agent: OtherBot\nAllow: /allow-for-all-bots\nAllow: /allow-only-for-other-bot\nDisallow: /admin\nDisallow: /login\nSitemap: http://localhost/sitemap.xml\n',
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
