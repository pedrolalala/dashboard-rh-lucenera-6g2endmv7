import { useLocation } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const routeNames: Record<string, string> = {
  '/': 'Visão Gerencial',
  '/funcionarios': 'Funcionários',
  '/ferias': 'Férias',
  '/folha': 'Folha de Pagamento',
  '/avaliacoes': 'Avaliações de Desempenho',
  '/ponto': 'Controle de Ponto',
}

export function TopHeader() {
  const location = useLocation()
  const pageName = routeNames[location.pathname] || 'Página'

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6 shadow-sm">
      <SidebarTrigger />

      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard RH</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">{pageName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar colaborador..."
            className="w-64 rounded-full bg-muted pl-9 focus-visible:ring-secondary"
          />
        </div>

        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-secondary ring-2 ring-background" />
        </button>

        <div className="flex items-center gap-3 pl-2 border-l">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-semibold text-foreground leading-none">Gestor RH</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
          <Avatar className="size-9 border border-border">
            <AvatarImage
              src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=12"
              alt="Gestor"
            />
            <AvatarFallback>GR</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
