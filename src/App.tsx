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
import Login from './pages/Login'
import { AuthProvider, useAuth } from './hooks/use-auth'

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
              <Route path="/ferias" element={<Ferias />} />
              <Route path="/folha-pagamento" element={<FolhaPagamento />} />
              <Route path="/avaliacoes" element={<Avaliacoes />} />
              <Route path="/ponto" element={<Ponto />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
