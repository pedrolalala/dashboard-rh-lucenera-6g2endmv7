import { UserPlus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Recrutamento() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-widest text-foreground">
            Recrutamento e Seleção
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gerencie as vagas em aberto, triagem de candidatos e processos seletivos.
          </p>
        </div>
      </div>

      <Card className="shadow-none border-border">
        <CardHeader className="pb-4 border-b border-border bg-transparent">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                <UserPlus className="h-4 w-4" /> Módulo em Construção
              </CardTitle>
              <CardDescription className="mt-1">
                Em breve, você poderá centralizar todo o fluxo de admissão por aqui.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-16 flex flex-col items-center justify-center text-center">
          <UserPlus className="h-12 w-12 text-muted-foreground/20 animate-pulse mb-4" />
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
            Em Desenvolvimento
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
