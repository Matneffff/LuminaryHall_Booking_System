# ✨ Luminary Hall — Venue Booking System

> A premium venue booking web application built for the **Kracked Devs $500 Bounty Challenge**.

🌐 **Live Demo**: https://theluminaryhall.vercel.app

---

## Overview

Luminary Hall is a full-stack venue booking platform for a premium event space in Kuala Lumpur. Users can browse the venue, check live availability, and submit booking requests — while admins manage everything from a dedicated dashboard with real-time email notifications.

---

## Screenshots

| Landing Page | Booking Form | Admin Dashboard |
|-------------|--------------|-----------------|
| Hero, stats, event gallery | 3-step form with live availability | Approve/reject with email alerts |

---

## Features

### For Users
- **Landing page** — animated hero, stats, features, event type gallery, and CTA
- **Venue details** — 8,000 sq ft specs, amenities, 3 time-slot packages with pricing
- **3-step booking form** — event details → date & time (live availability) → contact info
- **Live availability** — booked slots are greyed out in real-time from the database
- **Booking confirmation** — reference ID, booking summary, next steps
- **Email notification** — instant confirmation email on submission via Resend
- **Mobile responsive** — hamburger nav, fully usable on any screen size

### For Admins
- **Secure login** — Supabase Auth, `/admin` auto-redirects to login
- **Dashboard** — stats cards (total, pending, approved, this week)
- **Booking management** — approve or reject with one click
- **Search & filter** — search by name, email, event type; filter by status
- **Email automation** — approval and rejection emails sent automatically to the guest
- **Optimistic UI** — status updates instantly without waiting for the server

---

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | Next.js 16 (App Router) | Server components, route handlers, fast builds |
| Database | Supabase (PostgreSQL) | Row-level security, real-time, hosted |
| Auth | Supabase Auth | Secure admin login out of the box |
| UI Components | shadcn/ui + Tailwind CSS v4 | Accessible, customizable, dark theme |
| Animations | Framer Motion | Smooth page transitions and stagger effects |
| Email | Resend | Reliable transactional email API |
| Typography | Cormorant Garamond + Inter | Luxury serif headings, clean body text |
| Deployment | Vercel | Zero-config Next.js deployment |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── venue/page.tsx            # Venue details
│   ├── book/
│   │   ├── page.tsx              # 3-step booking form
│   │   └── confirmation/page.tsx # Booking confirmation
│   ├── admin/
│   │   ├── page.tsx              # Redirects to /admin/login
│   │   ├── login/page.tsx        # Admin login
│   │   └── dashboard/page.tsx    # Booking management
│   └── api/
│       └── send-email/route.ts   # Resend email API route
├── components/
│   ├── navbar.tsx                # Responsive navbar with mobile menu
│   └── ui/                       # shadcn/ui components
├── lib/
│   └── supabase.ts               # Supabase client (lazy proxy pattern)
supabase/
└── schema.sql                    # Database schema + RLS policies
```

---

## Email Notifications

Three automated emails are sent via [Resend](https://resend.com):

| Trigger | Recipient | Content |
|---------|-----------|---------|
| Booking submitted | Guest | Reference ID, date, slot, next steps |
| Admin approves | Guest | Confirmed booking, deposit instructions |
| Admin rejects | Guest | Polite update, "Book a New Date" CTA |

---

## Local Setup

**1. Clone and install**
```bash
git clone https://github.com/Matneffff/LuminaryHall_Booking_System
cd hall-venue-booking
npm install
```

**2. Set up environment variables**

Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

**3. Run the database schema**

Go to your Supabase project → **SQL Editor** → paste and run `supabase/schema.sql`

**4. Create an admin user**

Supabase dashboard → **Authentication** → **Users** → **Add user** → enter email + password

**5. Start the dev server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## Database Schema

```sql
bookings (
  id           uuid PRIMARY KEY,
  name         text,
  email        text,
  phone        text,
  event_type   text,
  guest_count  integer,
  date         date,
  time_slot    text,          -- 'morning' | 'afternoon' | 'evening'
  notes        text,
  status       text,          -- 'pending' | 'approved' | 'rejected'
  created_at   timestamptz
)
```

RLS policies: public can insert and read bookings; only authenticated users (admin) can update.

---

## Bounty Requirements Checklist

- [x] Responsive landing page
- [x] Venue details page with key information
- [x] Booking request form
- [x] Date and time slot selection
- [x] Booking confirmation page
- [x] Admin login page
- [x] Admin dashboard to manage bookings
- [x] Booking statuses (pending, approved, rejected)
- [x] Form validation
- [x] Clean and user-friendly experience

**Bonus delivered:** Automated email notifications for all booking status changes.

---

Built with Next.js 16 + Supabase + Resend · Deployed on Vercel
