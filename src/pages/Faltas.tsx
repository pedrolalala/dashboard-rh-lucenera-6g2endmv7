import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaltasTabela } from '@/components/faltas/FaltasTabela'
import { FaltasCalendario } from '@/components/faltas/FaltasCalendario'
import { Bus } from 'lucide-react'

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
