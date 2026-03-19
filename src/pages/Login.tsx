import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: signInError } = await signIn(email, password)
    if (signInError) {
      setError('Credenciais inválidas.')
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-none border border-border bg-card">
        <CardHeader className="space-y-4 text-center pb-8 pt-8">
          <div className="flex flex-col items-center justify-center mb-2">
            <span className="font-light text-5xl tracking-[0.2em] text-foreground leading-none">
              LUCE
            </span>
            <span className="font-bold text-5xl tracking-[0.2em] text-foreground leading-none">
              NERA
            </span>
          </div>
          <CardDescription className="uppercase tracking-widest text-xs mt-4">
            Painel Gerencial RH
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-destructive-foreground bg-destructive">{error}</div>
            )}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                E-mail
              </label>
              <Input
                type="email"
                placeholder="admin@lucenera.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Senha
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-border"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 uppercase tracking-widest text-xs"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
