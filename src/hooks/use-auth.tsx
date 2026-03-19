import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

export interface AuthUser extends User {
  app_role?: string
  funcionario_id?: string
}

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (!session?.user) {
        setUser(null)
        setLoading(false)
      } else {
        setUser(session.user)
      }
    })
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (!session?.user) setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user && !user.app_role) {
      Promise.all([
        supabase.from('usuarios').select('role').eq('id', user.id).single(),
        supabase.from('funcionarios_rh').select('id').eq('user_id', user.id).maybeSingle(),
      ]).then(([roleRes, funcRes]) => {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                app_role: roleRes.data?.role || 'funcionario',
                funcionario_id: funcRes.data?.id,
              }
            : null,
        )
        setLoading(false)
      })
    }
  }, [user?.id])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return (
    <AuthContext.Provider value={{ user, session, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
