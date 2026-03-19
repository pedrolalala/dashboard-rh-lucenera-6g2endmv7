import { Link, useLocation } from 'react-router-dom'
import {
  Users,
  Calendar,
  LayoutDashboard,
  Settings,
  LogOut,
  Clock,
  Star,
  FileText,
  UserPlus,
} from 'lucide-react'
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

const navGestao = [
  { name: 'Funcionários Ativos', href: '/funcionarios', icon: Users },
  { name: 'Recrutamento', href: '/recrutamento', icon: UserPlus },
]

const navOperacional = [
  { name: 'Controle de Ponto', href: '/ponto', icon: Clock },
  { name: 'Férias', href: '/ferias', icon: Calendar },
]

const navResultados = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Avaliações', href: '/avaliacoes', icon: Star },
  { name: 'Relatório de Métricas', href: '/relatorios', icon: FileText },
]

export function AppSidebar() {
  const location = useLocation()
  const { signOut, user } = useAuth()
  const isAdmin = user?.app_role === 'admin'
  const isFuncionario = user?.app_role === 'funcionario'

  const renderMenu = (items: any[]) => (
    <SidebarMenu>
      {items.map((item) => {
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
  )

  return (
    <Sidebar>
      <SidebarHeader className="p-6 flex items-center justify-center border-b border-border/50">
        <Link
          to={isFuncionario ? '/ponto' : '/'}
          className="w-full flex justify-center hover:opacity-80 transition-opacity"
        >
          <img
            src={logoImg}
            alt="Lucenera Logo"
            className="h-12 w-auto object-contain dark:invert"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {!isFuncionario && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 mt-4 px-4">
              Gestão
            </SidebarGroupLabel>
            <SidebarGroupContent>{renderMenu(navGestao)}</SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 mt-2 px-4">
            Operacional
          </SidebarGroupLabel>
          <SidebarGroupContent>{renderMenu(navOperacional)}</SidebarGroupContent>
        </SidebarGroup>

        {!isFuncionario && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 mt-2 px-4">
              Avaliações e Dashboard
            </SidebarGroupLabel>
            <SidebarGroupContent>{renderMenu(navResultados)}</SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50 space-y-2">
        {isAdmin && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === '/configuracoes'}
                tooltip="Configurações"
              >
                <Link to="/configuracoes" className="flex items-center gap-3 py-2">
                  <Settings className="w-4 h-4" />
                  <span className="font-medium">Configurações</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
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
