import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@mini-apps/database'
import { createClient } from '@mini-apps/ui/lib/supabase/server'

// GET /api/status - Get statuses for a team and date range
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('teamId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!teamId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'teamId, startDate, and endDate are required' },
        { status: 400 }
      )
    }

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

    const statuses = await prisma.teamStatus.findMany({
      where: {
        member: {
          teamId,
        },
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        member: {
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
      orderBy: {
        date: 'asc',
      },
    })

    return NextResponse.json({ statuses })
  } catch (error) {
    console.error('Error fetching statuses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/status - Set or update a status
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { teamId, date, status, note } = body

    if (!teamId || !date || !status) {
      return NextResponse.json(
        { error: 'teamId, date, and status are required' },
        { status: 400 }
      )
    }

    const validStatuses = ['office', 'wfh', 'ooo', 'sick']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') },
        { status: 400 }
      )
    }

    // Get user's membership
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

    const statusDate = new Date(date)
    statusDate.setHours(0, 0, 0, 0)

    const teamStatus = await prisma.teamStatus.upsert({
      where: {
        memberId_date: {
          memberId: membership.id,
          date: statusDate,
        },
      },
      update: {
        status,
        note: note || null,
      },
      create: {
        memberId: membership.id,
        date: statusDate,
        status,
        note: note || null,
      },
      include: {
        member: {
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

    return NextResponse.json({ status: teamStatus })
  } catch (error) {
    console.error('Error setting status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/status - Remove a status
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('teamId')
    const date = searchParams.get('date')

    if (!teamId || !date) {
      return NextResponse.json(
        { error: 'teamId and date are required' },
        { status: 400 }
      )
    }

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

    const statusDate = new Date(date)
    statusDate.setHours(0, 0, 0, 0)

    await prisma.teamStatus.deleteMany({
      where: {
        memberId: membership.id,
        date: statusDate,
      },
    })

    return NextResponse.json({ message: 'Status removed' })
  } catch (error) {
    console.error('Error removing status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
