import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 })
  }

  const tag = request.nextUrl.searchParams.get('tag')

  if (tag) {
    revalidateTag(tag)
    revalidatePath('/', 'layout')
    return Response.json({ revalidated: true, tag })
  }

  // Full revalidation: clear all data caches
  revalidateTag('pages')
  revalidateTag('articles')
  revalidateTag('global-settings')
  revalidateTag('currency-rates')
  revalidateTag('redirects')

  // Clear page cache for all routes
  revalidatePath('/', 'layout')

  return Response.json({ revalidated: true })
}
