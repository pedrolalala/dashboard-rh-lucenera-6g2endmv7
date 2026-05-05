import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaltasTabela } from '@/components/faltas/FaltasTabela'
import { FaltasCalendario } from '@/components/faltas/FaltasCalendario'
import { Bus, Info } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Faltas() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleRefresh = () => setRefreshTrigger((prev) => prev + 1)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-widest text-foreground">
            Controle de Faltas
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Registre e monitore as ausências e faltas dos colaboradores.
          </p>
        </div>
        <Link
          to="/vale-transporte"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
        >
          <Bus className="h-4 w-4" />
          Gerar Vale Transporte
        </Link>
      </div>

      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary font-medium text-xs uppercase tracking-widest">
          Impacto no Saldo de Férias
        </AlertTitle>
        <AlertDescription className="text-muted-foreground text-xs mt-2">
          Qualquer registro com status <strong className="text-foreground">Ausente</strong> e{' '}
          <strong className="text-foreground">sem justificativa</strong> reduzirá automaticamente o
          direito a férias na próxima consulta, seguindo as faixas da CLT:
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            <span>
              <strong className="text-foreground">Até 5 faltas:</strong> 30 dias
            </span>
            <span>
              <strong className="text-foreground">6 a 14 faltas:</strong> 24 dias
            </span>
            <span>
              <strong className="text-foreground">15 a 23 faltas:</strong> 18 dias
            </span>
            <span>
              <strong className="text-foreground">24 a 32 faltas:</strong> 12 dias
            </span>
            <span>
              <strong className="text-foreground">Acima de 32:</strong> 0 dias
            </span>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 flex flex-col gap-6">
          <FaltasCalendario refreshTrigger={refreshTrigger} />
        </div>
        <div className="xl:col-span-8 flex flex-col gap-6">
          <FaltasTabela refreshTrigger={refreshTrigger} onRefresh={handleRefresh} />
        </div>
      </div>
    </div>
  )
}
