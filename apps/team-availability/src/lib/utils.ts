import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function getWeekDates(date: Date = new Date()): Date[] {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(date)
  monday.setDate(diff)
  monday.setHours(0, 0, 0, 0)

  const dates: Date[] = []
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    dates.push(d)
  }
  return dates
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export type StatusType = 'office' | 'wfh' | 'ooo' | 'sick'

export const statusConfig: Record<StatusType, { label: string; color: string; bgColor: string }> = {
  office: {
    label: 'In Office',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
  },
  wfh: {
    label: 'Work From Home',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
  },
  ooo: {
    label: 'Out of Office',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
  },
  sick: {
    label: 'Sick Leave',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
  },
}
