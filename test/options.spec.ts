import { describe, expect, test } from 'vitest'
import { resolveOptions } from '../src/options'

describe('Options', () => {
  test('resolve options', () => {
    expect(resolveOptions({})).toMatchInlineSnapshot({
      lastmod: expect.any(Date),
    }, `
      {
        "allowRobots": true,
        "changefreq": "daily",
        "dynamicRoutes": [],
        "hostname": "http://localhost/",
        "lastmod": Any<Date>,
        "outDir": "dist",
        "priority": 1,
        "readable": false,
      }
    `)
  })
})
