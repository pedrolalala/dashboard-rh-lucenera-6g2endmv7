// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      avaliacoes: {
        Row: {
          avaliador_id: string
          comentarios: string | null
          data_avaliacao: string
          funcionario_id: string
          id: string
          periodo_fim: string
          periodo_inicio: string
          pontualidade: number
          produtividade: number
          qualidade: number
          trabalho_equipe: number
        }
        Insert: {
          avaliador_id: string
          comentarios?: string | null
          data_avaliacao?: string
          funcionario_id: string
          id?: string
          periodo_fim: string
          periodo_inicio: string
          pontualidade: number
          produtividade: number
          qualidade: number
          trabalho_equipe: number
        }
        Update: {
          avaliador_id?: string
          comentarios?: string | null
          data_avaliacao?: string
          funcionario_id?: string
          id?: string
          periodo_fim?: string
          periodo_inicio?: string
          pontualidade?: number
          produtividade?: number
          qualidade?: number
          trabalho_equipe?: number
        }
        Relationships: [
          {
            foreignKeyName: 'avaliacoes_avaliador_id_fkey'
            columns: ['avaliador_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'avaliacoes_funcionario_id_fkey'
            columns: ['funcionario_id']
            isOneToOne: false
            referencedRelation: 'funcionarios_rh'
            referencedColumns: ['id']
          },
        ]
      }
      candidatos: {
        Row: {
          created_at: string
          curriculo_url: string | null
          email: string
          id: string
          nome: string
          status: string | null
          telefone: string | null
          vaga: string | null
        }
        Insert: {
          created_at?: string
          curriculo_url?: string | null
          email: string
          id?: string
          nome: string
          status?: string | null
          telefone?: string | null
          vaga?: string | null
        }
        Update: {
          created_at?: string
          curriculo_url?: string | null
          email?: string
          id?: string
          nome?: string
          status?: string | null
          telefone?: string | null
          vaga?: string | null
        }
        Relationships: []
      }
      controle_ponto: {
        Row: {
          created_at: string
          data: string
          funcionario_id: string
          hora_entrada: string | null
          hora_saida: string | null
          id: string
          status: string | null
          total_horas: number | null
        }
        Insert: {
          created_at?: string
          data: string
          funcionario_id: string
          hora_entrada?: string | null
          hora_saida?: string | null
          id?: string
          status?: string | null
          total_horas?: number | null
        }
        Update: {
          created_at?: string
          data?: string
          funcionario_id?: string
          hora_entrada?: string | null
          hora_saida?: string | null
          id?: string
          status?: string | null
          total_horas?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'controle_ponto_funcionario_id_fkey'
            columns: ['funcionario_id']
            isOneToOne: false
            referencedRelation: 'funcionarios_rh'
            referencedColumns: ['id']
          },
        ]
      }
      departamentos_rh: {
        Row: {
          id: string
          nome: string
        }
        Insert: {
          id?: string
          nome: string
        }
        Update: {
          id?: string
          nome?: string
        }
        Relationships: []
      }
      entregas_finalizadas: {
        Row: {
          cliente: string | null
          codigo_obra: number | null
          created_at: string | null
          data_entrega_real: string | null
          data_solicitacao: string | null
          endereco: string | null
          fotos_urls: Json | null
          gestora_equipe: string | null
          id: string | null
          material_conteudo: string | null
          material_tipo: string | null
          numero_entrega: string | null
          numero_pedido: string | null
          observacoes: string | null
          observacoes_internas: string | null
          recebido_por: string | null
          separacao_id: string | null
          telefone: string | null
          vendedor: string | null
        }
        Insert: {
          cliente?: string | null
          codigo_obra?: number | null
          created_at?: string | null
          data_entrega_real?: string | null
          data_solicitacao?: string | null
          endereco?: string | null
          fotos_urls?: Json | null
          gestora_equipe?: string | null
          id?: string | null
          material_conteudo?: string | null
          material_tipo?: string | null
          numero_entrega?: string | null
          numero_pedido?: string | null
          observacoes?: string | null
          observacoes_internas?: string | null
          recebido_por?: string | null
          separacao_id?: string | null
          telefone?: string | null
          vendedor?: string | null
        }
        Update: {
          cliente?: string | null
          codigo_obra?: number | null
          created_at?: string | null
          data_entrega_real?: string | null
          data_solicitacao?: string | null
          endereco?: string | null
          fotos_urls?: Json | null
          gestora_equipe?: string | null
          id?: string | null
          material_conteudo?: string | null
          material_tipo?: string | null
          numero_entrega?: string | null
          numero_pedido?: string | null
          observacoes?: string | null
          observacoes_internas?: string | null
          recebido_por?: string | null
          separacao_id?: string | null
          telefone?: string | null
          vendedor?: string | null
        }
        Relationships: []
      }
      entregas_pendentes: {
        Row: {
          cliente: string | null
          codigo_obra: string | null
          created_at: string | null
          data_registro: string | null
          descricao_problema: string | null
          endereco: string | null
          fotos_resolucao: string | null
          fotos_urls: string | null
          id: string | null
          observacoes_resolucao: string | null
          registrado_por: string | null
          registrado_por_user_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          resolved_by_user_id: string | null
          responsavel: string | null
          separacao_id: string | null
          status_pendencia: string | null
          telefone: string | null
          tipo_problema: string | null
        }
        Insert: {
          cliente?: string | null
          codigo_obra?: string | null
          created_at?: string | null
          data_registro?: string | null
          descricao_problema?: string | null
          endereco?: string | null
          fotos_resolucao?: string | null
          fotos_urls?: string | null
          id?: string | null
          observacoes_resolucao?: string | null
          registrado_por?: string | null
          registrado_por_user_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          resolved_by_user_id?: string | null
          responsavel?: string | null
          separacao_id?: string | null
          status_pendencia?: string | null
          telefone?: string | null
          tipo_problema?: string | null
        }
        Update: {
          cliente?: string | null
          codigo_obra?: string | null
          created_at?: string | null
          data_registro?: string | null
          descricao_problema?: string | null
          endereco?: string | null
          fotos_resolucao?: string | null
          fotos_urls?: string | null
          id?: string | null
          observacoes_resolucao?: string | null
          registrado_por?: string | null
          registrado_por_user_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          resolved_by_user_id?: string | null
          responsavel?: string | null
          separacao_id?: string | null
          status_pendencia?: string | null
          telefone?: string | null
          tipo_problema?: string | null
        }
        Relationships: []
      }
      ferias: {
        Row: {
          data_fim: string
          data_inicio: string
          data_solicitacao: string
          dias: number
          funcionario_id: string | null
          id: string
          status: string | null
        }
        Insert: {
          data_fim: string
          data_inicio: string
          data_solicitacao?: string
          dias: number
          funcionario_id?: string | null
          id?: string
          status?: string | null
        }
        Update: {
          data_fim?: string
          data_inicio?: string
          data_solicitacao?: string
          dias?: number
          funcionario_id?: string | null
          id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'ferias_funcionario_id_fkey'
            columns: ['funcionario_id']
            isOneToOne: false
            referencedRelation: 'funcionarios_rh'
            referencedColumns: ['id']
          },
        ]
      }
      folha_pagamento: {
        Row: {
          adicionais: number
          ano: number
          data_geracao: string
          descontos: number
          funcionario_id: string
          id: string
          mes: number
          salario_base: number
          salario_liquido: number
        }
        Insert: {
          adicionais: number
          ano: number
          data_geracao?: string
          descontos: number
          funcionario_id: string
          id?: string
          mes: number
          salario_base: number
          salario_liquido: number
        }
        Update: {
          adicionais?: number
          ano?: number
          data_geracao?: string
          descontos?: number
          funcionario_id?: string
          id?: string
          mes?: number
          salario_base?: number
          salario_liquido?: number
        }
        Relationships: [
          {
            foreignKeyName: 'folha_pagamento_funcionario_id_fkey'
            columns: ['funcionario_id']
            isOneToOne: false
            referencedRelation: 'funcionarios_rh'
            referencedColumns: ['id']
          },
        ]
      }
      funcionarios_rh: {
        Row: {
          cargo: string | null
          cpf: string | null
          created_at: string
          data_admissao: string | null
          departamento_id: string | null
          email: string
          id: string
          nome: string
          salario_base: number | null
          status: string | null
          telefone: string | null
          user_id: string | null
        }
        Insert: {
          cargo?: string | null
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          departamento_id?: string | null
          email: string
          id?: string
          nome: string
          salario_base?: number | null
          status?: string | null
          telefone?: string | null
          user_id?: string | null
        }
        Update: {
          cargo?: string | null
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          departamento_id?: string | null
          email?: string
          id?: string
          nome?: string
          salario_base?: number | null
          status?: string | null
          telefone?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'funcionarios_rh_departamento_id_fkey'
            columns: ['departamento_id']
            isOneToOne: false
            referencedRelation: 'departamentos_rh'
            referencedColumns: ['id']
          },
        ]
      }
      projetos: {
        Row: {
          arquiteto_responsavel: string | null
          cidade: string | null
          codigo: string | null
          created_at: string
          data_entrada: string | null
          estado: string | null
          id: string
          nome: string
          observacoes: string | null
          prazo: string | null
          responsavel: string
          responsavel_obra: string | null
          status: string
          valor: number
        }
        Insert: {
          arquiteto_responsavel?: string | null
          cidade?: string | null
          codigo?: string | null
          created_at?: string
          data_entrada?: string | null
          estado?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          prazo?: string | null
          responsavel: string
          responsavel_obra?: string | null
          status: string
          valor: number
        }
        Update: {
          arquiteto_responsavel?: string | null
          cidade?: string | null
          codigo?: string | null
          created_at?: string
          data_entrada?: string | null
          estado?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          prazo?: string | null
          responsavel?: string
          responsavel_obra?: string | null
          status?: string
          valor?: number
        }
        Relationships: []
      }
      separacao_arquivos: {
        Row: {
          created_at: string | null
          id: string | null
          nome_arquivo: string | null
          ordem: number | null
          separacao_id: string | null
          tamanho_bytes: number | null
          tipo_arquivo: string | null
          url_arquivo: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          nome_arquivo?: string | null
          ordem?: number | null
          separacao_id?: string | null
          tamanho_bytes?: number | null
          tipo_arquivo?: string | null
          url_arquivo?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          nome_arquivo?: string | null
          ordem?: number | null
          separacao_id?: string | null
          tamanho_bytes?: number | null
          tipo_arquivo?: string | null
          url_arquivo?: string | null
        }
        Relationships: []
      }
      separacao_itens: {
        Row: {
          codigo_produto: string | null
          created_at: string | null
          descricao: string | null
          id: string | null
          id_lote: string | null
          local: number | null
          marca: string | null
          ordem: number | null
          quantidade: number | null
          referencia: string | null
          separacao_id: string | null
        }
        Insert: {
          codigo_produto?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string | null
          id_lote?: string | null
          local?: number | null
          marca?: string | null
          ordem?: number | null
          quantidade?: number | null
          referencia?: string | null
          separacao_id?: string | null
        }
        Update: {
          codigo_produto?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string | null
          id_lote?: string | null
          local?: number | null
          marca?: string | null
          ordem?: number | null
          quantidade?: number | null
          referencia?: string | null
          separacao_id?: string | null
        }
        Relationships: []
      }
      separacoes: {
        Row: {
          cliente: string | null
          codigo_obra: number | null
          codigo_rastreamento: string | null
          created_at: string | null
          data_entrega: string | null
          data_inicio_separacao: string | null
          delivery_type: string | null
          endereco: string | null
          garantia_detalhes: string | null
          garantia_motivo: string | null
          garantia_peca: string | null
          gestora_equipe: string | null
          id: string | null
          inclui_garantia: boolean | null
          material_conteudo: string | null
          material_tipo: string | null
          nivel_complexidade: string | null
          numero_entrega: string | null
          numero_venda: Json | null
          observacoes_internas: string | null
          order_in_route: string | null
          responsavel_recebimento: string | null
          scheduled_time: string | null
          separacoes_parciais: Json | null
          solicitante: string | null
          status: string | null
          telefone: string | null
          tipo_entrega: string | null
          tipo_pedido: string | null
          transportadora_nome: string | null
          updated_at: string | null
        }
        Insert: {
          cliente?: string | null
          codigo_obra?: number | null
          codigo_rastreamento?: string | null
          created_at?: string | null
          data_entrega?: string | null
          data_inicio_separacao?: string | null
          delivery_type?: string | null
          endereco?: string | null
          garantia_detalhes?: string | null
          garantia_motivo?: string | null
          garantia_peca?: string | null
          gestora_equipe?: string | null
          id?: string | null
          inclui_garantia?: boolean | null
          material_conteudo?: string | null
          material_tipo?: string | null
          nivel_complexidade?: string | null
          numero_entrega?: string | null
          numero_venda?: Json | null
          observacoes_internas?: string | null
          order_in_route?: string | null
          responsavel_recebimento?: string | null
          scheduled_time?: string | null
          separacoes_parciais?: Json | null
          solicitante?: string | null
          status?: string | null
          telefone?: string | null
          tipo_entrega?: string | null
          tipo_pedido?: string | null
          transportadora_nome?: string | null
          updated_at?: string | null
        }
        Update: {
          cliente?: string | null
          codigo_obra?: number | null
          codigo_rastreamento?: string | null
          created_at?: string | null
          data_entrega?: string | null
          data_inicio_separacao?: string | null
          delivery_type?: string | null
          endereco?: string | null
          garantia_detalhes?: string | null
          garantia_motivo?: string | null
          garantia_peca?: string | null
          gestora_equipe?: string | null
          id?: string | null
          inclui_garantia?: boolean | null
          material_conteudo?: string | null
          material_tipo?: string | null
          nivel_complexidade?: string | null
          numero_entrega?: string | null
          numero_venda?: Json | null
          observacoes_internas?: string | null
          order_in_route?: string | null
          responsavel_recebimento?: string | null
          scheduled_time?: string | null
          separacoes_parciais?: Json | null
          solicitante?: string | null
          status?: string | null
          telefone?: string | null
          tipo_entrega?: string | null
          tipo_pedido?: string | null
          transportadora_nome?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tabela_precos: {
        Row: {
          categoria: string
          created_at: string
          id: string
          observacao: string | null
          preco: number
          servico: string
          vigencia: string
        }
        Insert: {
          categoria: string
          created_at?: string
          id?: string
          observacao?: string | null
          preco: number
          servico: string
          vigencia: string
        }
        Update: {
          categoria?: string
          created_at?: string
          id?: string
          observacao?: string | null
          preco?: number
          servico?: string
          vigencia?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string | null
          nome_completo: string | null
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string | null
          nome_completo?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string | null
          nome_completo?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          nome: string
          role: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: avaliacoes
//   id: uuid (not null, default: gen_random_uuid())
//   funcionario_id: uuid (not null)
//   periodo_inicio: date (not null)
//   periodo_fim: date (not null)
//   produtividade: integer (not null)
//   qualidade: integer (not null)
//   pontualidade: integer (not null)
//   trabalho_equipe: integer (not null)
//   comentarios: text (nullable)
//   data_avaliacao: timestamp with time zone (not null, default: now())
//   avaliador_id: uuid (not null)
// Table: candidatos
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   email: text (not null)
//   telefone: text (nullable)
//   vaga: text (nullable)
//   status: text (nullable, default: 'Em Análise'::text)
//   curriculo_url: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: controle_ponto
//   id: uuid (not null, default: gen_random_uuid())
//   funcionario_id: uuid (not null)
//   data: date (not null)
//   hora_entrada: time without time zone (nullable)
//   hora_saida: time without time zone (nullable)
//   total_horas: numeric (nullable)
//   status: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: departamentos_rh
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
// Table: entregas_finalizadas
//   id: text (nullable)
//   separacao_id: text (nullable)
//   cliente: text (nullable)
//   codigo_obra: bigint (nullable)
//   data_entrega_real: timestamp with time zone (nullable)
//   endereco: text (nullable)
//   recebido_por: text (nullable)
//   telefone: text (nullable)
//   material_tipo: text (nullable)
//   material_conteudo: text (nullable)
//   fotos_urls: jsonb (nullable)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (nullable)
//   numero_pedido: text (nullable)
//   vendedor: text (nullable)
//   observacoes_internas: text (nullable)
//   gestora_equipe: text (nullable)
//   numero_entrega: text (nullable)
//   data_solicitacao: timestamp with time zone (nullable)
// Table: entregas_pendentes
//   id: text (nullable)
//   separacao_id: text (nullable)
//   codigo_obra: text (nullable)
//   cliente: text (nullable)
//   endereco: text (nullable)
//   responsavel: text (nullable)
//   telefone: text (nullable)
//   tipo_problema: text (nullable)
//   descricao_problema: text (nullable)
//   fotos_urls: text (nullable)
//   registrado_por: text (nullable)
//   registrado_por_user_id: text (nullable)
//   data_registro: text (nullable)
//   status_pendencia: text (nullable)
//   resolved_at: text (nullable)
//   resolved_by: text (nullable)
//   created_at: text (nullable)
//   fotos_resolucao: text (nullable)
//   observacoes_resolucao: text (nullable)
//   resolved_by_user_id: text (nullable)
// Table: ferias
//   id: uuid (not null, default: gen_random_uuid())
//   funcionario_id: uuid (nullable)
//   data_inicio: date (not null)
//   data_fim: date (not null)
//   dias: integer (not null)
//   status: text (nullable, default: 'Pendente'::text)
//   data_solicitacao: timestamp with time zone (not null, default: now())
// Table: folha_pagamento
//   id: uuid (not null, default: gen_random_uuid())
//   funcionario_id: uuid (not null)
//   mes: integer (not null)
//   ano: integer (not null)
//   salario_base: numeric (not null)
//   descontos: numeric (not null)
//   adicionais: numeric (not null)
//   salario_liquido: numeric (not null)
//   data_geracao: timestamp with time zone (not null, default: now())
// Table: funcionarios_rh
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   email: text (not null)
//   telefone: text (nullable)
//   cpf: text (nullable)
//   data_admissao: timestamp with time zone (nullable)
//   departamento_id: uuid (nullable)
//   cargo: text (nullable)
//   salario_base: numeric (nullable)
//   status: text (nullable, default: 'Ativo'::text)
//   user_id: uuid (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: projetos
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   responsavel: text (not null)
//   status: text (not null)
//   prazo: timestamp with time zone (nullable)
//   valor: numeric (not null)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   codigo: text (nullable)
//   arquiteto_responsavel: text (nullable)
//   responsavel_obra: text (nullable)
//   cidade: text (nullable)
//   estado: text (nullable)
//   data_entrada: timestamp with time zone (nullable)
// Table: separacao_arquivos
//   id: text (nullable)
//   separacao_id: text (nullable)
//   nome_arquivo: text (nullable)
//   tipo_arquivo: text (nullable)
//   url_arquivo: text (nullable)
//   tamanho_bytes: bigint (nullable)
//   ordem: bigint (nullable)
//   created_at: timestamp with time zone (nullable)
// Table: separacao_itens
//   id: text (nullable)
//   separacao_id: text (nullable)
//   ordem: bigint (nullable)
//   id_lote: text (nullable)
//   codigo_produto: text (nullable)
//   referencia: text (nullable)
//   descricao: text (nullable)
//   quantidade: double precision (nullable)
//   created_at: timestamp with time zone (nullable)
//   local: bigint (nullable)
//   marca: text (nullable)
// Table: separacoes
//   id: text (nullable)
//   cliente: text (nullable)
//   codigo_obra: bigint (nullable)
//   data_entrega: text (nullable)
//   responsavel_recebimento: text (nullable)
//   telefone: text (nullable)
//   endereco: text (nullable)
//   status: text (nullable)
//   material_tipo: text (nullable)
//   material_conteudo: text (nullable)
//   created_at: timestamp with time zone (nullable)
//   updated_at: timestamp with time zone (nullable)
//   solicitante: text (nullable)
//   delivery_type: text (nullable)
//   scheduled_time: text (nullable)
//   order_in_route: text (nullable)
//   observacoes_internas: text (nullable)
//   gestora_equipe: text (nullable)
//   separacoes_parciais: jsonb (nullable)
//   nivel_complexidade: text (nullable)
//   tipo_entrega: text (nullable)
//   transportadora_nome: text (nullable)
//   codigo_rastreamento: text (nullable)
//   numero_venda: jsonb (nullable)
//   numero_entrega: text (nullable)
//   data_inicio_separacao: text (nullable)
//   tipo_pedido: text (nullable)
//   garantia_detalhes: text (nullable)
//   inclui_garantia: boolean (nullable)
//   garantia_peca: text (nullable)
//   garantia_motivo: text (nullable)
// Table: tabela_precos
//   id: uuid (not null, default: gen_random_uuid())
//   servico: text (not null)
//   categoria: text (not null)
//   preco: numeric (not null)
//   vigencia: text (not null)
//   observacao: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: user_roles
//   id: text (nullable)
//   user_id: text (nullable)
//   email: text (nullable)
//   role: text (nullable)
//   nome_completo: text (nullable)
//   created_at: timestamp with time zone (nullable)
//   updated_at: timestamp with time zone (nullable)
// Table: usuarios
//   id: uuid (not null)
//   email: text (not null)
//   nome: text (not null)
//   role: text (not null)
//   created_at: timestamp with time zone (not null, default: now())

// --- CONSTRAINTS ---
// Table: avaliacoes
//   FOREIGN KEY avaliacoes_avaliador_id_fkey: FOREIGN KEY (avaliador_id) REFERENCES usuarios(id) ON DELETE CASCADE
//   FOREIGN KEY avaliacoes_funcionario_id_fkey: FOREIGN KEY (funcionario_id) REFERENCES funcionarios_rh(id) ON DELETE CASCADE
//   PRIMARY KEY avaliacoes_pkey: PRIMARY KEY (id)
//   CHECK avaliacoes_pontualidade_check: CHECK (((pontualidade >= 1) AND (pontualidade <= 5)))
//   CHECK avaliacoes_produtividade_check: CHECK (((produtividade >= 1) AND (produtividade <= 5)))
//   CHECK avaliacoes_qualidade_check: CHECK (((qualidade >= 1) AND (qualidade <= 5)))
//   CHECK avaliacoes_trabalho_equipe_check: CHECK (((trabalho_equipe >= 1) AND (trabalho_equipe <= 5)))
// Table: candidatos
//   PRIMARY KEY candidatos_pkey: PRIMARY KEY (id)
// Table: controle_ponto
//   FOREIGN KEY controle_ponto_funcionario_id_fkey: FOREIGN KEY (funcionario_id) REFERENCES funcionarios_rh(id) ON DELETE CASCADE
//   PRIMARY KEY controle_ponto_pkey: PRIMARY KEY (id)
//   CHECK controle_ponto_status_check: CHECK ((status = ANY (ARRAY['presente'::text, 'ausente'::text, 'atraso'::text])))
// Table: departamentos_rh
//   UNIQUE departamentos_rh_nome_key: UNIQUE (nome)
//   PRIMARY KEY departamentos_rh_pkey: PRIMARY KEY (id)
// Table: ferias
//   FOREIGN KEY ferias_funcionario_id_fkey: FOREIGN KEY (funcionario_id) REFERENCES funcionarios_rh(id) ON DELETE CASCADE
//   PRIMARY KEY ferias_pkey: PRIMARY KEY (id)
// Table: folha_pagamento
//   FOREIGN KEY folha_pagamento_funcionario_id_fkey: FOREIGN KEY (funcionario_id) REFERENCES funcionarios_rh(id) ON DELETE CASCADE
//   CHECK folha_pagamento_mes_check: CHECK (((mes >= 1) AND (mes <= 12)))
//   PRIMARY KEY folha_pagamento_pkey: PRIMARY KEY (id)
// Table: funcionarios_rh
//   FOREIGN KEY funcionarios_rh_departamento_id_fkey: FOREIGN KEY (departamento_id) REFERENCES departamentos_rh(id)
//   PRIMARY KEY funcionarios_rh_pkey: PRIMARY KEY (id)
//   FOREIGN KEY funcionarios_rh_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
// Table: projetos
//   PRIMARY KEY projetos_pkey: PRIMARY KEY (id)
// Table: tabela_precos
//   PRIMARY KEY tabela_precos_pkey: PRIMARY KEY (id)
// Table: usuarios
//   FOREIGN KEY usuarios_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY usuarios_pkey: PRIMARY KEY (id)
//   CHECK usuarios_role_check: CHECK ((role = ANY (ARRAY['admin'::text, 'viewer'::text, 'gerente'::text, 'funcionario'::text])))

// --- ROW LEVEL SECURITY POLICIES ---
// Table: avaliacoes
//   Policy "auth_all_admin_gerente_avaliacoes" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.role = ANY (ARRAY['admin'::text, 'gerente'::text])))))
//   Policy "auth_select_func_avaliacoes" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (funcionario_id IN ( SELECT funcionarios_rh.id    FROM funcionarios_rh   WHERE (funcionarios_rh.user_id = auth.uid())))
// Table: candidatos
//   Policy "candidatos_all_admin_gerente" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.role = ANY (ARRAY['admin'::text, 'gerente'::text])))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.role = ANY (ARRAY['admin'::text, 'gerente'::text])))))
// Table: controle_ponto
//   Policy "ponto_all_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.role = ANY (ARRAY['admin'::text, 'gerente'::text])))))
//   Policy "ponto_insert_own" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (funcionario_id IN ( SELECT funcionarios_rh.id    FROM funcionarios_rh   WHERE (funcionarios_rh.user_id = auth.uid())))
//   Policy "ponto_select_admin" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.role = ANY (ARRAY['admin'::text, 'gerente'::text])))))
//   Policy "ponto_select_own" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (funcionario_id IN ( SELECT funcionarios_rh.id    FROM funcionarios_rh   WHERE (funcionarios_rh.user_id = auth.uid())))
//   Policy "ponto_update_own" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (funcionario_id IN ( SELECT funcionarios_rh.id    FROM funcionarios_rh   WHERE (funcionarios_rh.user_id = auth.uid())))
//     WITH CHECK: (funcionario_id IN ( SELECT funcionarios_rh.id    FROM funcionarios_rh   WHERE (funcionarios_rh.user_id = auth.uid())))
// Table: departamentos_rh
//   Policy "dept_all_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.role = ANY (ARRAY['admin'::text, 'gerente'::text])))))
//   Policy "dept_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: entregas_finalizadas
//   Policy "auth_all_entregas_finalizadas" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: entregas_pendentes
//   Policy "auth_all_entregas_pendentes" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: ferias
//   Policy "ferias_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.role = ANY (ARRAY['admin'::text, 'gerente'::text])))))
//   Policy "ferias_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: ((EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.role = ANY (ARRAY['admin'::text, 'gerente'::text]))))) OR (funcionario_id IN ( SELECT funcionarios_rh.id    FROM funcionarios_rh   WHERE (funcionarios_rh.user_id = auth.uid()))))
//   Policy "ferias_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.role = ANY (ARRAY['admin'::text, 'gerente'::text]))))) OR (funcionario_id IN ( SELECT funcionarios_rh.id    FROM funcionarios_rh   WHERE (funcionarios_rh.user_id = auth.uid()))))
//   Policy "ferias_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.role = ANY (ARRAY['admin'::text, 'gerente'::text]))))) OR (funcionario_id IN ( SELECT funcionarios_rh.id    FROM funcionarios_rh   WHERE (funcionarios_rh.user_id = auth.uid()))))
// Table: folha_pagamento
//   Policy "folha_all_admin_gerente" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.role = ANY (ARRAY['admin'::text, 'gerente'::text])))))
//   Policy "folha_select_own" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (funcionario_id IN ( SELECT funcionarios_rh.id    FROM funcionarios_rh   WHERE (funcionarios_rh.user_id = auth.uid())))
// Table: funcionarios_rh
//   Policy "func_all_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.role = ANY (ARRAY['admin'::text, 'gerente'::text])))))
//   Policy "func_insert_admin_explicit" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.role = 'admin'::text))))
//   Policy "func_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.role = ANY (ARRAY['admin'::text, 'gerente'::text]))))) OR (user_id = auth.uid()))
//   Policy "func_update_admin_explicit" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.role = 'admin'::text))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.role = 'admin'::text))))
// Table: projetos
//   Policy "authenticated_delete_projetos" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert_projetos" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select_projetos" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update_projetos" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: separacao_arquivos
//   Policy "auth_all_separacao_arquivos" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: separacao_itens
//   Policy "auth_all_separacao_itens" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: separacoes
//   Policy "auth_all_separacoes" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: tabela_precos
//   Policy "authenticated_delete_precos" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert_precos" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select_precos" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update_precos" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: user_roles
//   Policy "auth_all_user_roles" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: usuarios
//   Policy "Users can select own profile" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (id = auth.uid())

// --- DATABASE FUNCTIONS ---
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.usuarios (id, email, nome, role)
//     VALUES (
//       NEW.id,
//       NEW.email,
//       COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
//       'viewer'
//     );
//     RETURN NEW;
//   END;
//   $function$
//

// --- INDEXES ---
// Table: departamentos_rh
//   CREATE UNIQUE INDEX departamentos_rh_nome_key ON public.departamentos_rh USING btree (nome)
