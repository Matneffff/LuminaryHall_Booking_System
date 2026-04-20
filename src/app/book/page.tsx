'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { format, isBefore, startOfToday, addMonths } from 'date-fns'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { ChevronRight, ChevronLeft, Loader2, Calendar, User, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'

const TIME_SLOTS = [
  { id: 'morning', label: 'Daylight', time: '8:00 AM – 1:00 PM', price: 'RM 4,500' },
  { id: 'afternoon', label: 'Twilight', time: '2:00 PM – 7:00 PM', price: 'RM 5,500' },
  { id: 'evening', label: 'Luminary Night', time: '7:00 PM – 12:00 AM', price: 'RM 7,500' },
]

const EVENT_TYPES = ['Wedding', 'Corporate Event', 'Gala / Dinner', 'Birthday Celebration', 'Product Launch', 'Anniversary', 'Other']

const STEPS = [
  { label: 'Event Details', icon: FileText },
  { label: 'Date & Time', icon: Calendar },
  { label: 'Contact Info', icon: User },
]

interface FormData {
  event_type: string
  guest_count: string
  notes: string
  date: Date | undefined
  time_slot: string
  name: string
  email: string
  phone: string
}

export default function BookingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>({})
  const [loadingSlots, setLoadingSlots] = useState(false)

  const [form, setForm] = useState<FormData>({
    event_type: '',
    guest_count: '',
    notes: '',
    date: undefined,
    time_slot: '',
    name: '',
    email: '',
    phone: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  // Load booked slots for selected month
  useEffect(() => {
    const fetchBookedSlots = async () => {
      setLoadingSlots(true)
      const { data } = await supabase
        .from('bookings')
        .select('date, time_slot')
        .in('status', ['pending', 'approved'])
      if (data) {
        const map: Record<string, string[]> = {}
        data.forEach(({ date, time_slot }) => {
          if (!map[date]) map[date] = []
          map[date].push(time_slot)
        })
        setBookedSlots(map)
      }
      setLoadingSlots(false)
    }
    fetchBookedSlots()
  }, [])

  const isSlotBooked = (slot: string) => {
    if (!form.date) return false
    const dateKey = format(form.date, 'yyyy-MM-dd')
    return bookedSlots[dateKey]?.includes(slot) ?? false
  }

  const isFullyBooked = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return bookedSlots[dateKey]?.length === TIME_SLOTS.length
  }

  const set = (key: keyof FormData, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const validateStep = () => {
    const errs: Partial<Record<keyof FormData, string>> = {}
    if (step === 0) {
      if (!form.event_type) errs.event_type = 'Please select an event type'
      if (!form.guest_count || Number(form.guest_count) < 1) errs.guest_count = 'Please enter expected guest count'
      if (Number(form.guest_count) > 500) errs.guest_count = 'Maximum capacity is 500 guests'
    }
    if (step === 1) {
      if (!form.date) errs.date = 'Please select a date'
      if (!form.time_slot) errs.time_slot = 'Please select a time slot'
    }
    if (step === 2) {
      if (!form.name.trim()) errs.name = 'Name is required'
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email is required'
      if (!form.phone.trim() || !/^[0-9+\s-]{8,}$/.test(form.phone)) errs.phone = 'Valid phone number is required'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const next = () => { if (validateStep()) setStep(s => s + 1) }
  const back = () => setStep(s => s - 1)

  const submit = async () => {
    if (!validateStep()) return
    setSubmitting(true)
    try {
      const { data, error } = await supabase.from('bookings').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        event_type: form.event_type,
        guest_count: Number(form.guest_count),
        date: format(form.date!, 'yyyy-MM-dd'),
        time_slot: form.time_slot,
        notes: form.notes.trim() || null,
        status: 'pending',
      }).select('id').single()

      if (error) throw error
      toast.success('Booking request submitted!')

      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking_submitted',
          to: form.email.trim(),
          name: form.name.trim(),
          date: format(form.date!, 'yyyy-MM-dd'),
          slot: form.time_slot,
          bookingId: data.id,
        }),
      }).catch(() => {})

      router.push(`/book/confirmation?id=${data.id}&name=${encodeURIComponent(form.name)}&date=${format(form.date!, 'yyyy-MM-dd')}&slot=${form.time_slot}`)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-2">Booking Request</p>
          <h1 className="text-4xl font-bold">Reserve Your Date</h1>
        </motion.div>

        {/* Progress */}
        <div className="mb-10">
          <Progress value={((step + 1) / STEPS.length) * 100} className="h-1 mb-4" />
          <div className="flex justify-between">
            {STEPS.map((s, i) => (
              <div key={s.label} className={`flex items-center gap-2 text-sm ${i <= step ? 'text-primary' : 'text-muted-foreground'}`}>
                <s.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-card border border-border/50 rounded-xl p-8">
          <AnimatePresence mode="wait">

            {/* Step 0: Event Details */}
            {step === 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-6">Tell us about your event</h2>
                <div>
                  <Label className="mb-2 block">Event Type *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {EVENT_TYPES.map(type => (
                      <button key={type} type="button"
                        onClick={() => set('event_type', type)}
                        className={`px-3 py-2 rounded-lg text-sm text-left border transition-colors ${form.event_type === type ? 'border-primary bg-primary/10 text-primary' : 'border-border/50 hover:border-primary/40'}`}>
                        {type}
                      </button>
                    ))}
                  </div>
                  {errors.event_type && <p className="text-destructive text-xs mt-1">{errors.event_type}</p>}
                </div>
                <div>
                  <Label htmlFor="guest_count" className="mb-2 block">Expected Guest Count *</Label>
                  <Input id="guest_count" type="number" min={1} max={500} placeholder="e.g. 200"
                    value={form.guest_count} onChange={e => set('guest_count', e.target.value)} className={errors.guest_count ? 'border-destructive' : ''} />
                  {errors.guest_count ? <p className="text-destructive text-xs mt-1">{errors.guest_count}</p> : <p className="text-muted-foreground text-xs mt-1">Maximum capacity: 500 guests</p>}
                </div>
                <div>
                  <Label htmlFor="notes" className="mb-2 block">Special Requirements (optional)</Label>
                  <Textarea id="notes" placeholder="Halal catering, extra AV setup, specific decor requests..."
                    value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} />
                </div>
              </div>
            )}

            {/* Step 1: Date & Time */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Select date and time slot</h2>
                {loadingSlots && <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading availability...</div>}

                <div className="flex justify-center">
                  <DayPicker
                    mode="single"
                    selected={form.date}
                    onSelect={d => { set('date', d); set('time_slot', '') }}
                    disabled={[
                      { before: startOfToday() },
                      { after: addMonths(startOfToday(), 12) },
                      (date) => isFullyBooked(date),
                    ]}
                    modifiers={{ fullyBooked: (date) => isFullyBooked(date) }}
                    modifiersClassNames={{ fullyBooked: 'line-through opacity-40', selected: 'bg-primary text-primary-foreground rounded' }}
                    className="text-sm"
                  />
                </div>
                {errors.date && <p className="text-destructive text-xs">{errors.date}</p>}

                {form.date && (
                  <div>
                    <p className="text-sm font-medium mb-3">Available slots for <span className="text-primary">{format(form.date, 'MMMM d, yyyy')}</span></p>
                    <div className="space-y-2">
                      {TIME_SLOTS.map(slot => {
                        const booked = isSlotBooked(slot.id)
                        const selected = form.time_slot === slot.id
                        return (
                          <button key={slot.id} type="button" disabled={booked}
                            onClick={() => set('time_slot', slot.id)}
                            className={`w-full flex items-center justify-between p-4 rounded-lg border text-left transition-colors ${booked ? 'border-border/30 opacity-40 cursor-not-allowed' : selected ? 'border-primary bg-primary/10' : 'border-border/50 hover:border-primary/40'}`}>
                            <div>
                              <p className="font-medium text-sm">{slot.label}</p>
                              <p className="text-muted-foreground text-xs">{slot.time}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-semibold ${selected ? 'text-primary' : 'text-foreground'}`}>{slot.price}</span>
                              {booked && <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Booked</span>}
                              {!booked && selected && <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">Selected</span>}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    {errors.time_slot && <p className="text-destructive text-xs mt-1">{errors.time_slot}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Contact Info */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold">Your contact details</h2>
                <div>
                  <Label htmlFor="name" className="mb-2 block">Full Name *</Label>
                  <Input id="name" placeholder="Ahmad Razif bin Abdullah" value={form.name} onChange={e => set('name', e.target.value)} className={errors.name ? 'border-destructive' : ''} />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="email" className="mb-2 block">Email Address *</Label>
                  <Input id="email" type="email" placeholder="ahmad@example.com" value={form.email} onChange={e => set('email', e.target.value)} className={errors.email ? 'border-destructive' : ''} />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone" className="mb-2 block">Phone Number *</Label>
                  <Input id="phone" type="tel" placeholder="+60 12-345 6789" value={form.phone} onChange={e => set('phone', e.target.value)} className={errors.phone ? 'border-destructive' : ''} />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Booking Summary */}
                <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border/50 text-sm space-y-2">
                  <p className="font-medium text-primary mb-3">Booking Summary</p>
                  <div className="flex justify-between"><span className="text-muted-foreground">Event</span><span>{form.event_type}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span>{form.guest_count}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{form.date ? format(form.date, 'MMMM d, yyyy') : '-'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Slot</span><span>{TIME_SLOTS.find(s => s.id === form.time_slot)?.time || '-'}</span></div>
                  <div className="flex justify-between pt-2 border-t border-border/50"><span className="text-muted-foreground font-medium">Estimated Total</span><span className="text-primary font-bold">{TIME_SLOTS.find(s => s.id === form.time_slot)?.price || '-'}</span></div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button onClick={back} disabled={step === 0}
            className="inline-flex items-center gap-2 px-6 py-3 rounded border border-border/50 text-sm hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={next} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded text-sm font-medium hover:bg-primary/90 transition-colors">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={submit} disabled={submitting}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded text-sm font-medium hover:bg-primary/90 disabled:opacity-70 transition-colors">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <>Submit Request <ChevronRight className="w-4 h-4" /></>}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
