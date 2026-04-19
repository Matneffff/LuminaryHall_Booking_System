'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase, type Booking, type BookingStatus } from '@/lib/supabase'
import { toast } from 'sonner'
import { format, parseISO, isThisWeek } from 'date-fns'
import { LogOut, Check, X, Clock, Users, CalendarDays, TrendingUp, Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const STATUS_CONFIG: Record<BookingStatus, { label: string; class: string }> = {
  pending: { label: 'Pending', class: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  approved: { label: 'Approved', class: 'bg-green-500/10 text-green-400 border-green-500/20' },
  rejected: { label: 'Rejected', class: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

const SLOT_LABELS: Record<string, string> = {
  morning: 'Daylight (8AM–1PM)',
  afternoon: 'Twilight (2PM–7PM)',
  evening: 'Night (7PM–12AM)',
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all')

  const checkAuth = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.replace('/admin/login')
  }, [router])

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) { toast.error('Failed to load bookings'); }
    else { setBookings(data as Booking[]) }
    setLoading(false)
  }, [])

  useEffect(() => {
    checkAuth()
    fetchBookings()
  }, [checkAuth, fetchBookings])

  const updateStatus = async (id: string, status: BookingStatus) => {
    setUpdating(id)
    const prev = bookings
    setBookings(b => b.map(x => x.id === id ? { ...x, status } : x))
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id)
    if (error) {
      toast.error('Update failed')
      setBookings(prev)
    } else {
      toast.success(`Booking ${status}`)
      const booking = bookings.find(b => b.id === id)
      if (booking && (status === 'approved' || status === 'rejected')) {
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: `booking_${status}`,
            to: booking.email,
            name: booking.name,
            date: booking.date,
            slot: booking.time_slot,
            bookingId: booking.id,
          }),
        }).catch(() => {})
      }
    }
    setUpdating(null)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const filtered = bookings.filter(b => {
    const matchFilter = filter === 'all' || b.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q || b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) || b.event_type.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved').length,
    thisWeek: bookings.filter(b => isThisWeek(parseISO(b.date))).length,
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="border-b border-border/50 bg-card/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-primary font-bold">LUMINARY HALL</span>
            <span className="text-muted-foreground text-sm">/ Admin</span>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-1">Bookings Dashboard</h1>
          <p className="text-muted-foreground text-sm mb-8">Manage and review all booking requests</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: stats.total, icon: Users, color: 'text-foreground' },
            { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-yellow-400' },
            { label: 'Approved', value: stats.approved, icon: Check, color: 'text-green-400' },
            { label: 'Events This Week', value: stats.thisWeek, icon: TrendingUp, color: 'text-primary' },
          ].map((s, i) => (
            <motion.div key={s.label} className="bg-card border border-border/50 rounded-lg p-5"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <span className={`text-3xl font-bold ${s.color}`}>{s.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name, email, event type..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded text-sm capitalize transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'border border-border/50 hover:border-primary/40'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading bookings...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>{search || filter !== 'all' ? 'No bookings match your filters' : 'No bookings yet'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    {['Guest', 'Event', 'Date & Slot', 'Guests', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <motion.tr key={b.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                      <td className="px-4 py-4">
                        <p className="font-medium">{b.name}</p>
                        <p className="text-muted-foreground text-xs">{b.email}</p>
                        <p className="text-muted-foreground text-xs">{b.phone}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p>{b.event_type}</p>
                        {b.notes && <p className="text-muted-foreground text-xs mt-1 max-w-[160px] truncate">{b.notes}</p>}
                      </td>
                      <td className="px-4 py-4">
                        <p>{format(parseISO(b.date), 'dd MMM yyyy')}</p>
                        <p className="text-muted-foreground text-xs">{SLOT_LABELS[b.time_slot] || b.time_slot}</p>
                      </td>
                      <td className="px-4 py-4 text-center">{b.guest_count}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_CONFIG[b.status].class}`}>
                          {STATUS_CONFIG[b.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {b.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateStatus(b.id, 'approved')}
                              disabled={updating === b.id}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-xs hover:bg-green-500/20 disabled:opacity-50 transition-colors"
                            >
                              {updating === b.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Approve
                            </button>
                            <button
                              onClick={() => updateStatus(b.id, 'rejected')}
                              disabled={updating === b.id}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-xs hover:bg-red-500/20 disabled:opacity-50 transition-colors"
                            >
                              <X className="w-3 h-3" /> Reject
                            </button>
                          </div>
                        )}
                        {b.status !== 'pending' && (
                          <button
                            onClick={() => updateStatus(b.id, 'pending')}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                          >
                            Reset to pending
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-right">{filtered.length} booking{filtered.length !== 1 ? 's' : ''} shown</p>
      </div>
    </main>
  )
}
