import { BackendURL } from '../config.js'

export const getData = async (MDX) => {
  try {
    const response = await fetch(`${BackendURL}/api/v1/cube/query`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mdx: MDX
      })
    })

    return await response.json()
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const setData = async (MDX, updatedData) => {
  try {
    const response = await fetch(`${BackendURL}/api/v1/cube/query`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mdx: MDX,
        updatedData
      })
    })

    return await response.json()
  } catch (error) {
    console.error(error)
    throw error
  }
}