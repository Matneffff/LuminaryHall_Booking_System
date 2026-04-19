import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const SLOT_LABELS: Record<string, string> = {
  morning: 'Daylight — 8:00 AM to 1:00 PM',
  afternoon: 'Twilight — 2:00 PM to 7:00 PM',
  evening: 'Luminary Night — 7:00 PM to 12:00 AM',
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-MY', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function baseTemplate(content: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e5e5e5;">
  <div style="max-width:560px;margin:40px auto;padding:0 16px;">
    <div style="text-align:center;margin-bottom:32px;">
      <p style="color:#d4af37;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 4px;">LUMINARY HALL</p>
      <p style="color:#737373;font-size:12px;margin:0;">Level 5, The Pinnacle Tower, KLCC · Kuala Lumpur</p>
    </div>
    <div style="background:#141414;border:1px solid #262626;border-radius:12px;padding:32px;">
      ${content}
    </div>
    <p style="text-align:center;color:#525252;font-size:11px;margin-top:24px;">
      © 2026 Luminary Hall Sdn. Bhd. · hello@luminaryhall.my · +603 2345 6789
    </p>
  </div>
</body>
</html>`
}

function bookingSubmittedEmail(name: string, date: string, slot: string, bookingId: string) {
  const shortId = bookingId.slice(0, 8).toUpperCase()
  return baseTemplate(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="width:56px;height:56px;border-radius:50%;background:rgba(212,175,55,0.15);border:1px solid rgba(212,175,55,0.4);display:inline-block;text-align:center;line-height:56px;margin-bottom:16px;">
        <span style="font-size:22px;color:#d4af37;font-weight:700;">✓</span>
      </div>
      <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0 0 8px;">Booking Request Received</h1>
      <p style="color:#a3a3a3;margin:0;font-size:14px;">Hi ${name}, we've received your request!</p>
    </div>
    <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="color:#737373;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">Booking Details</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#737373;font-size:13px;padding:6px 0;">Reference</td><td style="color:#d4af37;font-family:monospace;font-weight:700;text-align:right;">#${shortId}</td></tr>
        <tr><td style="color:#737373;font-size:13px;padding:6px 0;border-top:1px solid #262626;">Date</td><td style="color:#e5e5e5;font-size:13px;text-align:right;">${formatDate(date)}</td></tr>
        <tr><td style="color:#737373;font-size:13px;padding:6px 0;border-top:1px solid #262626;">Time Slot</td><td style="color:#e5e5e5;font-size:13px;text-align:right;">${SLOT_LABELS[slot] || slot}</td></tr>
      </table>
    </div>
    <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="color:#737373;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">What happens next?</p>
      <ol style="margin:0;padding-left:18px;color:#a3a3a3;font-size:13px;line-height:1.8;">
        <li>Our team reviews your request <strong style="color:#e5e5e5;">(within 24 hours)</strong></li>
        <li>You'll receive an approval or update via email</li>
        <li>A 50% deposit secures your booking upon approval</li>
        <li>We'll contact you to discuss event details</li>
      </ol>
    </div>
    <p style="color:#525252;font-size:12px;text-align:center;margin:0;">
      Questions? Reply to this email or call us at +603 2345 6789
    </p>
  `)
}

