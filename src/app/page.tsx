'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Users, Calendar, Award } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }

const features = [
  { icon: Users, title: 'Up to 500 Guests', desc: 'Spacious halls to accommodate any event size, from intimate gatherings to grand galas.' },
  { icon: Calendar, title: 'Flexible Booking', desc: 'Choose your date and time slot with our real-time availability system.' },
  { icon: Star, title: 'Premium Amenities', desc: 'State-of-the-art AV, catering kitchen, bridal suite, and valet parking included.' },
  { icon: Award, title: 'Award-Winning Venue', desc: 'Recognized as Best Event Venue 2024 by Malaysia Event Industry Awards.' },
]

const events = [
  { label: 'Weddings', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80' },
  { label: 'Corporate', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80' },
  { label: 'Galas', img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80' },
]

export default function HomePage() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        <motion.div
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.15 } } }}
        >
          <motion.p variants={fadeUp} className="text-primary text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            Premium Event Venue · Kuala Lumpur
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Where Every <span className="text-primary">Moment</span> Becomes a Memory
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Luminary Hall offers an unparalleled setting for weddings, corporate events, and private celebrations. Timeless elegance, flawless service.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded font-semibold hover:bg-primary/90 transition-all hover:gap-3">
              Reserve Your Date <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/venue" className="inline-flex items-center gap-2 border border-border px-8 py-4 rounded font-semibold hover:border-primary/60 hover:text-primary transition-all">
              Explore the Venue
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border/50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[['500+', 'Guests Capacity'], ['1,200+', 'Events Hosted'], ['15+', 'Years of Excellence'], ['4.9★', 'Average Rating']].map(([num, label]) => (
            <div key={label}>
              <div className="text-3xl font-bold text-primary mb-1">{num}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Why Choose Us</p>
            <h2 className="text-4xl font-bold">An Experience Beyond the Ordinary</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} className="p-6 rounded-lg border border-border/50 bg-card hover:border-primary/40 transition-colors"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <f.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Events We Host</p>
            <h2 className="text-4xl font-bold">Perfect for Every Occasion</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((e, i) => (
              <motion.div key={e.label} className="relative overflow-hidden rounded-lg aspect-[4/3] group cursor-pointer"
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.img} alt={e.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-xl font-bold">{e.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center">
        <motion.div className="max-w-2xl mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold mb-6">Ready to Create Something Unforgettable?</h2>
          <p className="text-muted-foreground mb-10 text-lg">Submit your booking request today and our team will confirm availability within 24 hours.</p>
          <Link href="/book" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded font-semibold text-lg hover:bg-primary/90 transition-all hover:gap-3">
            Book Luminary Hall <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 px-6 text-center text-sm text-muted-foreground">
        <p className="text-primary font-bold text-lg mb-2">LUMINARY HALL</p>
        <p>Level 5, The Pinnacle Tower, KLCC, Kuala Lumpur · hello@luminaryhall.my · +603 2345 6789</p>
        <p className="mt-4 text-xs">© 2026 Luminary Hall Sdn. Bhd. All rights reserved.</p>
      </footer>
    </main>
  )
}
