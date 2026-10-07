import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { consumeCodeFromUrl } from '@/lib/cross-system-auth'
import { getUsuarioRoleCached } from '@/lib/usuario-role-cache'

export interface AuthUser extends User {
  app_role?: string
  funcionario_id?: string
}

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  hasAccess: boolean | null
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
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  // SPEC-069: este app só checava estar logado, sem nenhuma permissão
  // granular do Hub. Consulta a mesma RPC que o Hub usa (hub_pode_executar,
  // SPEC-006) para o sistema inteiro ('rh', sem módulo/ação específicos).
  useEffect(() => {
    if (!user?.id) {
      setHasAccess(null)
      return
    }
    supabase
      .rpc('hub_pode_executar', {
        p_usuario_id: user.id,
        p_system_slug: 'rh',
        p_modulo_chave: null,
        p_acao: null,
      })
      .then(({ data }) => setHasAccess(Boolean(data)))
  }, [user?.id])

  useEffect(() => {
    let mounted = true
    let initialized = false

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted || !initialized) return
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

    // SPEC-120: acesso vindo do menu lateral / Central chega com ?sso_code
    // na URL. Mesma guarda de corrida já usada em cadastro-lucenera/use-auth.tsx
    // — sem o `initialized`, o evento inicial de onAuthStateChange (sessão
    // nula, antes da troca do código terminar) resolveria "sem sessão" cedo
    // demais numa aba nova vinda de SSO.
    consumeCodeFromUrl('rh')
      .catch(() => {})
      .finally(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (!mounted) return
          initialized = true
          setSession(session)
          if (!session?.user) {
            setUser(null)
            setLoading(false)
          } else {
            setUser(session.user)
          }
        })
      })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (user && user.id && !user.app_role) {
      let isMounted = true

      const loadData = async () => {
        // SPEC-123: cache compartilhado com useSistemasPermitidos.ts —
        // evita duplicar esta mesma query de rede a cada carregamento.
        const [role, funcRes] = await Promise.all([
          getUsuarioRoleCached(user.id),
          supabase.from('funcionarios').select('id').eq('usuario_id', user.id).maybeSingle(),
        ])

        let funcId = funcRes.data?.id

        // Self-healing mechanism: Se o vínculo falhou por algum motivo (delay de trigger ou legado),
        // força a vinculação do funcionário via RPC para garantir o acesso ao sistema de ponto
        if (!funcId) {
          await supabase.rpc('link_my_funcionario_record')
          const { data: linkedFunc } = await supabase
            .from('funcionarios')
            .select('id')
            .eq('usuario_id', user.id)
            .maybeSingle()
          if (linkedFunc?.id) {
            funcId = linkedFunc.id
          }
        }

        if (isMounted) {
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  app_role: role || 'funcionario',
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
    <AuthContext.Provider
      value={{ user, session, hasAccess, signIn, signOut, resetPassword, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
