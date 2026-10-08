import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import { AuthProvider, useAuth } from './hooks/use-auth'
import { ThemeProvider } from './components/theme-provider'
import { Loader2 } from 'lucide-react'
import { ErrorBoundary } from './components/ErrorBoundary'

// Implement code splitting for routes to prevent out-of-memory errors during build
const Index = lazy(() => import('./pages/Index'))
const Funcionarios = lazy(() => import('./pages/Funcionarios'))
const Ferias = lazy(() => import('./pages/Ferias'))
const FolhaPagamento = lazy(() => import('./pages/Folha'))
const Avaliacoes = lazy(() => import('./pages/Avaliacoes'))
const Faltas = lazy(() => import('./pages/Faltas'))
const Relatorios = lazy(() => import('./pages/Relatorios'))
const ValeTransporte = lazy(() => import('./pages/ValeTransporte'))
const Cargos = lazy(() => import('./pages/Cargos'))
const Comissao = lazy(() => import('./pages/Comissao'))
const Configuracoes = lazy(() => import('./pages/Configuracoes'))
const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))

const ProtectedRoute = () => {
  const { user, hasAccess, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (hasAccess === false) {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center space-y-3">
          <h1 className="text-lg font-semibold">Acesso negado</h1>
          <p className="text-sm text-muted-foreground">
            Sua conta não tem permissão para acessar o RH. Fale com um administrador se acredita que
            isso é um engano.
          </p>
        </div>
      </div>
    )
  }

  return <Outlet />
}

const AdminGerenteRoute = () => {
  const { user } = useAuth()
  if (user?.app_role === 'funcionario') {
    return <Navigate to="/faltas" replace />
  }
  return <Outlet />
}

const IndexRoute = () => {
  const { user } = useAuth()
  if (user?.app_role === 'funcionario') {
    return <Navigate to="/faltas" replace />
  }
  return <Index />
}

const LoadingFallback = () => (
  <div className="h-[50vh] w-full flex items-center justify-center">
    <Loader2 className="animate-spin h-8 w-8 text-primary" />
  </div>
)

const App = () => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange={false}
  >
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                    <Route path="/" element={<IndexRoute />} />
                    <Route path="/funcionarios" element={<Funcionarios />} />
                    <Route path="/ferias" element={<Ferias />} />
                    <Route path="/faltas" element={<Faltas />} />

                    <Route element={<AdminGerenteRoute />}>
                      <Route path="/vale-transporte" element={<ValeTransporte />} />
                      <Route path="/comissao" element={<Comissao />} />
                      <Route path="/folha-pagamento" element={<FolhaPagamento />} />
                      <Route path="/avaliacoes" element={<Avaliacoes />} />
                      <Route path="/relatorios" element={<Relatorios />} />
                      <Route path="/cargos" element={<Cargos />} />
                      <Route path="/configuracoes" element={<Configuracoes />} />
                    </Route>
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </TooltipProvider>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
)

export default App
