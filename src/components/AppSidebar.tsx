import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, CalendarDays, Wallet, Star, Clock, Building2 } from 'lucide-react'
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
  { title: 'Folha de Pagamento', url: '/folha', icon: Wallet },
  { title: 'Avaliações', url: '/avaliacoes', icon: Star },
  { title: 'Controle de Ponto', url: '/ponto', icon: Clock },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2">
          <div className="bg-primary-foreground text-primary p-1.5 rounded-md">
            <Building2 className="size-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-sidebar-primary-foreground">
            Lucenera
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
                        <span>{item.title}</span>
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
