import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@mini-apps/database'
import { createClient } from '@mini-apps/ui/lib/supabase/server'

type RouteContext = {
  params: Promise<{ teamId: string }>
}

// GET /api/teams/[teamId] - Get team details
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { teamId } = await context.params

    // Verify user is a member
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: 'Not a team member' }, { status: 403 })
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
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

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    return NextResponse.json({ team, role: membership.role })
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/teams/[teamId] - Leave or delete team
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { teamId } = await context.params

    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: 'Not a team member' }, { status: 403 })
    }

    if (membership.role === 'admin') {
      // Check if there are other admins
      const otherAdmins = await prisma.teamMember.count({
        where: {
          teamId,
          role: 'admin',
          userId: { not: user.id },
        },
      })

      if (otherAdmins === 0) {
        // Check if there are other members
        const otherMembers = await prisma.teamMember.count({
          where: {
            teamId,
            userId: { not: user.id },
          },
        })

        if (otherMembers === 0) {
          // Delete the team if no other members
          await prisma.team.delete({
            where: { id: teamId },
          })
          return NextResponse.json({ message: 'Team deleted' })
        }

        return NextResponse.json(
          { error: 'Cannot leave team. Promote another member to admin first.' },
          { status: 400 }
        )
      }
    }

    // Leave the team
    await prisma.teamMember.delete({
      where: { id: membership.id },
    })

    return NextResponse.json({ message: 'Left team successfully' })
  } catch (error) {
    console.error('Error leaving team:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
