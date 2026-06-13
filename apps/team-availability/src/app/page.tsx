'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@mini-apps/ui/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { Header } from '@/components/header'
import { TeamSelector } from '@/components/team-selector'
import { WeeklyBoard } from '@/components/weekly-board'
import { TeamOverview } from '@/components/team-overview'
import { Button } from '@mini-apps/ui/button'
import { Card, CardContent } from '@mini-apps/ui/card'
import { Loader2, Calendar, Users, ArrowLeft } from 'lucide-react'
import { getWeekDates, formatDate, type StatusType } from '@/lib/utils'

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

interface Team {
  id: string
  name: string
  inviteCode: string
  role: string
  members: TeamMember[]
}

interface TeamStatus {
  id: string
  date: string
  status: string
  note: string | null
  member: TeamMember
}

type ViewMode = 'overview' | 'weekly'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [statuses, setStatuses] = useState<TeamStatus[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('weekly')
  const [isLoadingTeams, setIsLoadingTeams] = useState(true)
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const fetchTeams = useCallback(async () => {
    setIsLoadingTeams(true)
    setError(null)
    try {
      const response = await fetch('/api/teams')
      if (!response.ok) throw new Error('Failed to fetch teams')
      const data = await response.json()
      setTeams(data.teams)

      // Auto-select first team if none selected
      if (data.teams.length > 0 && !selectedTeamId) {
        setSelectedTeamId(data.teams[0].id)
      }
    } catch (err) {
      setError('Failed to load teams')
      console.error(err)
    } finally {
      setIsLoadingTeams(false)
    }
  }, [selectedTeamId])

  const fetchStatuses = useCallback(async (teamId: string) => {
    setIsLoadingStatuses(true)
    try {
      // Get 4 weeks of data (2 past, current, 1 future)
      const now = new Date()
      const startDate = new Date(now)
      startDate.setDate(startDate.getDate() - 14)
      const endDate = new Date(now)
      endDate.setDate(endDate.getDate() + 14)

      const response = await fetch(
        `/api/status?teamId=${teamId}&startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`
      )
      if (!response.ok) throw new Error('Failed to fetch statuses')
      const data = await response.json()
      setStatuses(data.statuses)
    } catch (err) {
      console.error('Failed to load statuses:', err)
    } finally {
      setIsLoadingStatuses(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchTeams()
    }
  }, [user, fetchTeams])

  useEffect(() => {
    if (selectedTeamId) {
      fetchStatuses(selectedTeamId)
    }
  }, [selectedTeamId, fetchStatuses])

  const handleCreateTeam = async (name: string) => {
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create team')
      }
      const data = await response.json()
      setTeams((prev) => [...prev, { ...data.team, role: 'admin' }])
      setSelectedTeamId(data.team.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team')
      throw err
    }
  }

  const handleJoinTeam = async (code: string) => {
    try {
      const response = await fetch('/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: code }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to join team')
      }
      const data = await response.json()
      setTeams((prev) => [...prev, { ...data.team, role: 'member' }])
      setSelectedTeamId(data.team.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join team')
      throw err
    }
  }

  const handleSetStatus = async (date: string, status: StatusType, note?: string) => {
    if (!selectedTeamId) return

    try {
      const response = await fetch('/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: selectedTeamId,
          date,
          status,
          note,
        }),
      })
      if (!response.ok) throw new Error('Failed to set status')

      // Refresh statuses
      await fetchStatuses(selectedTeamId)
    } catch (err) {
      console.error('Failed to set status:', err)
    }
  }

  const handleRemoveStatus = async (date: string) => {
    if (!selectedTeamId) return

    try {
      const response = await fetch(
        `/api/status?teamId=${selectedTeamId}&date=${date}`,
        { method: 'DELETE' }
      )
      if (!response.ok) throw new Error('Failed to remove status')

      // Refresh statuses
      await fetchStatuses(selectedTeamId)
    } catch (err) {
      console.error('Failed to remove status:', err)
    }
  }

  const selectedTeam = teams.find((t) => t.id === selectedTeamId)

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-4 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {!selectedTeamId ? (
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Your Teams</h2>
              <p className="text-muted-foreground">
                Select a team to view availability or create a new one
              </p>
            </div>
            <TeamSelector
              teams={teams}
              selectedTeamId={selectedTeamId}
              onSelectTeam={setSelectedTeamId}
              onCreateTeam={handleCreateTeam}
              onJoinTeam={handleJoinTeam}
              isLoading={isLoadingTeams}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedTeamId(null)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Teams
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'weekly' ? 'default' : 'outline'}
                  onClick={() => setViewMode('weekly')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Weekly Board
                </Button>
                <Button
                  variant={viewMode === 'overview' ? 'default' : 'outline'}
                  onClick={() => setViewMode('overview')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Overview
                </Button>
              </div>
            </div>

            {selectedTeam && (
              <>
                {viewMode === 'weekly' ? (
                  <WeeklyBoard
                    teamId={selectedTeam.id}
                    teamName={selectedTeam.name}
                    members={selectedTeam.members}
                    statuses={statuses}
                    currentUserId={user.id}
                    onSetStatus={handleSetStatus}
                    onRemoveStatus={handleRemoveStatus}
                    isLoading={isLoadingStatuses}
                  />
                ) : (
                  <TeamOverview
                    teamName={selectedTeam.name}
                    members={selectedTeam.members}
                    statuses={statuses}
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
