import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Team Availability Dashboard',
  description: 'Track team member availability for hybrid work',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  )
}
