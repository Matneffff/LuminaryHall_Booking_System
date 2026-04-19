'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Loader2, Lock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '' })

  const validate = () => {
    const e = { email: '', password: '' }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Valid email required'
    if (!password || password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return !e.email && !e.password
  }

  const login = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) {
      toast.error('Invalid credentials. Please try again.')
    } else {
      toast.success('Welcome back!')
      router.push('/admin/dashboard')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-background">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <p className="text-muted-foreground text-sm mt-1">Luminary Hall Management System</p>
        </div>

        <form onSubmit={login} className="bg-card border border-border/50 rounded-xl p-8 space-y-5">
          <div>
            <Label htmlFor="email" className="mb-2 block">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@luminaryhall.my"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
              className={errors.email ? 'border-destructive' : ''}
              autoComplete="email"
            />
            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="password" className="mb-2 block">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
              className={errors.password ? 'border-destructive' : ''}
              autoComplete="current-password"
            />
            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded font-medium hover:bg-primary/90 disabled:opacity-70 transition-colors"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Luminary Hall Admin · Restricted Access
        </p>
      </motion.div>
    </main>
  )
}
