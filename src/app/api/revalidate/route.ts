import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

const EXPIRE_NOW = { expire: 0 }

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 })
  }

  const tag = request.nextUrl.searchParams.get('tag')

  if (tag) {
    revalidateTag(tag, EXPIRE_NOW)
    revalidatePath('/', 'layout')
    return Response.json({ revalidated: true, tag })
  }

  // Full revalidation: clear all data caches
  revalidateTag('pages', EXPIRE_NOW)
  revalidateTag('articles', EXPIRE_NOW)
  revalidateTag('global-settings', EXPIRE_NOW)
  revalidateTag('currency-rates', EXPIRE_NOW)
  revalidateTag('redirects', EXPIRE_NOW)

  // Clear page cache for all routes
  revalidatePath('/', 'layout')

  return Response.json({ revalidated: true })
}
