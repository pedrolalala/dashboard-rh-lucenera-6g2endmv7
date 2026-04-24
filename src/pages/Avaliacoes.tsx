import { useEffect, useState, useMemo } from 'react'
import { Star, Target, TrendingUp, PlusCircle, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { EvaluationForm } from '@/components/evaluations/EvaluationForm'
import { EvaluationTable, EvaluationData } from '@/components/evaluations/EvaluationTable'

export default function Avaliacoes() {
  const [evaluations, setEvaluations] = useState<EvaluationData[]>([])
  const [employees, setEmployees] = useState<{ id: string; nome: string }[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [dateFilterStart, setDateFilterStart] = useState('')
  const [dateFilterEnd, setDateFilterEnd] = useState('')

  const { user } = useAuth()
  const { toast } = useToast()
  const canEdit = user?.app_role === 'admin' || user?.app_role === 'gerente'

  const fetchData = async () => {
    const { data: empData } = await supabase
      .from('funcionarios')
      .select('id, nome')
      .eq('status', 'Ativo')
    if (empData) setEmployees(empData)

    let query = supabase
      .from('avaliacoes')
      .select('*, funcionarios(nome), usuarios(nome)')
      .order('data_avaliacao', { ascending: false })

    if (user?.app_role === 'funcionario' && user?.funcionario_id) {
      query = query.eq('funcionario_id', user.funcionario_id)
    }

    const { data, error } = await query
    if (data && !error) setEvaluations(data as any)
  }

  useEffect(() => {
    fetchData()
  }, [user])

  const filteredEvals = useMemo(() => {
    return evaluations.filter((e) => {
      const matchName = e.funcionarios?.nome.toLowerCase().includes(search.toLowerCase())
      const evalDate = new Date(e.data_avaliacao)
      const matchStart = dateFilterStart ? evalDate >= new Date(dateFilterStart) : true
      const matchEnd = dateFilterEnd ? evalDate <= new Date(dateFilterEnd) : true
      return matchName && matchStart && matchEnd
    })
  }, [evaluations, search, dateFilterStart, dateFilterEnd])

  const overallAvg =
    evaluations.length > 0
      ? (
          evaluations.reduce(
            (acc, curr) =>
              acc +
              (curr.produtividade + curr.qualidade + curr.pontualidade + curr.trabalho_equipe) / 4,
            0,
          ) / evaluations.length
        ).toFixed(1)
      : '0.0'

  const handleSuccess = () => {
    toast({ title: 'Avaliação salva com sucesso!' })
    setIsFormOpen(false)
    fetchData()
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-widest text-foreground">
            Avaliações de Desempenho
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Acompanhe a produtividade e qualidade do time.
          </p>
        </div>
        {canEdit && (
          <Button onClick={() => setIsFormOpen(true)} className="uppercase tracking-widest text-xs">
            <PlusCircle className="mr-2 h-4 w-4" /> Nova Avaliação
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-none rounded-none border-border bg-foreground text-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-widest text-background/70">
              Nota Média Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-5xl font-light">{overallAvg}</div>
              <div className="text-xs pb-1 text-background/90 flex items-center tracking-widest">
                <TrendingUp className="mr-1 h-3 w-3" /> ATUAL
              </div>
            </div>
            <div className="mt-4 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`size-5 ${n <= Math.round(Number(overallAvg)) ? 'fill-background text-background' : 'text-background/30'}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none rounded-none border-border col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" /> Visão Resumida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-12 mt-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                  Total Avaliações
                </p>
                <p className="text-3xl font-light text-foreground">{evaluations.length}</p>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                  Último Registro
                </p>
                <p className="text-xl font-light text-foreground">
                  {evaluations[0]
                    ? new Date(evaluations[0].data_avaliacao).toLocaleDateString('pt-BR')
                    : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-none rounded-none border-border">
        <CardHeader className="border-b border-border bg-transparent pb-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-sm uppercase tracking-widest">Histórico</CardTitle>
              <CardDescription>Consulte os registros completos.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar funcionário..."
                  className="pl-9 bg-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
                <Input
                  type="date"
                  value={dateFilterStart}
                  onChange={(e) => setDateFilterStart(e.target.value)}
                  className="bg-transparent max-w-[140px] text-sm"
                  title="Data Inicial"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="date"
                  value={dateFilterEnd}
                  onChange={(e) => setDateFilterEnd(e.target.value)}
                  className="bg-transparent max-w-[140px] text-sm"
                  title="Data Final"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <EvaluationTable data={filteredEvals} />
        </CardContent>
      </Card>

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="uppercase tracking-widest font-light">Nova Avaliação</SheetTitle>
            <SheetDescription>
              Preencha os critérios abaixo para registrar a performance do colaborador.
            </SheetDescription>
          </SheetHeader>
          <EvaluationForm
            employees={employees}
            onSuccess={handleSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
