'use client'

import { useEffect, useState } from 'react'

type CountState = {
  value: number | null
  loading: boolean
}

function formatCount(value: number | null) {
  if (value === null) {
    return '-'
  }
  return value.toLocaleString('en-US')
}

async function fetchCount(url: string, signal: AbortSignal) {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    return null
  }
  const data = (await response.json()) as { count?: number | null }
  if (typeof data.count === 'number') {
    return data.count
  }
  return null
}

export default function GoatCounterStats({ path }: { path: string }) {
  const [total, setTotal] = useState<CountState>({ value: null, loading: true })
  const [page, setPage] = useState<CountState>({ value: null, loading: true })

  useEffect(() => {
    const controller = new AbortController()
    const encodedPath = encodeURIComponent(path)

    fetchCount(`/api/goatcounter?type=total`, controller.signal)
      .then((count) => setTotal({ value: count, loading: false }))
      .catch(() => setTotal({ value: null, loading: false }))

    fetchCount(`/api/goatcounter?path=${encodedPath}`, controller.signal)
      .then((count) => setPage({ value: count, loading: false }))
      .catch(() => setPage({ value: null, loading: false }))

    return () => controller.abort()
  }, [path])

  return (
    <div className="mt-6 space-y-3 border-t border-gray-200 pt-4 text-sm dark:border-gray-700">
      <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
        <span>Site visits</span>
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {total.loading ? '...' : formatCount(total.value)}
        </span>
      </div>
      <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
        <span>Post views</span>
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {page.loading ? '...' : formatCount(page.value)}
        </span>
      </div>
    </div>
  )
}
