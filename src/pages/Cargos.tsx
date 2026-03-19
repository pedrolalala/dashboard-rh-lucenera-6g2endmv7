import { useState } from 'react'
import { Briefcase, PlusCircle, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const mockCargos = [
  {
    id: '1',
    titulo: 'Analista de Sistemas',
    departamento: 'TI',
    nivel: 'Pleno',
    salarioBase: 'R$ 6.500,00',
  },
  {
    id: '2',
    titulo: 'Gerente de Vendas',
    departamento: 'Vendas',
    nivel: 'Sênior',
    salarioBase: 'R$ 12.000,00',
  },
  {
    id: '3',
    titulo: 'Assistente Administrativo',
    departamento: 'Operações',
    nivel: 'Júnior',
    salarioBase: 'R$ 3.200,00',
  },
  {
    id: '4',
    titulo: 'Especialista em RH',
    departamento: 'RH',
    nivel: 'Sênior',
    salarioBase: 'R$ 9.800,00',
  },
  {
    id: '5',
    titulo: 'Analista Financeiro',
    departamento: 'Financeiro',
    nivel: 'Pleno',
    salarioBase: 'R$ 5.800,00',
  },
]

export default function Cargos() {
  const [search, setSearch] = useState('')

  const filtered = mockCargos.filter((c) => c.titulo.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-widest text-foreground">
            Gestão de Cargos
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Administre as funções, níveis e faixas salariais da empresa.
          </p>
        </div>
        <Button className="uppercase tracking-widest text-xs">
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Cargo
        </Button>
      </div>

      <Card className="shadow-none border-border">
        <CardHeader className="pb-4 border-b border-border bg-transparent">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Cargos Cadastrados
              </CardTitle>
              <CardDescription className="mt-1">
                Lista de todos os cargos disponíveis na estrutura organizacional.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título..."
                className="pl-9 bg-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead>Título do Cargo</TableHead>
                <TableHead>Departamento Padrão</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead className="text-right">Salário Base (Ref.)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground text-xs uppercase tracking-widest"
                  >
                    Nenhum cargo encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((cargo) => (
                  <TableRow key={cargo.id}>
                    <TableCell className="font-medium text-foreground">{cargo.titulo}</TableCell>
                    <TableCell>{cargo.departamento}</TableCell>
                    <TableCell>{cargo.nivel}</TableCell>
                    <TableCell className="text-right">{cargo.salarioBase}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
