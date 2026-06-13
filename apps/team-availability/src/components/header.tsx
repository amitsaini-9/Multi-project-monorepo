'use client'

import { useState } from 'react'
import { createClient } from '@mini-apps/ui/lib/supabase/client'
import { Button } from '@mini-apps/ui/button'
import { Users, LogOut, ChevronDown } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface HeaderProps {
  user: User | null
}

export function Header({ user }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Team Availability</h1>
            <p className="text-xs text-muted-foreground">Hybrid work tracker</p>
          </div>
        </div>

        {user && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent"
            >
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.full_name || 'User'}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
                  {(user.email?.[0] || 'U').toUpperCase()}
                </div>
              )}
              <span className="hidden text-sm sm:inline">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border bg-card py-1 shadow-lg">
                  <div className="border-b px-4 py-2">
                    <p className="text-sm font-medium">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-none"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
