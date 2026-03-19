import { useEffect, useState } from 'react'
import { Users, Building, UserCheck, UserX, ArrowRight, PlusCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { recentActivities } from '@/data/mock'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { supabase } from '@/lib/supabase/client'

export default function Index() {
  const [stats, setStats] = useState({ total: 0, departments: 0, active: 0, inactive: 0 })
  const [chartData, setChartData] = useState<{ sector: string; value: number; fill: string }[]>([])
  const [configForChart, setConfigForChart] = useState<any>({})

  useEffect(() => {
    const fetchData = async () => {
      const { data: funcData } = await supabase
        .from('funcionarios_rh')
        .select('status, departamentos_rh(nome)')

      if (funcData) {
        let active = 0
        let inactive = 0
        const deptMap: Record<string, number> = {}

        funcData.forEach((f) => {
          if (f.status === 'Ativo') active++
          else inactive++

          const deptName = (f.departamentos_rh as any)?.nome || 'Sem Depto'
          deptMap[deptName] = (deptMap[deptName] || 0) + 1
        })

        setStats({
          total: funcData.length,
          active,
          inactive,
          departments: Object.keys(deptMap).length,
        })

        const mappedChartData = Object.keys(deptMap).map((dept, i) => ({
          sector: dept,
          value: deptMap[dept],
          fill: `var(--color-${dept.replace(/\s+/g, '')})`,
        }))

        setChartData(mappedChartData)

        const newConfig = mappedChartData.reduce((acc, item, i) => {
          acc[item.sector.replace(/\s+/g, '')] = {
            label: item.sector,
            color: `hsl(var(--chart-${(i % 5) + 1}))`,
          }
          return acc
        }, {} as any)
        setConfigForChart(newConfig)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Visão Gerencial</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe as métricas principais do time Lucenera.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Gerar Relatório</Button>
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <PlusCircle className="mr-2 h-4 w-4" /> Admitir Funcionário
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Funcionários
            </CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Atualizado em tempo real</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Departamentos
            </CardTitle>
            <Building className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.departments}</div>
            <p className="text-xs text-muted-foreground mt-1">Ativos na base</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Funcionários Ativos
            </CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.active}</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">Força de trabalho</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inativos / Licença
            </CardTitle>
            <UserX className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground mt-1">Férias ou afastamento</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 shadow-sm border-blue-100/50">
          <CardHeader>
            <CardTitle>Distribuição por Setor</CardTitle>
            <CardDescription>Percentual de colaboradores por departamento</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {chartData.length > 0 ? (
              <div className="h-[300px] w-full max-w-[400px]">
                <ChartContainer config={configForChart} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="sector"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        strokeWidth={4}
                        stroke="var(--background)"
                        paddingAngle={2}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Carregando dados...
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3 shadow-sm border-blue-100/50">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas atualizações do RH</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="mt-1 h-2 w-2 rounded-full bg-secondary shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.target}</p>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-secondary" size="sm">
              Ver todas as atividades <ArrowRight className="ml-2 size-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
