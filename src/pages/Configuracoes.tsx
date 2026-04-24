import { useEffect, useState } from 'react'
import { ShieldAlert, Users, Key, UserX, UserCheck, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function Configuracoes() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [passwordDialog, setPasswordDialog] = useState({ open: false, userId: '', userName: '' })
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    if (user?.app_role === 'admin') {
      fetchUsuarios()
    }
  }, [user])

  const fetchUsuarios = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('usuarios').select('*').order('nome')
    if (error) toast.error('Erro ao carregar usuários')
    else if (data) setUsuarios(data)
    setLoading(false)
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.rpc('admin_update_user_password', {
        p_user_id: passwordDialog.userId,
        p_new_password: newPassword,
      })
      if (error) throw error
      toast.success('Senha atualizada com sucesso')
      setPasswordDialog({ open: false, userId: '', userName: '' })
      setNewPassword('')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar senha')
    }
  }

  const handleToggleStatus = async (id: string, ativo: boolean) => {
    try {
      const { error } = await supabase.rpc('admin_update_user_status', {
        p_user_id: id,
        p_ativo: !ativo,
      })
      if (error) throw error
      toast.success(`Usuário ${!ativo ? 'ativado' : 'inativado'} com sucesso`)
      fetchUsuarios()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao alterar status')
    }
  }

  const handleRoleChange = async (id: string, role: string) => {
    try {
      const { error } = await supabase.rpc('admin_update_user_role', {
        p_user_id: id,
        p_role: role,
      })
      if (error) throw error
      toast.success('Perfil atualizado com sucesso')
      fetchUsuarios()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao alterar perfil')
    }
  }

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
    <div className="space-y-6 animate-fade-in-up p-2 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-widest text-foreground">
            Configurações
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gestão de acessos e configurações do sistema.
          </p>
        </div>
      </div>

      <Card className="shadow-none border-border">
        <CardHeader className="pb-4 border-b border-border">
          <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
            <Users className="h-4 w-4" /> Usuários e Permissões
          </CardTitle>
          <CardDescription>
            Gerencie senhas, status e os níveis de acesso de todos os colaboradores.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.nome}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <select
                        className="bg-transparent border border-input rounded px-2 py-1 text-sm focus:ring-2 focus:ring-ring outline-none"
                        value={u.role || ''}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={user.id === u.id}
                      >
                        <option value="admin">Admin</option>
                        <option value="gerente">Gerente</option>
                        <option value="operador">Operador</option>
                        <option value="funcionario">Funcionário</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.ativo ? 'default' : 'secondary'}>
                        {u.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs px-2"
                        onClick={() =>
                          setPasswordDialog({ open: true, userId: u.id, userName: u.nome })
                        }
                      >
                        <Key className="w-3 h-3 mr-1" /> Senha
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handleToggleStatus(u.id, u.ativo)}
                        disabled={user.id === u.id}
                      >
                        {u.ativo ? (
                          <UserX className="w-3 h-3 text-destructive" />
                        ) : (
                          <UserCheck className="w-3 h-3 text-green-500" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={passwordDialog.open}
        onOpenChange={(val) => setPasswordDialog((prev) => ({ ...prev, open: val }))}
      >
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleUpdatePassword}>
            <DialogHeader>
              <DialogTitle>Redefinir Senha</DialogTitle>
              <DialogDescription>
                Defina uma nova senha para <strong>{passwordDialog.userName}</strong>.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-pwd">Nova Senha</Label>
                <Input
                  id="new-pwd"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPasswordDialog((prev) => ({ ...prev, open: false }))}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={newPassword.length < 6}>
                Salvar Senha
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
