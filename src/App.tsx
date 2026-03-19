import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import NotFound from './pages/NotFound'

import Index from './pages/Index'
import Funcionarios from './pages/Funcionarios'
import Ferias from './pages/Ferias'
import FolhaPagamento from './pages/Folha'
import Avaliacoes from './pages/Avaliacoes'
import Ponto from './pages/Ponto'
import Relatorios from './pages/Relatorios'
import Cargos from './pages/Cargos'
import Configuracoes from './pages/Configuracoes'
import Login from './pages/Login'
import Recrutamento from './pages/Recrutamento'
import { AuthProvider, useAuth } from './hooks/use-auth'
import { ThemeProvider } from './components/theme-provider'

const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Carregando...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

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
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/funcionarios" element={<Funcionarios />} />
                <Route path="/recrutamento" element={<Recrutamento />} />
                <Route path="/ferias" element={<Ferias />} />
                <Route path="/folha-pagamento" element={<FolhaPagamento />} />
                <Route path="/avaliacoes" element={<Avaliacoes />} />
                <Route path="/ponto" element={<Ponto />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/cargos" element={<Cargos />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
)

export default App
