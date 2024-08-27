import { describe, expect, it } from 'vitest'

function add(a: number, b: number): number {
  return a + b
}

describe('add', () => {
  it('should add two numbers correctly', () => {
    const result = add(2, 3)

    expect(result).toBe(5)
  })

  it('should return a negative number when adding negative numbers', () => {
    const result = add(-2, -3)

    expect(result).toBe(-5)
  })

  it('should return 0 when adding 0 and 0', () => {
    const result = add(0, 0)

    expect(result).toBe(0)
  })
})
