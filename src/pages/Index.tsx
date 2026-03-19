import { Users, Building, UserCheck, UserX, ArrowRight, PlusCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { dashboardStats, chartData, recentActivities } from '@/data/mock'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartConfig = {
  TI: { label: 'TI', color: 'hsl(var(--chart-1))' },
  Vendas: { label: 'Vendas', color: 'hsl(var(--chart-2))' },
  RH: { label: 'RH', color: 'hsl(var(--chart-3))' },
  Operações: { label: 'Operações', color: 'hsl(var(--chart-4))' },
  Financeiro: { label: 'Financeiro', color: 'hsl(var(--chart-5))' },
}

export default function Index() {
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
            <div className="text-3xl font-bold text-primary">{dashboardStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">+2 no último mês</p>
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
            <div className="text-3xl font-bold text-primary">{dashboardStats.departments}</div>
            <p className="text-xs text-muted-foreground mt-1">Sedes: São Paulo</p>
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
            <div className="text-3xl font-bold text-primary">{dashboardStats.active}</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">91% da força de trabalho</p>
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
            <div className="text-3xl font-bold text-primary">{dashboardStats.inactive}</div>
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
            <div className="h-[300px] w-full max-w-[400px]">
              <ChartContainer config={chartConfig} className="h-full w-full">
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
