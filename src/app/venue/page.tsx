'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Wifi, Car, Utensils, Music, Camera, Wind } from 'lucide-react'

const amenities = [
  { icon: Wifi, label: 'High-Speed WiFi' },
  { icon: Car, label: 'Valet Parking (200 cars)' },
  { icon: Utensils, label: 'Catering Kitchen' },
  { icon: Music, label: 'Premium Sound System' },
  { icon: Camera, label: '4K Projectors & LED Walls' },
  { icon: Wind, label: 'Central Air Conditioning' },
]

const packages = [
  {
    name: 'Daylight',
    time: '8:00 AM – 1:00 PM',
    price: 'RM 4,500',
    features: ['5-hour slot', 'Basic AV setup', 'Tables & chairs', 'Security personnel'],
  },
  {
    name: 'Twilight',
    time: '2:00 PM – 7:00 PM',
    price: 'RM 5,500',
    features: ['5-hour slot', 'Full AV setup', 'Tables & chairs', 'Security & ushers', 'Bridal suite access'],
    highlight: true,
  },
  {
    name: 'Luminary Night',
    time: '8:00 PM – 12:00 AM',
    price: 'RM 7,500',
    features: ['5-hour slot', 'Premium AV + LED wall', 'Tables & chairs', 'Full event crew', 'Bridal suite + VIP lounge', 'Complimentary welcome drinks'],
  },
]

const gallery = [
  'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=600&q=80',
  'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&q=80',
  'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80',
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&q=80',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
]

export default function VenuePage() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1920&q=80')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-2">The Venue</p>
            <h1 className="text-5xl font-bold">Luminary Hall</h1>
            <p className="text-muted-foreground mt-2">Level 5, The Pinnacle Tower, KLCC · Capacity: up to 500 guests</p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">About the Space</p>
            <h2 className="text-3xl font-bold mb-6">A Grand Canvas for Your Vision</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Spanning 8,000 sq ft of column-free floor space, Luminary Hall is designed to transform for any occasion. The soaring 6-meter ceilings, warm ambient lighting, and neutral palette provide the perfect canvas.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Whether you envision a grand banquet for 500 or an intimate gathering of 50, our dedicated events team will ensure every detail is perfect.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[['8,000 sq ft', 'Total Floor Area'], ['500', 'Max Capacity (Banquet)'], ['300', 'Theater Style'], ['6m', 'Ceiling Height']].map(([val, lbl]) => (
                <div key={lbl} className="p-4 rounded-lg bg-card border border-border/50">
                  <div className="text-primary font-bold text-xl">{val}</div>
                  <div className="text-muted-foreground">{lbl}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div className="grid grid-cols-2 gap-3" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            {gallery.slice(0, 4).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" className="rounded-lg aspect-square object-cover w-full" />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Included in Every Booking</p>
            <h2 className="text-3xl font-bold">World-Class Amenities</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {amenities.map((a, i) => (
              <motion.div key={a.label} className="flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-card"
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <a.icon className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm">{a.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Pricing</p>
            <h2 className="text-3xl font-bold">Choose Your Time Slot</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <motion.div key={pkg.name}
                className={`p-6 rounded-lg border ${pkg.highlight ? 'border-primary bg-primary/5 relative' : 'border-border/50 bg-card'}`}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                {pkg.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{pkg.time}</p>
                <p className="text-3xl font-bold text-primary mb-6">{pkg.price}</p>
                <ul className="space-y-2 mb-8">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/book" className={`block text-center py-3 rounded font-medium transition-colors ${pkg.highlight ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-border hover:border-primary/60 hover:text-primary'}`}>
                  Book This Slot
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center border-t border-border/50">
        <h2 className="text-3xl font-bold mb-4">Ready to Book?</h2>
        <p className="text-muted-foreground mb-8">Check live availability and submit your booking request in minutes.</p>
        <Link href="/book" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded font-semibold hover:bg-primary/90 transition-all hover:gap-3">
          Check Availability <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </main>
  )
}
