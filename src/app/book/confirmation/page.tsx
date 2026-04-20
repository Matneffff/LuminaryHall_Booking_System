'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Calendar, Clock, ArrowRight, Copy, Users, Tag, Mail, Phone } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { Suspense, useEffect, useState } from 'react'
import { supabase, type Booking } from '@/lib/supabase'

const SLOT_LABELS: Record<string, string> = {
  morning: 'Daylight — 8:00 AM to 1:00 PM',
  afternoon: 'Twilight — 2:00 PM to 7:00 PM',
  evening: 'Luminary Night — 8:00 PM to 12:00 AM',
}

const SLOT_PRICES: Record<string, string> = {
  morning: 'RM 4,500',
  afternoon: 'RM 5,500',
  evening: 'RM 7,500',
}

function ConfirmationContent() {
  const params = useSearchParams()
  const id = params.get('id') || ''
  const fallbackName = params.get('name') || ''

  const [booking, setBooking] = useState<Booking | null>(null)

  useEffect(() => {
    if (!id) return
    supabase.from('bookings').select('*').eq('id', id).single()
      .then(({ data }) => { if (data) setBooking(data as Booking) })
  }, [id])

  const shortId = id.slice(0, 8).toUpperCase()
  const displayName = booking?.name || fallbackName
  const firstName = displayName.split(' ')[0]

  const copy = () => {
    navigator.clipboard.writeText(shortId)
    toast.success('Booking ID copied!')
  }

  return (
    <main className="pt-24 pb-20 px-6 min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-2">Request Received</p>
          <h1 className="text-4xl font-bold mb-4">You&apos;re All Set{firstName ? `, ${firstName}` : ''}!</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Your booking request has been submitted successfully. Our team will review and confirm within 24 hours via email.
          </p>
        </motion.div>

        {/* Booking record */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card border border-border/50 rounded-xl p-6 mb-6 text-left space-y-4">

          {/* Reference */}
          <div className="flex items-center justify-between pb-4 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Booking Reference</span>
            <button onClick={copy} className="flex items-center gap-2 text-primary font-mono font-bold hover:text-primary/80 transition-colors">
              #{shortId} <Copy className="w-3 h-3" />
            </button>
          </div>

          {/* All booking fields */}
          <div className="grid grid-cols-1 gap-3 text-sm">
            {booking?.name && (
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="flex-1 flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{booking.name}</span>
                </div>
              </div>
            )}
            {booking?.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="flex-1 flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{booking.email}</span>
                </div>
              </div>
            )}
            {booking?.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="flex-1 flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{booking.phone}</span>
                </div>
              </div>
            )}
            {booking?.event_type && (
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="flex-1 flex justify-between">
                  <span className="text-muted-foreground">Event</span>
                  <span className="font-medium">{booking.event_type}</span>
                </div>
              </div>
            )}
            {booking?.guest_count && (
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="flex-1 flex justify-between">
                  <span className="text-muted-foreground">Guests</span>
                  <span className="font-medium">{booking.guest_count} pax</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="flex-1 flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">
                  {booking?.date ? format(parseISO(booking.date), 'EEEE, d MMM yyyy') : '—'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="flex-1 flex justify-between">
                <span className="text-muted-foreground">Slot</span>
                <span className="font-medium">{booking ? (SLOT_LABELS[booking.time_slot] || booking.time_slot) : '—'}</span>
              </div>
            </div>
            {booking?.time_slot && (
              <div className="flex justify-between pt-3 border-t border-border/50">
                <span className="text-muted-foreground font-medium">Estimated Total</span>
                <span className="text-primary font-bold">{SLOT_PRICES[booking.time_slot] || '—'}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Check status prompt */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6 text-left text-sm">
          <p className="font-medium text-primary mb-1">Save your booking reference</p>
          <p className="text-muted-foreground text-xs">Use <span className="font-mono font-bold">#{shortId}</span> or your email to check status anytime at <Link href="/book/status" className="underline hover:text-primary">theluminaryhall.vercel.app/book/status</Link></p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-muted/30 rounded-lg p-5 mb-8 text-left">
          <p className="text-sm font-medium mb-3">What happens next?</p>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-primary font-bold">1.</span> Our team reviews your request (within 24 hours)</li>
            <li className="flex gap-2"><span className="text-primary font-bold">2.</span> You&apos;ll receive a confirmation email with payment details</li>
            <li className="flex gap-2"><span className="text-primary font-bold">3.</span> A 50% deposit secures your booking</li>
            <li className="flex gap-2"><span className="text-primary font-bold">4.</span> We&apos;ll be in touch to discuss event details</li>
          </ol>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 border border-border px-6 py-3 rounded text-sm hover:border-primary/60 hover:text-primary transition-colors">
            Back to Home
          </Link>
          <Link href={`/book/status?id=${id}`} className="inline-flex items-center justify-center gap-2 border border-primary/40 text-primary px-6 py-3 rounded text-sm font-medium hover:bg-primary/10 transition-colors">
            Check Status
          </Link>
          <Link href="/venue" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded text-sm font-medium hover:bg-primary/90 transition-colors">
            Explore the Venue <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  )
}
