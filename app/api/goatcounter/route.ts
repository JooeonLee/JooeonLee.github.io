import { NextRequest, NextResponse } from 'next/server'
import siteMetadata from '@/data/siteMetadata'

const site = process.env.GOATCOUNTER_SITE || siteMetadata.goatCounter?.site
const token = process.env.GOATCOUNTER_API_TOKEN

function extractCount(data: unknown) {
  if (typeof data === 'number') {
    return data
  }
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>
    if (typeof record.total === 'number') return record.total
    if (typeof record.count === 'number') return record.count
    if (typeof record.hits === 'number') return record.hits
    if (Array.isArray(record.hits)) {
      const sum = record.hits.reduce((acc, item) => {
        const typed = item as Record<string, unknown>
        const value =
          typeof typed.count === 'number'
            ? typed.count
            : typeof typed.hits === 'number'
              ? typed.hits
              : 0
        return acc + value
      }, 0)
      return sum || null
    }
  }
  if (Array.isArray(data)) {
    const sum = data.reduce((acc, item) => {
      const typed = item as Record<string, unknown>
      const value =
        typeof typed.count === 'number'
          ? typed.count
          : typeof typed.hits === 'number'
            ? typed.hits
            : 0
      return acc + value
    }, 0)
    return sum || null
  }
  return null
}

export async function GET(request: NextRequest) {
  if (!site) {
    return NextResponse.json({ count: null, error: 'Missing GOATCOUNTER_SITE' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  const type = searchParams.get('type')

  if (!token) {
    return NextResponse.json(
      { count: null, error: 'Missing GOATCOUNTER_API_TOKEN' },
      { status: 500 }
    )
  }

  let url = ''
  if (type === 'total') {
    url = `https://${site}.goatcounter.com/api/v0/stats/total`
  } else if (path) {
    url = `https://${site}.goatcounter.com/api/v0/stats/hits?path=${encodeURIComponent(path)}`
  } else {
    return NextResponse.json({ count: null, error: 'Missing path' }, { status: 400 })
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    return NextResponse.json({ count: null }, { status: response.status })
  }

  const data = (await response.json()) as unknown
  const count = extractCount(data)
  return NextResponse.json({ count })
}
