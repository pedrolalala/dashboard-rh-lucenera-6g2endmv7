import { useState, useEffect } from 'react'

export function useFeriados(year: number) {
  const [feriados, setFeriados] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchFeriados() {
      if (!year || isNaN(year)) return
      setLoading(true)
      try {
        const res = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`)
        if (res.ok) {
          const data = await res.json()
          setFeriados(data)
        } else {
          setFeriados([])
        }
      } catch (e) {
        console.error('Erro ao buscar feriados:', e)
        setFeriados([])
      } finally {
        setLoading(false)
      }
    }
    fetchFeriados()
  }, [year])

  return { feriados, loading }
}
