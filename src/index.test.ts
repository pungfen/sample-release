import { describe, expect, it } from 'vitest'

import { greet, introduction, name } from './index.js'

describe('greet', () => {
  it('should return greeting string', () => {
    expect(greet('world')).toBe('Hello, world')
  })
})

describe('introduction', () => {
  it('should return self-introduction string', () => {
    expect(introduction('peng')).toBe('Hello, My name is peng')
  })
})

describe('name', () => {
  it('should be xx', () => {
    expect(name).toBe('xx')
  })
})
