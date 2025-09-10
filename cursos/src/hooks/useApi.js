import { useState, useEffect } from 'react'
import { api } from '../services/api'

/**
 * Hook para manejar llamadas a API con loading y error states
 */
export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get(url, options)
        setData(response.data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(url, options)
      setData(response.data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch }
}

/**
 * Hook para manejar mutaciones (POST, PUT, DELETE)
 */
export const useMutation = (mutationFn) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const mutate = async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await mutationFn(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setLoading(false)
    setError(null)
    setData(null)
  }

  return { mutate, loading, error, data, reset }
}