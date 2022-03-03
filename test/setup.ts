import { existsSync, rmSync } from 'fs'
import { afterEach, beforeAll } from 'vitest'

import { ROBOTS_FILE, SITEMAP_FILE, TEST_FILE } from './variables'

const removeFiles = () => {
  if (existsSync(SITEMAP_FILE)) rmSync(SITEMAP_FILE)
  if (existsSync(ROBOTS_FILE)) rmSync(ROBOTS_FILE)
  if (existsSync(TEST_FILE)) rmSync(TEST_FILE)
}

beforeAll(() => {
  removeFiles()
})

afterEach(() => {
  removeFiles()
})
