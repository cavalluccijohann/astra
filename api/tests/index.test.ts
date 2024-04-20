import { describe, expect, it } from 'vitest'
import { $fetch } from 'nitro-test-utils/e2e'

describe('API is alive', () => {
  it('should return a 200 status', async () => {
    const { data, status } = await $fetch('/')

    expect(status).toBe(200)
    expect(data).toMatchSnapshot()
  })
})

describe('Feed route', () => {
  it('should return a 200 status', async () => {
    const response = await $fetch('/album', {
      method: 'GET',
    })

    expect(response.status).toBe(200)
  })
})
