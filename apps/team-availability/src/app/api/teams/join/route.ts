import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@mini-apps/database'
import { createClient } from '@mini-apps/ui/lib/supabase/server'

// POST /api/teams/join - Join a team with invite code
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { inviteCode } = body

    if (!inviteCode || typeof inviteCode !== 'string') {
      return NextResponse.json(
        { error: 'Invite code is required' },
        { status: 400 }
      )
    }

    const team = await prisma.team.findUnique({
      where: { inviteCode: inviteCode.toUpperCase().trim() },
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 404 }
      )
    }

    // Check if already a member
    const existingMembership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: team.id,
          userId: user.id,
        },
      },
    })

    if (existingMembership) {
      return NextResponse.json(
        { error: 'You are already a member of this team' },
        { status: 400 }
      )
    }

    const membership = await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: user.id,
        role: 'member',
      },
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

    return NextResponse.json({ team: membership.team }, { status: 201 })
  } catch (error) {
    console.error('Error joining team:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
