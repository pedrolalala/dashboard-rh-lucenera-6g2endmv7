import { Settings, ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

export default function Configuracoes() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (user?.app_role !== 'admin') {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 animate-fade-in-up">
        <ShieldAlert className="h-16 w-16 text-destructive" />
        <h2 className="text-xl font-light uppercase tracking-widest text-foreground">
          Acesso Restrito
        </h2>
        <p className="text-muted-foreground max-w-md text-center text-sm">
          Esta página é exclusiva para administradores do sistema.
        </p>
        <Button onClick={() => navigate('/')} className="mt-4 uppercase tracking-widest text-xs">
          Voltar para o Início
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-widest text-foreground">
            Configurações
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Ajustes de preferências e parâmetros do sistema (Acesso Restrito).
          </p>
        </div>
      </div>

      <Card className="shadow-none border-border">
        <CardHeader className="pb-4 border-b border-border bg-transparent">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                <Settings className="h-4 w-4" /> Preferências Gerais
              </CardTitle>
              <CardDescription className="mt-1">
                Página em construção. Em breve as configurações do sistema estarão disponíveis aqui.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-16 flex flex-col items-center justify-center text-center">
          <Settings className="h-12 w-12 text-muted-foreground/20 animate-spin-slow mb-4" />
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
            Em Desenvolvimento
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
