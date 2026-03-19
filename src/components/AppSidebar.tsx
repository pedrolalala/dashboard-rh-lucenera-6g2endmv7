import { Link, useLocation } from 'react-router-dom'
import { Users, Calendar, LayoutDashboard, Settings, LogOut, Briefcase, Clock } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/use-auth'
import logoImg from '@/assets/logotipo-vertical_v1_preto-9e726.png'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Controle de Ponto', href: '/controle-ponto', icon: Clock },
  { name: 'Funcionários', href: '/funcionarios', icon: Users },
  { name: 'Férias', href: '/ferias', icon: Calendar },
  { name: 'Cargos', href: '/cargos', icon: Briefcase },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
]

export function AppSidebar() {
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <Sidebar>
      <SidebarHeader className="p-6 flex items-center justify-center border-b border-border/50">
        <Link to="/" className="w-full flex justify-center hover:opacity-80 transition-opacity">
          <img
            src={logoImg}
            alt="Lucenera Logo"
            className="h-12 w-auto object-contain dark:invert"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4 px-4">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                      <Link to={item.href} className="flex items-center gap-3 py-2">
                        <item.icon className="w-4 h-4" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-500 dark:hover:text-red-400 dark:hover:bg-red-950/30 w-full flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sair do sistema</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
