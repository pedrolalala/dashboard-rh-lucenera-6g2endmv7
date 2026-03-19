-- Create avaliacoes table
CREATE TABLE public.avaliacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funcionario_id UUID NOT NULL REFERENCES public.funcionarios_rh(id) ON DELETE CASCADE,
    periodo_inicio DATE NOT NULL,
    periodo_fim DATE NOT NULL,
    produtividade INTEGER NOT NULL CHECK (produtividade BETWEEN 1 AND 5),
    qualidade INTEGER NOT NULL CHECK (qualidade BETWEEN 1 AND 5),
    pontualidade INTEGER NOT NULL CHECK (pontualidade BETWEEN 1 AND 5),
    trabalho_equipe INTEGER NOT NULL CHECK (trabalho_equipe BETWEEN 1 AND 5),
    comentarios TEXT,
    data_avaliacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    avaliador_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

-- Policy for Admin and Gerente (ALL operations)
CREATE POLICY "auth_all_admin_gerente_avaliacoes" ON public.avaliacoes
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND role IN ('admin', 'gerente'))
    );

-- Policy for Funcionario (SELECT only own evaluations)
CREATE POLICY "auth_select_func_avaliacoes" ON public.avaliacoes
    FOR SELECT TO authenticated USING (
        funcionario_id IN (SELECT id FROM public.funcionarios_rh WHERE user_id = auth.uid())
    );
