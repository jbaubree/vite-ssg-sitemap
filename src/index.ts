import type { UserOptions } from 'sitemap-ts'
import { generateSitemap as sitemap } from 'sitemap-ts'

export default function generateSitemap(options: UserOptions = {}) {
  sitemap(options)
}
