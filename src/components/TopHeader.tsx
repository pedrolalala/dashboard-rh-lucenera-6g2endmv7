import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, Search, LogOut } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useAuth } from '@/hooks/use-auth'

const routeNames: Record<string, string> = {
  '/': 'Visão Gerencial',
  '/funcionarios': 'Funcionários',
  '/ferias': 'Férias',
  '/folha-pagamento': 'Folha de Pagamento',
  '/avaliacoes': 'Avaliações de Desempenho',
  '/controle-ponto': 'Controle de Ponto',
  '/relatorios': 'Relatórios',
}

export function TopHeader() {
  const location = useLocation()
  const pageName = routeNames[location.pathname] || 'Página'
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background px-6">
      <SidebarTrigger />

      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="uppercase text-[10px] tracking-widest text-muted-foreground hover:text-foreground"
            >
              Dashboard RH
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium uppercase text-[10px] tracking-widest text-foreground">
              {pageName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar colaborador..."
            className="w-64 bg-background pl-9 focus-visible:ring-primary border-border"
          />
        </div>

        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 bg-foreground ring-2 ring-background" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-semibold text-foreground leading-none uppercase tracking-widest">
              {user?.user_metadata?.name || user?.email?.split('@')[0]}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
              {user?.app_role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            title="Sair"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
