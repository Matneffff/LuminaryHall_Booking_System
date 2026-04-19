import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabase() {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _client
}

// Convenience proxy — only initialises on first property access
export const supabase = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export type BookingStatus = 'pending' | 'approved' | 'rejected'

export interface Booking {
  id: string
  name: string
  email: string
  phone: string
  event_type: string
  guest_count: number
  date: string
  time_slot: string
  notes: string | null
  status: BookingStatus
  created_at: string
}
