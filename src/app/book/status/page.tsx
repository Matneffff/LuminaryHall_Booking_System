'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { supabase, type Booking } from '@/lib/supabase'
import { toast } from 'sonner'
import { Search, Calendar, Clock, User, Mail, Tag, Users, CheckCircle, XCircle, Loader2, ArrowLeft, RefreshCw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

const SLOT_LABELS: Record<string, string> = {
  morning: 'Daylight — 8:00 AM to 1:00 PM',
  afternoon: 'Twilight — 2:00 PM to 7:00 PM',
  evening: 'Luminary Night — 7:00 PM to 12:00 AM',
}

const SLOT_PRICES: Record<string, string> = {
  morning: 'RM 4,500',
  afternoon: 'RM 5,500',
  evening: 'RM 7,500',
}

const STATUS_CONFIG = {
  pending: {
    label: 'Pending Review',
    description: "Your booking request is being reviewed by our team. We'll confirm within 24 hours.",
    icon: Loader2,
    iconClass: 'text-amber-500 animate-spin',
    badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  approved: {
    label: 'Confirmed',
    description: 'Your booking has been approved! Our team will be in touch with payment details.',
    icon: CheckCircle,
    iconClass: 'text-emerald-500',
    badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  rejected: {
    label: 'Not Available',
    description: "Unfortunately we're unable to accommodate this booking. Please contact us to explore alternatives.",
    icon: XCircle,
    iconClass: 'text-destructive',
    badgeClass: 'bg-destructive/10 text-destructive border-destructive/20',
  },
}

function BookingCard({ booking, onRefresh }: { booking: Booking; onRefresh: () => void }) {
  const status = STATUS_CONFIG[booking.status]
  const StatusIcon = status.icon

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
      {/* Status header */}
      <div className="flex items-start gap-4 pb-4 border-b border-border/50">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${status.badgeClass} border`}>
          <StatusIcon className={`w-5 h-5 ${status.iconClass}`} />
        </div>
        <div>
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full border font-medium mb-1 ${status.badgeClass}`}>
            {status.label}
          </span>
          <p className="text-sm text-muted-foreground">{status.description}</p>
        </div>
      </div>

      {/* Booking details */}
      <div className="grid grid-cols-1 gap-2.5 text-sm">
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="flex-1 flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{booking.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="flex-1 flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{booking.email}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Tag className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="flex-1 flex justify-between">
            <span className="text-muted-foreground">Event</span>
            <span className="font-medium">{booking.event_type}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Users className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="flex-1 flex justify-between">
            <span className="text-muted-foreground">Guests</span>
            <span className="font-medium">{booking.guest_count} pax</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="flex-1 flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{format(parseISO(booking.date), 'EEEE, d MMM yyyy')}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="flex-1 flex justify-between">
            <span className="text-muted-foreground">Slot</span>
            <span className="font-medium">{SLOT_LABELS[booking.time_slot] || booking.time_slot}</span>
          </div>
        </div>
        <div className="flex justify-between pt-3 border-t border-border/50">
          <span className="text-muted-foreground font-medium">Estimated Total</span>
          <span className="text-primary font-bold">{SLOT_PRICES[booking.time_slot] || '—'}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-1 text-xs text-muted-foreground">
        <span>Ref: <span className="font-mono">{booking.id.slice(0, 8).toUpperCase()}</span></span>
        <span>Submitted {format(parseISO(booking.created_at), 'MMM d, yyyy')}</span>
      </div>

      <button onClick={onRefresh}
        className="w-full inline-flex items-center justify-center gap-2 border border-border/50 py-2.5 rounded text-sm hover:border-primary/40 hover:text-primary transition-colors">
        <RefreshCw className="w-4 h-4" /> Refresh Status
      </button>
    </div>
  )
}

function StatusContent() {
  const params = useSearchParams()
  const router = useRouter()

  const [mode, setMode] = useState<'id' | 'email'>('id')
  const [query, setQuery] = useState(params.get('id') || '')
  const [loading, setLoading] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [searched, setSearched] = useState(false)

  const lookupById = async (id: string) => {
    setLoading(true)
    setSearched(true)
    setBookings([])

    const { data } = await supabase
      .from('bookings')
      .select('*')
      .or(`id.eq.${id.trim()},id.ilike.${id.trim()}%`)
      .limit(1)
      .single()

    if (data) {
      setBookings([data as Booking])
      router.replace(`/book/status?id=${data.id}`, { scroll: false })
    } else {
      toast.error('No booking found with that reference ID.')
    }
    setLoading(false)
  }

  const lookupByEmail = async (email: string) => {
    setLoading(true)
    setSearched(true)
    setBookings([])

    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .order('created_at', { ascending: false })

    if (data && data.length > 0) {
      setBookings(data as Booking[])
    } else {
      toast.error('No bookings found for that email address.')
    }
    setLoading(false)
  }

  useEffect(() => {
    const id = params.get('id')
    if (id) { setMode('id'); setQuery(id); lookupById(id) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    if (mode === 'id') lookupById(query)
    else lookupByEmail(query)
  }

  const handleModeSwitch = (m: 'id' | 'email') => {
    setMode(m)
    setQuery('')
    setBookings([])
    setSearched(false)
  }

  return (
    <main className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-2">Booking Lookup</p>
          <h1 className="text-4xl font-bold">Check Your Status</h1>
          <p className="text-muted-foreground mt-2 text-sm">Look up your booking by reference ID or the email you used.</p>
        </motion.div>

        {/* Mode toggle */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="flex rounded-lg border border-border/50 p-1 mb-4 bg-card">
          <button onClick={() => handleModeSwitch('id')}
            className={`flex-1 py-2 text-sm rounded font-medium transition-colors ${mode === 'id' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            By Reference ID
          </button>
          <button onClick={() => handleModeSwitch('email')}
            className={`flex-1 py-2 text-sm rounded font-medium transition-colors ${mode === 'email' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            By Email
          </button>
        </motion.div>

        {/* Search form */}
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8">
          <Input
            key={mode}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={mode === 'id' ? 'e.g. A1B2C3D4 or full UUID' : 'e.g. yourname@email.com'}
            className={mode === 'id' ? 'font-mono' : ''}
            type={mode === 'email' ? 'email' : 'text'}
            autoFocus
          />
          <button type="submit" disabled={loading || !query.trim()}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors flex-shrink-0">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </motion.form>

        {/* Results */}
        {bookings.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {bookings.length > 1 && (
              <p className="text-sm text-muted-foreground">{bookings.length} bookings found for <span className="font-medium text-foreground">{query}</span></p>
            )}
            {bookings.map(b => (
              <BookingCard key={b.id} booking={b} onRefresh={() => mode === 'id' ? lookupById(b.id) : lookupByEmail(query)} />
            ))}
          </motion.div>
        )}

        {searched && !loading && bookings.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No booking found.</p>
            <p className="text-xs mt-1">
              {mode === 'id' ? 'Check the reference ID from your confirmation page.' : 'Make sure you use the same email you booked with.'}
            </p>
          </motion.div>
        )}

        {!searched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-center py-8 text-muted-foreground text-sm space-y-1">
            {mode === 'id' ? (
              <>
                <p>Your reference ID was shown on the confirmation page.</p>
                <p className="text-xs opacity-60">It looks like <span className="font-mono">A1B2C3D4</span> (first 8 characters of the full ID).</p>
              </>
            ) : (
              <p>Enter the email address you used when making your booking.</p>
            )}
          </motion.div>
        )}
      </div>
    </main>
  )
}

export default function BookingStatusPage() {
  return (
    <Suspense>
      <StatusContent />
    </Suspense>
  )
}
