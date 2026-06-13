import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@mini-apps/ui/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Sync user to database
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Call our API to sync user
        const syncUrl = new URL('/api/user/sync', origin)
        await fetch(syncUrl.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.user_metadata?.name,
            avatarUrl: user.user_metadata?.avatar_url,
          }),
        })
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
