'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@mini-apps/ui/card'
import {
  Building2,
  Home,
  Palmtree,
  Thermometer,
  Users,
  Calendar,
} from 'lucide-react'
import { formatDate, statusConfig, type StatusType } from '@/lib/utils'

interface TeamMember {
  id: string
  role: string
  user: {
    id: string
    name: string | null
    email: string
    avatarUrl: string | null
  }
}

interface TeamStatus {
  id: string
  date: string
  status: string
  note: string | null
  member: TeamMember
}

interface TeamOverviewProps {
  teamName: string
  members: TeamMember[]
  statuses: TeamStatus[]
}

const statusIcons: Record<StatusType, React.ReactNode> = {
  office: <Building2 className="h-5 w-5" />,
  wfh: <Home className="h-5 w-5" />,
  ooo: <Palmtree className="h-5 w-5" />,
  sick: <Thermometer className="h-5 w-5" />,
}

export function TeamOverview({ teamName, members, statuses }: TeamOverviewProps) {
  const todayStr = formatDate(new Date())

  const todayStats = useMemo(() => {
    const stats: Record<StatusType, TeamMember[]> = {
      office: [],
      wfh: [],
      ooo: [],
      sick: [],
    }

    const todayStatuses = statuses.filter((s) => {
      const statusDate = new Date(s.date).toISOString().split('T')[0]
      return statusDate === todayStr
    })

    todayStatuses.forEach((status) => {
      if (status.status in stats) {
        stats[status.status as StatusType].push(status.member)
      }
    })

    return stats
  }, [statuses, todayStr])

  const membersWithNoStatus = useMemo(() => {
    const membersWithStatus = new Set(
      statuses
        .filter((s) => {
          const statusDate = new Date(s.date).toISOString().split('T')[0]
          return statusDate === todayStr
        })
        .map((s) => s.member.user.id)
    )

    return members.filter((m) => !membersWithStatus.has(m.user.id))
  }, [members, statuses, todayStr])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Today&apos;s Overview - {teamName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(statusConfig) as StatusType[]).map((status) => (
              <div
                key={status}
                className={`rounded-lg p-4 ${statusConfig[status].bgColor}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`${statusConfig[status].color}`}>
                    {statusIcons[status]}
                  </div>
                  <span className={`text-2xl font-bold ${statusConfig[status].color}`}>
                    {todayStats[status].length}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium">
                  {statusConfig[status].label}
                </p>
                {todayStats[status].length > 0 && (
                  <div className="mt-3 flex -space-x-2">
                    {todayStats[status].slice(0, 5).map((member) => (
                      <div
                        key={member.id}
                        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-card text-xs font-medium"
                        title={member.user.name || member.user.email}
                      >
                        {member.user.avatarUrl ? (
                          <img
                            src={member.user.avatarUrl}
                            alt={member.user.name || member.user.email}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          (
                            member.user.name?.[0] || member.user.email[0]
                          ).toUpperCase()
                        )}
                      </div>
                    ))}
                    {todayStats[status].length > 5 && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                        +{todayStats[status].length - 5}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {membersWithNoStatus.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-muted-foreground" />
              Not Yet Set ({membersWithNoStatus.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {membersWithNoStatus.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2"
                >
                  {member.user.avatarUrl ? (
                    <img
                      src={member.user.avatarUrl}
                      alt={member.user.name || member.user.email}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {(
                        member.user.name?.[0] || member.user.email[0]
                      ).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm">
                    {member.user.name || member.user.email.split('@')[0]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            Team Members ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => {
              const todayStatus = statuses.find((s) => {
                const statusDate = new Date(s.date).toISOString().split('T')[0]
                return statusDate === todayStr && s.member.user.id === member.user.id
              })

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    {member.user.avatarUrl ? (
                      <img
                        src={member.user.avatarUrl}
                        alt={member.user.name || member.user.email}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {(
                          member.user.name?.[0] || member.user.email[0]
                        ).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {member.user.name || member.user.email.split('@')[0]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.role === 'admin' ? 'Admin' : 'Member'}
                      </p>
                    </div>
                  </div>
                  {todayStatus ? (
                    <div
                      className={`flex items-center gap-1.5 rounded-md px-2 py-1 ${
                        statusConfig[todayStatus.status as StatusType].bgColor
                      } ${statusConfig[todayStatus.status as StatusType].color}`}
                    >
                      {statusIcons[todayStatus.status as StatusType]}
                      <span className="text-xs">
                        {statusConfig[todayStatus.status as StatusType].label}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No status
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
