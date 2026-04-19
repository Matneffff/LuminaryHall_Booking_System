'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  if (isAdmin) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-heading font-bold tracking-wide text-primary">
          LUMINARY HALL
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link href="/venue" className={cn("hover:text-foreground transition-colors", pathname === '/venue' && 'text-foreground')}>
            The Venue
          </Link>
          <Link href="/book" className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors">
            Book Now
          </Link>
        </nav>
      </div>
    </header>
  )
}
