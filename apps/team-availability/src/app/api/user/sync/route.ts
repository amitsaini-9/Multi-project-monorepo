import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@mini-apps/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, email, name, avatarUrl } = body

    if (!id || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const user = await prisma.user.upsert({
      where: { id },
      update: {
        email,
        name: name || null,
        avatarUrl: avatarUrl || null,
        updatedAt: new Date(),
      },
      create: {
        id,
        email,
        name: name || null,
        avatarUrl: avatarUrl || null,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
