import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Loader2, Lock, Mail } from 'lucide-react'
import logoImg from '@/assets/logotipo-vertical_v1_preto-9e726.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      toast({
        title: 'Falha na autenticação',
        description: error.message || 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Acesso liberado',
        description: 'Bem-vindo ao Dashboard RH Lucenera.',
      })
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-950 p-4 relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 animate-fade-in-up relative z-10">
        <div className="flex justify-center mb-8">
          <img
            src={logoImg}
            alt="Lucenera Logo"
            className="h-20 w-auto object-contain dark:invert drop-shadow-sm"
          />
        </div>

        <Card className="border-neutral-200 dark:border-neutral-800 shadow-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Acesso ao Sistema
            </CardTitle>
            <CardDescription className="text-neutral-500 dark:text-neutral-400">
              Insira suas credenciais corporativas
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium">
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@lucenera.com"
                    className="pl-9 h-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-medium">
                    Senha
                  </Label>
                  <button
                    type="button"
                    className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9 h-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 pb-6">
              <Button
                type="submit"
                className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 transition-all font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
