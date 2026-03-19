import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/funcionarios" element={<Funcionarios />} />
          <Route path="/ferias" element={<Ferias />} />
          <Route path="/folha" element={<FolhaPagamento />} />
          <Route path="/avaliacoes" element={<Avaliacoes />} />
          <Route path="/ponto" element={<Ponto />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
