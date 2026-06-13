import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@mini-apps/database'
import { createClient } from '@mini-apps/ui/lib/supabase/server'
import { generateInviteCode } from '@/lib/utils'

// GET /api/teams - Get all teams for the current user
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const memberships = await prisma.teamMember.findMany({
      where: { userId: user.id },
      include: {
        team: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    const teams = memberships.map(m => ({
      ...m.team,
      role: m.role,
      membershipId: m.id,
    }))

    return NextResponse.json({ teams })
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/teams - Create a new team
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Team name is required' },
        { status: 400 }
      )
    }

    // Generate unique invite code
    let inviteCode = generateInviteCode()
    let attempts = 0
    while (attempts < 10) {
      const existing = await prisma.team.findUnique({
        where: { inviteCode },
      })
      if (!existing) break
      inviteCode = generateInviteCode()
      attempts++
    }

    const team = await prisma.team.create({
      data: {
        name: name.trim(),
        inviteCode,
        members: {
          create: {
            userId: user.id,
            role: 'admin',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ team }, { status: 201 })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
