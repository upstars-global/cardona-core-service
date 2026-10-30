import { describe, expect, it } from 'vitest'
import { isOperatorIn } from '../../../src/libs/identity/operator-presence'

describe('operator presence', () => {
  it('counts a cookie session the legacy flag knows nothing about', () => {
    expect(isOperatorIn(false, true)).toBe(true)
  })

  it('keeps the legacy sign-in as it was', () => {
    expect(isOperatorIn(true, false)).toBe(true)
  })

  it('is nobody when neither way in is open', () => {
    expect(isOperatorIn(false, false)).toBe(false)
  })
})