function bookingApprovedEmail(name: string, date: string, slot: string, bookingId: string) {
  const shortId = bookingId.slice(0, 8).toUpperCase()
  return baseTemplate(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="width:56px;height:56px;border-radius:50%;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.4);display:inline-block;text-align:center;line-height:56px;margin-bottom:16px;">
        <span style="font-size:24px;">🎉</span>
      </div>
      <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0 0 8px;">Booking Approved!</h1>
      <p style="color:#a3a3a3;margin:0;font-size:14px;">Congratulations ${name}, your booking has been confirmed.</p>
    </div>
    <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="color:#737373;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">Confirmed Booking</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#737373;font-size:13px;padding:6px 0;">Reference</td><td style="color:#d4af37;font-family:monospace;font-weight:700;text-align:right;">#${shortId}</td></tr>
        <tr><td style="color:#737373;font-size:13px;padding:6px 0;border-top:1px solid #262626;">Date</td><td style="color:#e5e5e5;font-size:13px;text-align:right;">${formatDate(date)}</td></tr>
        <tr><td style="color:#737373;font-size:13px;padding:6px 0;border-top:1px solid #262626;">Time Slot</td><td style="color:#e5e5e5;font-size:13px;text-align:right;">${SLOT_LABELS[slot] || slot}</td></tr>
        <tr><td style="color:#737373;font-size:13px;padding:6px 0;border-top:1px solid #262626;">Status</td><td style="text-align:right;"><span style="background:rgba(34,197,94,0.1);color:#4ade80;border:1px solid rgba(34,197,94,0.2);border-radius:20px;padding:2px 10px;font-size:12px;font-weight:600;">Approved</span></td></tr>
      </table>
    </div>
    <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="color:#737373;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">Next Steps</p>
      <ol style="margin:0;padding-left:18px;color:#a3a3a3;font-size:13px;line-height:1.8;">
        <li>Our team will contact you within 24 hours with payment details</li>
        <li>A <strong style="color:#e5e5e5;">50% deposit</strong> is required to fully secure your date</li>
        <li>Remaining balance due 7 days before the event</li>
      </ol>
    </div>
    <p style="color:#525252;font-size:12px;text-align:center;margin:0;">
      Questions? Reply to this email or call us at +603 2345 6789
    </p>
  `)
}

function bookingRejectedEmail(name: string, date: string, slot: string) {
  return baseTemplate(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="width:56px;height:56px;border-radius:50%;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.4);display:inline-block;text-align:center;line-height:56px;margin-bottom:16px;">
        <span style="font-size:24px;">📋</span>
      </div>
      <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0 0 8px;">Booking Update</h1>
      <p style="color:#a3a3a3;margin:0;font-size:14px;">Hi ${name}, we have an update on your request.</p>
    </div>
    <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="color:#a3a3a3;font-size:14px;line-height:1.7;margin:0 0 12px;">
        Unfortunately, we're unable to accommodate your booking request for <strong style="color:#e5e5e5;">${formatDate(date)}</strong> (${SLOT_LABELS[slot] || slot}) at this time.
      </p>
      <p style="color:#a3a3a3;font-size:14px;line-height:1.7;margin:0;">
        This may be due to scheduling conflicts or capacity constraints. We sincerely apologise for any inconvenience.
      </p>
    </div>
    <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="color:#737373;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">What you can do</p>
      <ul style="margin:0;padding-left:18px;color:#a3a3a3;font-size:13px;line-height:1.8;">
        <li>Submit a new request for a different date or time slot</li>
        <li>Contact us directly to discuss alternatives</li>
      </ul>
    </div>
    <div style="text-align:center;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://luminary-hall.vercel.app'}/book" style="display:inline-block;background:#d4af37;color:#000;padding:12px 28px;border-radius:6px;font-weight:600;font-size:14px;text-decoration:none;">Book a New Date</a>
    </div>
    <p style="color:#525252;font-size:12px;text-align:center;margin-top:24px;">
      Questions? Reply to this email or call us at +603 2345 6789
    </p>
  `)
}

export async function POST(req: NextRequest) {
  try {
    const { type, to, name, date, slot, bookingId } = await req.json()

    if (!type || !to || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let subject = ''
    let html = ''

    if (type === 'booking_submitted') {
      subject = `Booking Request Received — #${bookingId?.slice(0, 8).toUpperCase()}`
      html = bookingSubmittedEmail(name, date, slot, bookingId)
    } else if (type === 'booking_approved') {
      subject = `Your Booking is Confirmed! 🎉 — Luminary Hall`
      html = bookingApprovedEmail(name, date, slot, bookingId)
    } else if (type === 'booking_rejected') {
      subject = `Update on Your Booking Request — Luminary Hall`
      html = bookingRejectedEmail(name, date, slot)
    } else {
      return NextResponse.json({ error: 'Invalid email type' }, { status: 400 })
    }

    const { error } = await resend.emails.send({
      from: 'Luminary Hall <onboarding@resend.dev>',
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Send email error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
