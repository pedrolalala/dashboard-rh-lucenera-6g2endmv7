import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, CalendarDays, Wallet, Star, Clock, FileText } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const navItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Funcionários', url: '/funcionarios', icon: Users },
  { title: 'Férias', url: '/ferias', icon: CalendarDays },
  { title: 'Folha de Pagamento', url: '/folha-pagamento', icon: Wallet },
  { title: 'Avaliações', url: '/avaliacoes', icon: Star },
  { title: 'Controle de Ponto', url: '/controle-ponto', icon: Clock },
  { title: 'Relatórios', url: '/relatorios', icon: FileText },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b border-sidebar-border bg-sidebar">
        <div className="flex flex-col items-start px-2 py-2">
          <span className="font-light text-2xl tracking-[0.25em] text-sidebar-primary-foreground leading-none">
            LUCE
          </span>
          <span className="font-bold text-2xl tracking-[0.25em] text-sidebar-primary-foreground leading-none">
            NERA
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="size-4" />
                        <span className="uppercase text-xs tracking-wider">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
