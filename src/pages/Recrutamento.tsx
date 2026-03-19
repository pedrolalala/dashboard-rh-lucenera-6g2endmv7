import { useState, useEffect } from 'react'
import { Plus, FileText, Loader2, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { CandidatoForm } from '@/components/recrutamento/CandidatoForm'
import { useAuth } from '@/hooks/use-auth'
import { Database } from '@/lib/supabase/types'

type Candidato = Database['public']['Tables']['candidatos']['Row']

const STATUS_COLORS: Record<string, string> = {
  'Em Análise':
    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  Entrevista:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  Aprovado:
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
  Reprovado:
    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
}

export default function Recrutamento() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([])
  const [loading, setLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const canManage = user?.app_role === 'admin' || user?.app_role === 'gerente'

  const fetchCandidatos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('candidatos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os candidatos',
        variant: 'destructive',
      })
    } else {
      setCandidatos(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCandidatos()
  }, [])

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('candidatos').update({ status: newStatus }).eq('id', id)
    if (error) {
      toast({ title: 'Erro', description: 'Erro ao atualizar status', variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Status atualizado com sucesso' })
      setCandidatos(candidatos.map((c) => (c.id === id ? { ...c, status: newStatus } : c)))
    }
  }

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
        {canManage && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Novo Candidato
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-[500px] overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle>Adicionar Novo Candidato</SheetTitle>
                <SheetDescription>
                  Insira os dados do candidato e anexe o currículo em formato PDF ou Word.
                </SheetDescription>
              </SheetHeader>
              <CandidatoForm
                onSuccess={() => {
                  setIsSheetOpen(false)
                  fetchCandidatos()
                }}
              />
            </SheetContent>
          </Sheet>
        )}
      </div>

      <Card className="shadow-none border-border">
        <CardHeader className="pb-4 border-b border-border bg-transparent">
          <CardTitle className="text-sm uppercase tracking-widest">Candidatos</CardTitle>
          <CardDescription>Lista de candidatos registrados no sistema.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : candidatos.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <FileText className="h-12 w-12 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
                Nenhum candidato encontrado
              </p>
              <p className="text-muted-foreground/60 text-xs mt-1">
                Cadastre um novo candidato para começar.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidato</TableHead>
                  <TableHead>Vaga</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidatos.map((candidato) => (
                  <TableRow key={candidato.id}>
                    <TableCell>
                      <div className="font-medium">{candidato.nome}</div>
                      <div className="text-xs text-muted-foreground">{candidato.email}</div>
                      {candidato.telefone && (
                        <div className="text-xs text-muted-foreground">{candidato.telefone}</div>
                      )}
                    </TableCell>
                    <TableCell>{candidato.vaga || '-'}</TableCell>
                    <TableCell>
                      {canManage ? (
                        <Select
                          defaultValue={candidato.status || 'Em Análise'}
                          onValueChange={(value) => handleStatusChange(candidato.id, value)}
                        >
                          <SelectTrigger className="w-[140px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Em Análise">Em Análise</SelectItem>
                            <SelectItem value="Entrevista">Entrevista</SelectItem>
                            <SelectItem value="Aprovado">Aprovado</SelectItem>
                            <SelectItem value="Reprovado">Reprovado</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          className={STATUS_COLORS[candidato.status || 'Em Análise']}
                          variant="outline"
                        >
                          {candidato.status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {candidato.curriculo_url ? (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={candidato.curriculo_url} target="_blank" rel="noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" /> Currículo
                          </a>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">Sem anexo</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
