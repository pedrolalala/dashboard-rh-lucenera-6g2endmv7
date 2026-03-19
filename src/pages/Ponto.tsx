import { useState } from 'react'
import { PontoRelogio } from '@/components/ponto/PontoRelogio'
import { PontoTabela } from '@/components/ponto/PontoTabela'

export default function Ponto() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-light uppercase tracking-widest text-foreground">
          Controle de Ponto
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Monitore a assiduidade e jornada de trabalho da equipe.
        </p>
      </div>

      {/* Relógio sempre visível na renderização (a lógica de permissão fica dentro do componente) */}
      <PontoRelogio onPunch={() => setRefreshTrigger((r) => r + 1)} />

      <PontoTabela refreshTrigger={refreshTrigger} />
    </div>
  )
}
