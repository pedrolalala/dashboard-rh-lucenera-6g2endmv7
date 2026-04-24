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
  resetPassword: (email: string) => Promise<{ error: any }>
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
        // Keep existing app_role/funcionario_id if it's the same user to avoid flashing
        setUser((prev) =>
          prev?.id === session.user.id
            ? { ...session.user, app_role: prev.app_role, funcionario_id: prev.funcionario_id }
            : session.user,
        )
      }
    })
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (!session?.user) {
        setUser(null)
        setLoading(false)
      } else {
        setUser(session.user)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user && user.id && !user.app_role) {
      let isMounted = true

      const loadData = async () => {
        const [roleRes, funcRes] = await Promise.all([
          supabase.from('usuarios').select('role').eq('id', user.id).single(),
          supabase.from('funcionarios_rh').select('id').eq('user_id', user.id).maybeSingle(),
        ])

        let funcId = funcRes.data?.id

        // Self-healing mechanism: Se o vínculo falhou por algum motivo (delay de trigger ou legado),
        // força a vinculação do funcionário via Edge RPC para garantir o acesso ao sistema de ponto
        if (!funcId) {
          const { data: newFuncId } = await supabase.rpc('link_my_funcionario_record' as any)
          if (newFuncId) {
            funcId = newFuncId
          }
        }

        if (isMounted) {
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  app_role: roleRes.data?.role || 'funcionario',
                  funcionario_id: funcId,
                }
              : null,
          )
          setLoading(false)
        }
      }

      loadData()
      return () => {
        isMounted = false
      }
    }
  }, [user?.id, user?.app_role])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    })
    return { error }
  }

  return (
    <AuthContext.Provider value={{ user, session, signIn, signOut, resetPassword, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
