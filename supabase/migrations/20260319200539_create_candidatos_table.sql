-- Create the candidatos table
CREATE TABLE public.candidatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  vaga TEXT,
  status TEXT DEFAULT 'Em Análise',
  curriculo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.candidatos ENABLE ROW LEVEL SECURITY;

-- Policies for candidatos
CREATE POLICY "candidatos_all_admin_gerente" ON public.candidatos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE usuarios.id = auth.uid() 
      AND usuarios.role IN ('admin', 'gerente')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE usuarios.id = auth.uid() 
      AND usuarios.role IN ('admin', 'gerente')
    )
  );

-- Create bucket 'Arquivo-recrutamento' if it does not exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('Arquivo-recrutamento', 'Arquivo-recrutamento', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for storage bucket 'Arquivo-recrutamento'
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'Arquivo-recrutamento');

CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'Arquivo-recrutamento');

CREATE POLICY "Authenticated users can update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'Arquivo-recrutamento');

CREATE POLICY "Authenticated users can delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'Arquivo-recrutamento');
