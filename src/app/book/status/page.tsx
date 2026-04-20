'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { supabase, type Booking } from '@/lib/supabase'
import { toast } from 'sonner'
import { Search, Calendar, Clock, User, CheckCircle, XCircle, Loader2, ArrowLeft, RefreshCw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

const SLOT_LABELS: Record<string, string> = {
  morning: 'Daylight — 8:00 AM to 1:00 PM',
  afternoon: 'Twilight — 2:00 PM to 7:00 PM',
  evening: 'Luminary Night — 7:00 PM to 12:00 AM',
}

const STATUS_CONFIG = {
  pending: {
    label: 'Pending Review',
    description: 'Your booking request is being reviewed by our team. We\'ll confirm within 24 hours.',
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
    description: 'Unfortunately we\'re unable to accommodate this booking. Please contact us to explore alternatives.',
    icon: XCircle,
    iconClass: 'text-destructive',
    badgeClass: 'bg-destructive/10 text-destructive border-destructive/20',
  },
}

function StatusContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(params.get('id') || '')
  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [searched, setSearched] = useState(false)

  const lookup = async (id: string) => {
    if (!id.trim()) return
    setLoading(true)
    setSearched(true)
    setBooking(null)

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .or(`id.eq.${id.trim()},id.ilike.${id.trim()}%`)
      .limit(1)
      .single()

    if (error || !data) {
      toast.error('Booking not found. Please check the ID and try again.')
    } else {
      setBooking(data as Booking)
      router.replace(`/book/status?id=${data.id}`, { scroll: false })
    }
    setLoading(false)
  }

  useEffect(() => {
    const id = params.get('id')
    if (id) lookup(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    lookup(query)
  }

  const status = booking ? STATUS_CONFIG[booking.status] : null
  const StatusIcon = status?.icon

  return (
    <main className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-2">Booking Lookup</p>
          <h1 className="text-4xl font-bold">Check Your Status</h1>
          <p className="text-muted-foreground mt-2 text-sm">Enter your booking reference ID to view the current status.</p>
        </motion.div>

        {/* Search form */}
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8">
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. A1B2C3D4 or full UUID"
            className="font-mono"
          />
          <button type="submit" disabled={loading || !query.trim()}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors flex-shrink-0">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </motion.form>

        {/* Result */}
        {booking && status && StatusIcon && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Status card */}
            <div className="bg-card border border-border/50 rounded-xl p-6">
              <div className="flex items-start gap-4 pb-5 border-b border-border/50 mb-5">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${status.badgeClass} border`}>
                  <StatusIcon className={`w-6 h-6 ${status.iconClass}`} />
                </div>
                <div>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full border font-medium mb-1 ${status.badgeClass}`}>
                    {status.label}
                  </span>
                  <p className="text-sm text-muted-foreground">{status.description}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium">{booking.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-medium">{format(parseISO(booking.date), 'EEEE, MMMM d, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Time Slot</p>
                    <p className="font-medium">{SLOT_LABELS[booking.time_slot] || booking.time_slot}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-border/50 flex justify-between text-xs text-muted-foreground">
                  <span>Ref: <span className="font-mono">{booking.id.slice(0, 8).toUpperCase()}</span></span>
                  <span>Submitted {format(parseISO(booking.created_at), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>

            <button onClick={() => lookup(booking.id)}
              className="w-full inline-flex items-center justify-center gap-2 border border-border/50 py-2.5 rounded text-sm hover:border-primary/40 hover:text-primary transition-colors">
              <RefreshCw className="w-4 h-4" /> Refresh Status
            </button>
          </motion.div>
        )}

        {searched && !loading && !booking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No booking found with that ID.</p>
            <p className="text-xs mt-1">Check the reference from your confirmation email.</p>
          </motion.div>
        )}

        {!searched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-center py-8 text-muted-foreground text-sm">
            <p>Your booking reference was sent to your email after submission.</p>
            <p className="text-xs mt-1 opacity-60">It looks like <span className="font-mono">A1B2C3D4</span> (first 8 characters of the full ID).</p>
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
