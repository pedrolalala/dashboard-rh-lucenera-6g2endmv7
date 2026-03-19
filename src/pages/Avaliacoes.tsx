import { Star, Target, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Avaliacoes() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-primary">Avaliações de Desempenho</h1>
        <Button className="bg-secondary text-secondary-foreground">Nova Avaliação</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-blue-100/50 bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">
              Nota Média (Q2)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-4xl font-bold">4.2</div>
              <div className="text-sm pb-1 text-emerald-400 flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" /> +0.3
              </div>
            </div>
            <div className="mt-4 flex gap-1 text-yellow-400">
              <Star className="fill-current size-5" />
              <Star className="fill-current size-5" />
              <Star className="fill-current size-5" />
              <Star className="fill-current size-5" />
              <Star className="size-5 text-primary-foreground/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-blue-100/50 col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-secondary" />
              Progresso do Ciclo Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary mt-2">68% Concluído</div>
            <Progress value={68} className="h-3 mt-4" />
            <p className="text-xs text-muted-foreground mt-3">
              15 de 23 avaliações finalizadas. Prazo: 30 de Julho.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-blue-100/50">
        <CardHeader>
          <CardTitle>Avaliações Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Lucas Rocha', role: 'Especialista', evaluator: 'Ana Silva' },
              { name: 'Tatiana Correia', role: 'Analista', evaluator: 'Gestor RH' },
              { name: 'Wagner Morais', role: 'Assistente', evaluator: 'Gestor RH' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="size-10 border border-border">
                    <AvatarImage src={`https://img.usecurling.com/ppl/thumbnail?seed=${i + 20}`} />
                    <AvatarFallback>{item.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground mb-1">Avaliador responsável:</p>
                  <p className="text-sm font-medium">{item.evaluator}</p>
                </div>
                <Button variant="outline" size="sm">
                  Lembrar Avaliador
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
