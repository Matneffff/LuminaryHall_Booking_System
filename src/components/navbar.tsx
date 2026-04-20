'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const [open, setOpen] = useState(false)

  if (isAdmin) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-heading font-bold tracking-wide text-primary">
          LUMINARY HALL
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link href="/venue" className={cn("hover:text-foreground transition-colors", pathname === '/venue' && 'text-foreground')}>
            The Venue
          </Link>
          <Link href="/book/status" className={cn("hover:text-foreground transition-colors", pathname === '/book/status' && 'text-foreground')}>
            My Booking
          </Link>
          <Link href="/book" className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors">
            Book Now
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border/50 bg-background/95 px-6 py-4 flex flex-col gap-4 text-sm">
          <Link
            href="/venue"
            onClick={() => setOpen(false)}
            className={cn("text-muted-foreground hover:text-foreground transition-colors", pathname === '/venue' && 'text-foreground')}
          >
            The Venue
          </Link>
          <Link
            href="/book/status"
            onClick={() => setOpen(false)}
            className={cn("text-muted-foreground hover:text-foreground transition-colors", pathname === '/book/status' && 'text-foreground')}
          >
            My Booking
          </Link>
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="w-full text-center px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90 transition-colors"
          >
            Book Now
          </Link>
        </div>
      )}
    </header>
  )
}
