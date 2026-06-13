'use client'

import { useState, useMemo } from 'react'
import { Button } from '@mini-apps/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@mini-apps/ui/card'
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  Home,
  Palmtree,
  Thermometer,
  Loader2,
} from 'lucide-react'
import {
  getWeekDates,
  formatDate,
  formatDisplayDate,
  statusConfig,
  type StatusType,
} from '@/lib/utils'

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

interface WeeklyBoardProps {
  teamId: string
  teamName: string
  members: TeamMember[]
  statuses: TeamStatus[]
  currentUserId: string
  onSetStatus: (date: string, status: StatusType, note?: string) => Promise<void>
  onRemoveStatus: (date: string) => Promise<void>
  isLoading: boolean
}

const statusIcons: Record<StatusType, React.ReactNode> = {
  office: <Building2 className="h-4 w-4" />,
  wfh: <Home className="h-4 w-4" />,
  ooo: <Palmtree className="h-4 w-4" />,
  sick: <Thermometer className="h-4 w-4" />,
}

export function WeeklyBoard({
  teamName,
  members,
  statuses,
  currentUserId,
  onSetStatus,
  onRemoveStatus,
  isLoading,
}: WeeklyBoardProps) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [settingStatus, setSettingStatus] = useState<string | null>(null)

  const weekDates = useMemo(() => {
    const now = new Date()
    now.setDate(now.getDate() + weekOffset * 7)
    return getWeekDates(now)
  }, [weekOffset])

  const statusMap = useMemo(() => {
    const map = new Map<string, TeamStatus>()
    statuses.forEach((status) => {
      const dateStr = new Date(status.date).toISOString().split('T')[0]
      const key = `${status.member.user.id}-${dateStr}`
      map.set(key, status)
    })
    return map
  }, [statuses])

  const getStatusForCell = (userId: string, date: Date): TeamStatus | undefined => {
    const dateStr = formatDate(date)
    const key = `${userId}-${dateStr}`
    return statusMap.get(key)
  }

  const handleStatusClick = async (date: Date, status: StatusType) => {
    const dateStr = formatDate(date)
    const cellKey = `${dateStr}-${status}`
    setSettingStatus(cellKey)

    try {
      const currentStatus = getStatusForCell(currentUserId, date)
      if (currentStatus?.status === status) {
        await onRemoveStatus(dateStr)
      } else {
        await onSetStatus(dateStr, status)
      }
    } finally {
      setSettingStatus(null)
    }
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return formatDate(date) === formatDate(today)
  }

  const getSummaryForDate = (date: Date) => {
    const summary: Record<StatusType, number> = {
      office: 0,
      wfh: 0,
      ooo: 0,
      sick: 0,
    }

    members.forEach((member) => {
      const status = getStatusForCell(member.user.id, date)
      if (status && status.status in summary) {
        summary[status.status as StatusType]++
      }
    })

    return summary
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{teamName}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekOffset(weekOffset - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setWeekOffset(0)}
              disabled={weekOffset === 0}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekOffset(weekOffset + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-48 border-b p-3 text-left text-sm font-medium text-muted-foreground">
                    Team Member
                  </th>
                  {weekDates.map((date) => (
                    <th
                      key={date.toISOString()}
                      className={`min-w-[100px] border-b p-3 text-center text-sm font-medium ${
                        isToday(date)
                          ? 'bg-primary/5 text-primary'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {formatDisplayDate(date)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="group">
                    <td className="border-b p-3">
                      <div className="flex items-center gap-3">
                        {member.user.avatarUrl ? (
                          <img
                            src={member.user.avatarUrl}
                            alt={member.user.name || member.user.email}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                            {(
                              member.user.name?.[0] || member.user.email[0]
                            ).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {member.user.name || member.user.email.split('@')[0]}
                            {member.user.id === currentUserId && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                (you)
                              </span>
                            )}
                          </p>
                          {member.role === 'admin' && (
                            <span className="text-xs text-muted-foreground">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    {weekDates.map((date) => {
                      const status = getStatusForCell(member.user.id, date)
                      const isCurrentUser = member.user.id === currentUserId
                      const statusType = status?.status as StatusType | undefined

                      return (
                        <td
                          key={date.toISOString()}
                          className={`border-b p-2 ${
                            isToday(date) ? 'bg-primary/5' : ''
                          }`}
                        >
                          {isCurrentUser ? (
                            <div className="flex flex-wrap justify-center gap-1">
                              {(
                                Object.keys(statusConfig) as StatusType[]
                              ).map((s) => {
                                const isActive = statusType === s
                                const cellKey = `${formatDate(date)}-${s}`
                                const isSettingThis = settingStatus === cellKey

                                return (
                                  <button
                                    key={s}
                                    onClick={() => handleStatusClick(date, s)}
                                    disabled={settingStatus !== null}
                                    className={`flex h-8 w-8 items-center justify-center rounded-md transition-all ${
                                      isActive
                                        ? `${statusConfig[s].bgColor} ${statusConfig[s].color}`
                                        : 'bg-muted/30 text-muted-foreground hover:bg-muted'
                                    }`}
                                    title={statusConfig[s].label}
                                  >
                                    {isSettingThis ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      statusIcons[s]
                                    )}
                                  </button>
                                )
                              })}
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              {statusType ? (
                                <div
                                  className={`flex h-8 items-center gap-1.5 rounded-md px-2 ${statusConfig[statusType].bgColor} ${statusConfig[statusType].color}`}
                                  title={
                                    status?.note ||
                                    statusConfig[statusType].label
                                  }
                                >
                                  {statusIcons[statusType]}
                                  <span className="hidden text-xs sm:inline">
                                    {statusConfig[statusType].label}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  -
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary Row */}
            <div className="mt-4 rounded-lg bg-muted/30 p-4">
              <h4 className="mb-3 text-sm font-medium text-muted-foreground">
                Daily Summary
              </h4>
              <div className="grid grid-cols-5 gap-4">
                {weekDates.map((date) => {
                  const summary = getSummaryForDate(date)
                  return (
                    <div
                      key={date.toISOString()}
                      className={`rounded-lg p-3 ${
                        isToday(date) ? 'bg-primary/10' : 'bg-background'
                      }`}
                    >
                      <p className="mb-2 text-xs font-medium text-muted-foreground">
                        {formatDisplayDate(date)}
                      </p>
                      <div className="space-y-1 text-xs">
                        {summary.office > 0 && (
                          <div className="flex items-center gap-1.5 text-green-400">
                            <Building2 className="h-3 w-3" />
                            <span>{summary.office} in office</span>
                          </div>
                        )}
                        {summary.wfh > 0 && (
                          <div className="flex items-center gap-1.5 text-blue-400">
                            <Home className="h-3 w-3" />
                            <span>{summary.wfh} WFH</span>
                          </div>
                        )}
                        {summary.ooo > 0 && (
                          <div className="flex items-center gap-1.5 text-orange-400">
                            <Palmtree className="h-3 w-3" />
                            <span>{summary.ooo} OOO</span>
                          </div>
                        )}
                        {summary.sick > 0 && (
                          <div className="flex items-center gap-1.5 text-red-400">
                            <Thermometer className="h-3 w-3" />
                            <span>{summary.sick} sick</span>
                          </div>
                        )}
                        {Object.values(summary).every((v) => v === 0) && (
                          <span className="text-muted-foreground">
                            No status set
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs">
              {(Object.keys(statusConfig) as StatusType[]).map((status) => (
                <div key={status} className="flex items-center gap-1.5">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded ${statusConfig[status].bgColor} ${statusConfig[status].color}`}
                  >
                    {statusIcons[status]}
                  </div>
                  <span className="text-muted-foreground">
                    {statusConfig[status].label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
