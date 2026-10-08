import { Component, type ErrorInfo, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'

// Tela branca na Lana (08/10/2026): as páginas carregam em pedaços (lazy); quando o sistema é
// publicado de novo com a aba aberta, os pedaços antigos deixam de existir e o import falha —
// sem tratamento, o React desmonta tudo e sobra a tela branca até o F5.
const CHAVE = 'rh_recarregado_em'

function ehErroDeCarregamento(erro: unknown): boolean {
  const msg = erro instanceof Error ? `${erro.name} ${erro.message}` : String(erro)
  return /dynamically imported module|Importing a module script failed|ChunkLoadError|Loading chunk|Failed to fetch/i.test(
    msg,
  )
}

/** Recarrega a página no máximo uma vez a cada 30 s (evita loop se o servidor estiver fora). */
export function recarregarUmaVez(): boolean {
  try {
    const ultimo = Number(sessionStorage.getItem(CHAVE) || 0)
    if (Date.now() - ultimo < 30_000) return false
    sessionStorage.setItem(CHAVE, String(Date.now()))
  } catch {
    /* sem sessionStorage: recarrega mesmo assim */
  }
  window.location.reload()
  return true
}

interface State {
  erro: unknown
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { erro: null }

  static getDerivedStateFromError(erro: unknown): State {
    return { erro }
  }

  componentDidCatch(erro: unknown, info: ErrorInfo) {
    console.error('[RH] erro na tela', erro, info.componentStack)
    // Registro para investigar depois (tabela erros_tela; só admin lê). Nunca quebra a tela.
    const e = erro instanceof Error ? erro : new Error(String(erro))
    supabase
      .from('erros_tela')
      .insert({
        sistema: 'rh',
        mensagem: `${e.name}: ${e.message}`.slice(0, 1000),
        detalhe: `${e.stack ?? ''}\n--- componentes ---${info.componentStack ?? ''}`.slice(0, 8000),
        url: window.location.href,
        navegador: navigator.userAgent,
      })
      .then(
        () => undefined,
        () => undefined,
      )
    if (ehErroDeCarregamento(erro)) recarregarUmaVez()
  }

  render() {
    if (!this.state.erro) return this.props.children
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center space-y-3">
          <h1 className="text-lg font-semibold">Algo deu errado nesta tela</h1>
          <p className="text-sm text-muted-foreground">
            O sistema pode ter sido atualizado. Recarregue a página para continuar.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Recarregar
          </button>
          <p className="text-[10px] text-muted-foreground break-all pt-2">
            Detalhe:{' '}
            {this.state.erro instanceof Error ? this.state.erro.message : String(this.state.erro)}
          </p>
        </div>
      </div>
    )
  }
}
