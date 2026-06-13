'use client'

import { useState } from 'react'
import { Button } from '@mini-apps/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@mini-apps/ui/card'
import { Input } from '@mini-apps/ui/input'
import { Label } from '@mini-apps/ui/label'
import {
  Plus,
  Users,
  Share2,
  Copy,
  Check,
  Loader2,
  UserPlus,
} from 'lucide-react'

interface Team {
  id: string
  name: string
  inviteCode: string
  role: string
  members: Array<{
    id: string
    role: string
    user: {
      id: string
      name: string | null
      email: string
      avatarUrl: string | null
    }
  }>
}

interface TeamSelectorProps {
  teams: Team[]
  selectedTeamId: string | null
  onSelectTeam: (teamId: string) => void
  onCreateTeam: (name: string) => Promise<void>
  onJoinTeam: (code: string) => Promise<void>
  isLoading: boolean
}

export function TeamSelector({
  teams,
  selectedTeamId,
  onSelectTeam,
  onCreateTeam,
  onJoinTeam,
  isLoading,
}: TeamSelectorProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeamName.trim()) return

    setFormLoading(true)
    try {
      await onCreateTeam(newTeamName.trim())
      setNewTeamName('')
      setShowCreateForm(false)
    } finally {
      setFormLoading(false)
    }
  }

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteCode.trim()) return

    setFormLoading(true)
    try {
      await onJoinTeam(inviteCode.trim())
      setInviteCode('')
      setShowJoinForm(false)
    } finally {
      setFormLoading(false)
    }
  }

  const copyInviteCode = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setShowCreateForm(true)
            setShowJoinForm(false)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setShowJoinForm(true)
            setShowCreateForm(false)
          }}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Join Team
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create a New Team</CardTitle>
            <CardDescription>
              Start a new team and invite your colleagues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  placeholder="e.g., Engineering Team"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  disabled={formLoading}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={formLoading || !newTeamName.trim()}>
                  {formLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Create Team
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {showJoinForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Join a Team</CardTitle>
            <CardDescription>
              Enter the invite code shared by your team admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinTeam} className="space-y-4">
              <div>
                <Label htmlFor="inviteCode">Invite Code</Label>
                <Input
                  id="inviteCode"
                  placeholder="e.g., ABC12345"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  disabled={formLoading}
                  className="uppercase"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={formLoading || !inviteCode.trim()}>
                  {formLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Join Team
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowJoinForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {teams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No teams yet</h3>
            <p className="mb-4 text-center text-muted-foreground">
              Create a new team or join an existing one to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card
              key={team.id}
              className={`cursor-pointer transition-colors hover:border-primary/50 ${
                selectedTeamId === team.id ? 'border-primary' : ''
              }`}
              onClick={() => onSelectTeam(team.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{team.name}</CardTitle>
                  {team.role === 'admin' && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      Admin
                    </span>
                  )}
                </div>
                <CardDescription>
                  {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {team.members.slice(0, 5).map((member) => (
                      <div
                        key={member.id}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-secondary text-xs font-medium"
                        title={member.user.name || member.user.email}
                      >
                        {member.user.avatarUrl ? (
                          <img
                            src={member.user.avatarUrl}
                            alt={member.user.name || member.user.email}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          (member.user.name?.[0] || member.user.email[0]).toUpperCase()
                        )}
                      </div>
                    ))}
                    {team.members.length > 5 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                        +{team.members.length - 5}
                      </div>
                    )}
                  </div>
                  {team.role === 'admin' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyInviteCode(team.inviteCode)
                      }}
                      title="Copy invite code"
                    >
                      {copiedCode === team.inviteCode ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Share2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                {team.role === 'admin' && (
                  <div className="mt-3 flex items-center gap-2 rounded bg-muted/50 px-2 py-1.5 text-xs">
                    <span className="text-muted-foreground">Invite code:</span>
                    <code className="font-mono">{team.inviteCode}</code>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        copyInviteCode(team.inviteCode)
                      }}
                      className="ml-auto"
                    >
                      {copiedCode === team.inviteCode ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
