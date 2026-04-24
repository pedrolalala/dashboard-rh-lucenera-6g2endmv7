import { useState } from 'react'
import { FaltasTabela } from '@/components/faltas/FaltasTabela'

export default function Faltas() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-light uppercase tracking-widest text-foreground">
          Controle de Faltas
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Registre e monitore as ausências e faltas dos colaboradores.
        </p>
      </div>

      <FaltasTabela refreshTrigger={refreshTrigger} />
    </div>
  )
}
