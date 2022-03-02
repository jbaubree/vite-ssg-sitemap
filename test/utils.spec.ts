import { describe, expect, test } from 'vitest'
import { removeMaybeSuffix } from '../src/utils'

describe('Utils', () => {
  test('Remove maybe suffix', () => {
    expect(removeMaybeSuffix('suffix', 'prefix')).toBe('prefix')
    expect(removeMaybeSuffix('suffix', 'prefixsuffix')).toBe('prefix')
  })
})
