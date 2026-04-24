// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      avaliacoes: {
        Row: {
          avaliador_id: string | null
          comentarios: string | null
          created_at: string
          funcionario_id: string
          id: string
          nota: number | null
          periodo: string
        }
        Insert: {
          avaliador_id?: string | null
          comentarios?: string | null
          created_at?: string
          funcionario_id: string
          id?: string
          nota?: number | null
          periodo: string
        }
        Update: {
          avaliador_id?: string | null
          comentarios?: string | null
          created_at?: string
          funcionario_id?: string
          id?: string
          nota?: number | null
          periodo?: string
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_avaliador_id_fkey"
            columns: ["avaliador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      candidatos: {
        Row: {
          cargo_pretendido: string | null
          created_at: string
          curriculo_url: string | null
          departamento_id: string | null
          email: string | null
          id: string
          nome: string
          observacoes: string | null
          status: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cargo_pretendido?: string | null
          created_at?: string
          curriculo_url?: string | null
          departamento_id?: string | null
          email?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cargo_pretendido?: string | null
          created_at?: string
          curriculo_url?: string | null
          departamento_id?: string | null
          email?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidatos_departamento_id_fkey"
            columns: ["departamento_id"]
            isOneToOne: false
            referencedRelation: "departamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias_financeiras: {
        Row: {
          ativo: boolean
          created_at: string
          grupo: string
          icone: string | null
          id: string
          nome: string
          tipo: Database["public"]["Enums"]["transacao_tipo"]
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          grupo: string
          icone?: string | null
          id?: string
          nome: string
          tipo: Database["public"]["Enums"]["transacao_tipo"]
        }
        Update: {
          ativo?: boolean
          created_at?: string
          grupo?: string
          icone?: string | null
          id?: string
          nome?: string
          tipo?: Database["public"]["Enums"]["transacao_tipo"]
        }
        Relationships: []
      }
      contas_bancarias: {
        Row: {
          agencia: string | null
          banco: string | null
          conta: string | null
          created_at: string
          id: string
          nome: string
          saldo: number
          status: string
          tipo: Database["public"]["Enums"]["conta_tipo"]
          updated_at: string
        }
        Insert: {
          agencia?: string | null
          banco?: string | null
          conta?: string | null
          created_at?: string
          id?: string
          nome: string
          saldo?: number
          status?: string
          tipo: Database["public"]["Enums"]["conta_tipo"]
          updated_at?: string
        }
        Update: {
          agencia?: string | null
          banco?: string | null
          conta?: string | null
          created_at?: string
          id?: string
          nome?: string
          saldo?: number
          status?: string
          tipo?: Database["public"]["Enums"]["conta_tipo"]
          updated_at?: string
        }
        Relationships: []
      }
      contatos: {
        Row: {
          ativo: boolean | null
          bairro: string | null
          bairro_comercial: string | null
          celular: string | null
          cep: string | null
          cep_comercial: string | null
          cidade: string | null
          cidade_comercial: string | null
          codigo_legado: number | null
          cpf_cnpj: string | null
          created_at: string | null
          created_by: string | null
          data_nascimento: string | null
          email: string | null
          email_financeiro: string | null
          endereco: string | null
          endereco_comercial: string | null
          especialidade: string | null
          estado: string | null
          estado_comercial: string | null
          id: string
          nome: string
          nome_empresa: string | null
          observacoes: string | null
          rg: string | null
          telefone: string | null
          tipo: Database["public"]["Enums"]["contato_tipo"]
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          bairro?: string | null
          bairro_comercial?: string | null
          celular?: string | null
          cep?: string | null
          cep_comercial?: string | null
          cidade?: string | null
          cidade_comercial?: string | null
          codigo_legado?: number | null
          cpf_cnpj?: string | null
          created_at?: string | null
          created_by?: string | null
          data_nascimento?: string | null
          email?: string | null
          email_financeiro?: string | null
          endereco?: string | null
          endereco_comercial?: string | null
          especialidade?: string | null
          estado?: string | null
          estado_comercial?: string | null
          id?: string
          nome: string
          nome_empresa?: string | null
          observacoes?: string | null
          rg?: string | null
          telefone?: string | null
          tipo: Database["public"]["Enums"]["contato_tipo"]
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          bairro?: string | null
          bairro_comercial?: string | null
          celular?: string | null
          cep?: string | null
          cep_comercial?: string | null
          cidade?: string | null
          cidade_comercial?: string | null
          codigo_legado?: number | null
          cpf_cnpj?: string | null
          created_at?: string | null
          created_by?: string | null
          data_nascimento?: string | null
          email?: string | null
          email_financeiro?: string | null
          endereco?: string | null
          endereco_comercial?: string | null
          especialidade?: string | null
          estado?: string | null
          estado_comercial?: string | null
          id?: string
          nome?: string
          nome_empresa?: string | null
          observacoes?: string | null
          rg?: string | null
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["contato_tipo"]
          updated_at?: string | null
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
          justificativa: string | null
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
          justificativa?: string | null
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
          justificativa?: string | null
          status?: string | null
          total_horas?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "controle_ponto_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      custos_recorrentes: {
        Row: {
          ativo: boolean
          categoria_id: string | null
          conta_id: string | null
          created_at: string
          created_by: string | null
          data_fim: string | null
          data_inicio: string
          descricao: string
          dia_vencimento: number | null
          frequencia: Database["public"]["Enums"]["frequencia_tipo"]
          id: string
          updated_at: string
          valor: number
        }
        Insert: {
          ativo?: boolean
          categoria_id?: string | null
          conta_id?: string | null
          created_at?: string
          created_by?: string | null
          data_fim?: string | null
          data_inicio: string
          descricao: string
          dia_vencimento?: number | null
          frequencia?: Database["public"]["Enums"]["frequencia_tipo"]
          id?: string
          updated_at?: string
          valor: number
        }
        Update: {
          ativo?: boolean
          categoria_id?: string | null
          conta_id?: string | null
          created_at?: string
          created_by?: string | null
          data_fim?: string | null
          data_inicio?: string
          descricao?: string
          dia_vencimento?: number | null
          frequencia?: Database["public"]["Enums"]["frequencia_tipo"]
          id?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "custos_recorrentes_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_financeiras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custos_recorrentes_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custos_recorrentes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      custos_recorrentes_lancamentos: {
        Row: {
          competencia: string
          created_at: string
          custo_id: string
          data_pagamento: string | null
          data_vencimento: string
          desconto: number
          id: string
          juros: number
          multa: number
          status: Database["public"]["Enums"]["lancamento_status"]
          transacao_id: string | null
          valor_original: number
          valor_pago: number | null
        }
        Insert: {
          competencia: string
          created_at?: string
          custo_id: string
          data_pagamento?: string | null
          data_vencimento: string
          desconto?: number
          id?: string
          juros?: number
          multa?: number
          status?: Database["public"]["Enums"]["lancamento_status"]
          transacao_id?: string | null
          valor_original: number
          valor_pago?: number | null
        }
        Update: {
          competencia?: string
          created_at?: string
          custo_id?: string
          data_pagamento?: string | null
          data_vencimento?: string
          desconto?: number
          id?: string
          juros?: number
          multa?: number
          status?: Database["public"]["Enums"]["lancamento_status"]
          transacao_id?: string | null
          valor_original?: number
          valor_pago?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "custos_recorrentes_lancamentos_custo_id_fkey"
            columns: ["custo_id"]
            isOneToOne: false
            referencedRelation: "custos_recorrentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custos_recorrentes_lancamentos_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "transacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      departamentos: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      entregas: {
        Row: {
          avaliacao: number | null
          comprovante_url: string | null
          contato_destino: string | null
          created_at: string
          data_entrega: string | null
          data_prevista: string | null
          delivery_type: string
          endereco_entrega: string | null
          entregador_id: string | null
          id: string
          observacoes: string | null
          projeto_id: string | null
          scheduled_time: string | null
          separacao_id: string | null
          status: Database["public"]["Enums"]["entrega_status"]
          updated_at: string
        }
        Insert: {
          avaliacao?: number | null
          comprovante_url?: string | null
          contato_destino?: string | null
          created_at?: string
          data_entrega?: string | null
          data_prevista?: string | null
          delivery_type?: string
          endereco_entrega?: string | null
          entregador_id?: string | null
          id?: string
          observacoes?: string | null
          projeto_id?: string | null
          scheduled_time?: string | null
          separacao_id?: string | null
          status?: Database["public"]["Enums"]["entrega_status"]
          updated_at?: string
        }
        Update: {
          avaliacao?: number | null
          comprovante_url?: string | null
          contato_destino?: string | null
          created_at?: string
          data_entrega?: string | null
          data_prevista?: string | null
          delivery_type?: string
          endereco_entrega?: string | null
          entregador_id?: string | null
          id?: string
          observacoes?: string | null
          projeto_id?: string | null
          scheduled_time?: string | null
          separacao_id?: string | null
          status?: Database["public"]["Enums"]["entrega_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "entregas_entregador_id_fkey"
            columns: ["entregador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "entregas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_por_projeto"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "entregas_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "separacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["separacao_id"]
          },
          {
            foreignKeyName: "entregas_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["separacao_id"]
          },
          {
            foreignKeyName: "entregas_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["separacao_id"]
          },
          {
            foreignKeyName: "entregas_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_por_projeto"
            referencedColumns: ["separacao_id"]
          },
        ]
      }
      estoque_itens: {
        Row: {
          atualizado_em: string
          atualizado_por: string | null
          id: string
          local: Database["public"]["Enums"]["estoque_local"]
          produto_id: string
          quantidade: number
        }
        Insert: {
          atualizado_em?: string
          atualizado_por?: string | null
          id?: string
          local?: Database["public"]["Enums"]["estoque_local"]
          produto_id: string
          quantidade?: number
        }
        Update: {
          atualizado_em?: string
          atualizado_por?: string | null
          id?: string
          local?: Database["public"]["Enums"]["estoque_local"]
          produto_id?: string
          quantidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "estoque_itens_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_por_projeto"
            referencedColumns: ["produto_id"]
          },
        ]
      }
      ferias: {
        Row: {
          aprovado_por: string | null
          created_at: string
          data_fim: string
          data_inicio: string
          dias: number
          funcionario_id: string
          id: string
          observacoes: string | null
          status: string
        }
        Insert: {
          aprovado_por?: string | null
          created_at?: string
          data_fim: string
          data_inicio: string
          dias?: number
          funcionario_id: string
          id?: string
          observacoes?: string | null
          status?: string
        }
        Update: {
          aprovado_por?: string | null
          created_at?: string
          data_fim?: string
          data_inicio?: string
          dias?: number
          funcionario_id?: string
          id?: string
          observacoes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ferias_aprovado_por_fkey"
            columns: ["aprovado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ferias_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
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
          adicionais?: number
          ano: number
          data_geracao?: string
          descontos?: number
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
            foreignKeyName: "folha_pagamento_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios: {
        Row: {
          cargo: string | null
          cpf: string | null
          created_at: string
          data_admissao: string | null
          data_demissao: string | null
          departamento_id: string | null
          email: string
          id: string
          nome: string
          rg: string | null
          salario_base: number | null
          status: string
          telefone: string | null
          updated_at: string
          usuario_id: string | null
        }
        Insert: {
          cargo?: string | null
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          data_demissao?: string | null
          departamento_id?: string | null
          email: string
          id?: string
          nome: string
          rg?: string | null
          salario_base?: number | null
          status?: string
          telefone?: string | null
          updated_at?: string
          usuario_id?: string | null
        }
        Update: {
          cargo?: string | null
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          data_demissao?: string | null
          departamento_id?: string | null
          email?: string
          id?: string
          nome?: string
          rg?: string | null
          salario_base?: number | null
          status?: string
          telefone?: string | null
          updated_at?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funcionarios_departamento_id_fkey"
            columns: ["departamento_id"]
            isOneToOne: false
            referencedRelation: "departamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funcionarios_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      marcas: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      produtos: {
        Row: {
          ativo: boolean
          categoria: string | null
          created_at: string
          id: string
          marca_id: string | null
          nome: string
          preco_custo: number | null
          preco_venda: number | null
          sku: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria?: string | null
          created_at?: string
          id?: string
          marca_id?: string | null
          nome: string
          preco_custo?: number | null
          preco_venda?: number | null
          sku?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria?: string | null
          created_at?: string
          id?: string
          marca_id?: string | null
          nome?: string
          preco_custo?: number | null
          preco_venda?: number | null
          sku?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "produtos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
        ]
      }
      projeto_itens: {
        Row: {
          created_at: string
          desconto: number
          descricao: string
          id: string
          preco_unitario: number
          produto_id: string | null
          projeto_id: string
          quantidade: number
          subtotal: number | null
          updated_at: string
          validado: boolean
        }
        Insert: {
          created_at?: string
          desconto?: number
          descricao: string
          id?: string
          preco_unitario: number
          produto_id?: string | null
          projeto_id: string
          quantidade: number
          subtotal?: number | null
          updated_at?: string
          validado?: boolean
        }
        Update: {
          created_at?: string
          desconto?: number
          descricao?: string
          id?: string
          preco_unitario?: number
          produto_id?: string | null
          projeto_id?: string
          quantidade?: number
          subtotal?: number | null
          updated_at?: string
          validado?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_por_projeto"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "projeto_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_por_projeto"
            referencedColumns: ["projeto_id"]
          },
        ]
      }
      projeto_parcelas: {
        Row: {
          comprovante_url: string | null
          created_at: string | null
          data_fechamento: string | null
          data_pagamento: string | null
          data_vencimento: string | null
          desconto: number
          descricao: string | null
          forma_pagamento: Database["public"]["Enums"]["pagamento_forma"] | null
          id: string
          juros: number
          multa: number
          numero_parcela: number
          observacoes: string | null
          projeto_id: string
          status: Database["public"]["Enums"]["parcela_status"]
          transacao_id: string | null
          valor: number
          valor_pago: number | null
        }
        Insert: {
          comprovante_url?: string | null
          created_at?: string | null
          data_fechamento?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          desconto?: number
          descricao?: string | null
          forma_pagamento?:
            | Database["public"]["Enums"]["pagamento_forma"]
            | null
          id?: string
          juros?: number
          multa?: number
          numero_parcela: number
          observacoes?: string | null
          projeto_id: string
          status?: Database["public"]["Enums"]["parcela_status"]
          transacao_id?: string | null
          valor: number
          valor_pago?: number | null
        }
        Update: {
          comprovante_url?: string | null
          created_at?: string | null
          data_fechamento?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          desconto?: number
          descricao?: string | null
          forma_pagamento?:
            | Database["public"]["Enums"]["pagamento_forma"]
            | null
          id?: string
          juros?: number
          multa?: number
          numero_parcela?: number
          observacoes?: string | null
          projeto_id?: string
          status?: Database["public"]["Enums"]["parcela_status"]
          transacao_id?: string | null
          valor?: number
          valor_pago?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projeto_parcelas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_parcelas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_parcelas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_parcelas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "projeto_parcelas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_por_projeto"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "projeto_parcelas_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "transacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      projeto_sinal: {
        Row: {
          comprovante_url: string | null
          created_at: string
          data_pagamento: string | null
          forma_pagamento: Database["public"]["Enums"]["pagamento_forma"] | null
          id: string
          observacoes: string | null
          projeto_id: string
          status: Database["public"]["Enums"]["sinal_status"]
          transacao_id: string | null
          updated_at: string
          valor: number
        }
        Insert: {
          comprovante_url?: string | null
          created_at?: string
          data_pagamento?: string | null
          forma_pagamento?:
            | Database["public"]["Enums"]["pagamento_forma"]
            | null
          id?: string
          observacoes?: string | null
          projeto_id: string
          status?: Database["public"]["Enums"]["sinal_status"]
          transacao_id?: string | null
          updated_at?: string
          valor: number
        }
        Update: {
          comprovante_url?: string | null
          created_at?: string
          data_pagamento?: string | null
          forma_pagamento?:
            | Database["public"]["Enums"]["pagamento_forma"]
            | null
          id?: string
          observacoes?: string | null
          projeto_id?: string
          status?: Database["public"]["Enums"]["sinal_status"]
          transacao_id?: string | null
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "projeto_sinal_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: true
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_sinal_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: true
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_sinal_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: true
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_sinal_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: true
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "projeto_sinal_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: true
            referencedRelation: "vw_vendas_por_projeto"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "projeto_sinal_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "transacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      projetos: {
        Row: {
          arquiteto_id: string | null
          arquivado: boolean | null
          caminho: string | null
          cidade: string | null
          cliente_id: string | null
          codigo: string
          created_at: string | null
          created_by: string | null
          data_entrada: string | null
          data_vencimento: string | null
          estado: string | null
          forma_pagamento: Database["public"]["Enums"]["pagamento_forma"] | null
          historico: Json
          id: string
          nivel_estrategico: Database["public"]["Enums"]["projeto_nivel"] | null
          nome: string
          responsavel_id: string | null
          responsavel_nome: string | null
          responsavel_obra_id: string | null
          status: Database["public"]["Enums"]["projeto_status"] | null
          tipo_item: string | null
          total_parcelas: number | null
          updated_at: string
          valor_total: number | null
        }
        Insert: {
          arquiteto_id?: string | null
          arquivado?: boolean | null
          caminho?: string | null
          cidade?: string | null
          cliente_id?: string | null
          codigo: string
          created_at?: string | null
          created_by?: string | null
          data_entrada?: string | null
          data_vencimento?: string | null
          estado?: string | null
          forma_pagamento?:
            | Database["public"]["Enums"]["pagamento_forma"]
            | null
          historico?: Json
          id?: string
          nivel_estrategico?:
            | Database["public"]["Enums"]["projeto_nivel"]
            | null
          nome: string
          responsavel_id?: string | null
          responsavel_nome?: string | null
          responsavel_obra_id?: string | null
          status?: Database["public"]["Enums"]["projeto_status"] | null
          tipo_item?: string | null
          total_parcelas?: number | null
          updated_at?: string
          valor_total?: number | null
        }
        Update: {
          arquiteto_id?: string | null
          arquivado?: boolean | null
          caminho?: string | null
          cidade?: string | null
          cliente_id?: string | null
          codigo?: string
          created_at?: string | null
          created_by?: string | null
          data_entrada?: string | null
          data_vencimento?: string | null
          estado?: string | null
          forma_pagamento?:
            | Database["public"]["Enums"]["pagamento_forma"]
            | null
          historico?: Json
          id?: string
          nivel_estrategico?:
            | Database["public"]["Enums"]["projeto_nivel"]
            | null
          nome?: string
          responsavel_id?: string | null
          responsavel_nome?: string | null
          responsavel_obra_id?: string | null
          status?: Database["public"]["Enums"]["projeto_status"] | null
          tipo_item?: string | null
          total_parcelas?: number | null
          updated_at?: string
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projetos_arquiteto_id_fkey"
            columns: ["arquiteto_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_responsavel_obra_id_fkey"
            columns: ["responsavel_obra_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
        ]
      }
      projetos_fechados: {
        Row: {
          cod: string | null
          created_at: string | null
          data_fechamento: string | null
          id: string
          valor_fechado: number | null
        }
        Insert: {
          cod?: string | null
          created_at?: string | null
          data_fechamento?: string | null
          id?: string
          valor_fechado?: number | null
        }
        Update: {
          cod?: string | null
          created_at?: string | null
          data_fechamento?: string | null
          id?: string
          valor_fechado?: number | null
        }
        Relationships: []
      }
      separacao_arquivos: {
        Row: {
          created_at: string
          id: string
          nome: string
          separacao_id: string
          tamanho_kb: number | null
          tipo_mime: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          separacao_id: string
          tamanho_kb?: number | null
          tipo_mime?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          separacao_id?: string
          tamanho_kb?: number | null
          tipo_mime?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "separacao_arquivos_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "separacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacao_arquivos_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["separacao_id"]
          },
          {
            foreignKeyName: "separacao_arquivos_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["separacao_id"]
          },
          {
            foreignKeyName: "separacao_arquivos_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["separacao_id"]
          },
          {
            foreignKeyName: "separacao_arquivos_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_por_projeto"
            referencedColumns: ["separacao_id"]
          },
        ]
      }
      separacao_itens: {
        Row: {
          created_at: string
          descricao: string
          id: string
          observacoes: string | null
          produto_id: string | null
          quantidade: number
          separacao_id: string
          separado: boolean
          unidade: string | null
        }
        Insert: {
          created_at?: string
          descricao: string
          id?: string
          observacoes?: string | null
          produto_id?: string | null
          quantidade?: number
          separacao_id: string
          separado?: boolean
          unidade?: string | null
        }
        Update: {
          created_at?: string
          descricao?: string
          id?: string
          observacoes?: string | null
          produto_id?: string | null
          quantidade?: number
          separacao_id?: string
          separado?: boolean
          unidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "separacao_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacao_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_liquido"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "separacao_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "separacao_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_por_projeto"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "separacao_itens_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "separacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacao_itens_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["separacao_id"]
          },
          {
            foreignKeyName: "separacao_itens_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["separacao_id"]
          },
          {
            foreignKeyName: "separacao_itens_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_loja"
            referencedColumns: ["separacao_id"]
          },
          {
            foreignKeyName: "separacao_itens_separacao_id_fkey"
            columns: ["separacao_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_por_projeto"
            referencedColumns: ["separacao_id"]
          },
        ]
      }
      separacoes: {
        Row: {
          cliente: string | null
          cliente_id: string | null
          codigo_obra: string | null
          created_at: string
          data_entrega: string | null
          data_entrega_original: string | null
          delivery_type: string | null
          endereco_entrega: string | null
          id: string
          observacoes: string | null
          projeto_id: string | null
          reagendamentos: number
          responsavel_id: string | null
          scheduled_time: string | null
          status: Database["public"]["Enums"]["separacao_status"]
          updated_at: string
        }
        Insert: {
          cliente?: string | null
          cliente_id?: string | null
          codigo_obra?: string | null
          created_at?: string
          data_entrega?: string | null
          data_entrega_original?: string | null
          delivery_type?: string | null
          endereco_entrega?: string | null
          id?: string
          observacoes?: string | null
          projeto_id?: string | null
          reagendamentos?: number
          responsavel_id?: string | null
          scheduled_time?: string | null
          status?: Database["public"]["Enums"]["separacao_status"]
          updated_at?: string
        }
        Update: {
          cliente?: string | null
          cliente_id?: string | null
          codigo_obra?: string | null
          created_at?: string
          data_entrega?: string | null
          data_entrega_original?: string | null
          delivery_type?: string | null
          endereco_entrega?: string | null
          id?: string
          observacoes?: string | null
          projeto_id?: string | null
          reagendamentos?: number
          responsavel_id?: string | null
          scheduled_time?: string | null
          status?: Database["public"]["Enums"]["separacao_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "separacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "separacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "separacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_por_projeto"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "separacoes_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes_compra: {
        Row: {
          aprovador_id: string | null
          categoria_id: string | null
          comprovante_url: string | null
          created_at: string
          data_aprovacao: string | null
          data_compra: string | null
          descricao: string
          id: string
          justificativa: string | null
          observacoes: string | null
          projeto_id: string | null
          solicitante_id: string
          status: Database["public"]["Enums"]["solicitacao_status"]
          transacao_id: string | null
          updated_at: string
          valor_aprovado: number | null
          valor_estimado: number
        }
        Insert: {
          aprovador_id?: string | null
          categoria_id?: string | null
          comprovante_url?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_compra?: string | null
          descricao: string
          id?: string
          justificativa?: string | null
          observacoes?: string | null
          projeto_id?: string | null
          solicitante_id: string
          status?: Database["public"]["Enums"]["solicitacao_status"]
          transacao_id?: string | null
          updated_at?: string
          valor_aprovado?: number | null
          valor_estimado: number
        }
        Update: {
          aprovador_id?: string | null
          categoria_id?: string | null
          comprovante_url?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_compra?: string | null
          descricao?: string
          id?: string
          justificativa?: string | null
          observacoes?: string | null
          projeto_id?: string | null
          solicitante_id?: string
          status?: Database["public"]["Enums"]["solicitacao_status"]
          transacao_id?: string | null
          updated_at?: string
          valor_aprovado?: number | null
          valor_estimado?: number
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_compra_aprovador_id_fkey"
            columns: ["aprovador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_financeiras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_por_projeto"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_compra_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "transacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_history: {
        Row: {
          created_at: string | null
          executado_por: string | null
          id: number
          mensagem: string | null
          origem: string | null
          registros_atualizados: number
          registros_erro: number
          registros_inseridos: number
          status: string | null
          tipo: string | null
        }
        Insert: {
          created_at?: string | null
          executado_por?: string | null
          id?: never
          mensagem?: string | null
          origem?: string | null
          registros_atualizados?: number
          registros_erro?: number
          registros_inseridos?: number
          status?: string | null
          tipo?: string | null
        }
        Update: {
          created_at?: string | null
          executado_por?: string | null
          id?: never
          mensagem?: string | null
          origem?: string | null
          registros_atualizados?: number
          registros_erro?: number
          registros_inseridos?: number
          status?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sync_history_executado_por_fkey"
            columns: ["executado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      transacoes: {
        Row: {
          categoria_id: string | null
          comprovante_url: string | null
          conta_id: string
          created_at: string
          created_by: string | null
          data_transacao: string
          descricao: string
          id: string
          parcela_id: string | null
          projeto_id: string | null
          tipo: Database["public"]["Enums"]["transacao_tipo"]
          valor: number
        }
        Insert: {
          categoria_id?: string | null
          comprovante_url?: string | null
          conta_id: string
          created_at?: string
          created_by?: string | null
          data_transacao: string
          descricao: string
          id?: string
          parcela_id?: string | null
          projeto_id?: string | null
          tipo: Database["public"]["Enums"]["transacao_tipo"]
          valor: number
        }
        Update: {
          categoria_id?: string | null
          comprovante_url?: string | null
          conta_id?: string
          created_at?: string
          created_by?: string | null
          data_transacao?: string
          descricao?: string
          id?: string
          parcela_id?: string | null
          projeto_id?: string | null
          tipo?: Database["public"]["Enums"]["transacao_tipo"]
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_financeiras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_parcela_id_fkey"
            columns: ["parcela_id"]
            isOneToOne: false
            referencedRelation: "projeto_parcelas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_financeiro_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_projetos_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_separacoes_agenda"
            referencedColumns: ["projeto_id"]
          },
          {
            foreignKeyName: "transacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vw_vendas_por_projeto"
            referencedColumns: ["projeto_id"]
          },
        ]
      }
      usuarios: {
        Row: {
          ativo: boolean | null
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          nome: string
          role: Database["public"]["Enums"]["usuario_role"] | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id: string
          nome: string
          role?: Database["public"]["Enums"]["usuario_role"] | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          role?: Database["public"]["Enums"]["usuario_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vendas_marca: {
        Row: {
          ano: number
          created_at: string
          id: string
          marca_id: string
          mes: number
          valor_custo: number
          valor_venda: number
        }
        Insert: {
          ano: number
          created_at?: string
          id?: string
          marca_id: string
          mes: number
          valor_custo?: number
          valor_venda?: number
        }
        Update: {
          ano?: number
          created_at?: string
          id?: string
          marca_id?: string
          mes?: number
          valor_custo?: number
          valor_venda?: number
        }
        Relationships: [
          {
            foreignKeyName: "vendas_marca_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      vw_custos_pendentes_mes: {
        Row: {
          categoria: string | null
          conta: string | null
          data_vencimento: string | null
          descricao: string | null
          status: Database["public"]["Enums"]["lancamento_status"] | null
          valor_original: number | null
        }
        Relationships: []
      }
      vw_estoque_liquido: {
        Row: {
          alerta_estoque: string | null
          categoria: string | null
          marca: string | null
          preco_custo: number | null
          preco_venda: number | null
          produto: string | null
          produto_id: string | null
          qtd_disponivel: number | null
          qtd_em_transito: number | null
          qtd_fisico: number | null
          qtd_reservado: number | null
          qtd_showroom: number | null
          sku: string | null
          valor_estoque_total: number | null
          valor_reservado_total: number | null
        }
        Relationships: []
      }
      vw_estoque_por_marca: {
        Row: {
          marca: string | null
          qtd_estoque: number | null
          qtd_showroom: number | null
          skus_total: number | null
          valor_disponivel_venda: number | null
        }
        Relationships: []
      }
      vw_financeiro_projetos: {
        Row: {
          arquiteto_nome: string | null
          cliente_nome: string | null
          codigo: string | null
          despesas: number | null
          id: string | null
          nome: string | null
          receitas: number | null
          status: Database["public"]["Enums"]["projeto_status"] | null
          valor_parcelas: number | null
          valor_total: number | null
        }
        Relationships: []
      }
      vw_fluxo_caixa_projetado: {
        Row: {
          a_receber: number | null
          atrasado: number | null
          mes: string | null
          qtd_atrasado: number | null
          qtd_pendente: number | null
          recebido: number | null
        }
        Relationships: []
      }
      vw_projetos_pipeline: {
        Row: {
          arquiteto: string | null
          arquivado: boolean | null
          cidade: string | null
          cliente: string | null
          codigo: string | null
          created_at: string | null
          data_entrada: string | null
          data_entrega: string | null
          estado: string | null
          forma_pagamento: Database["public"]["Enums"]["pagamento_forma"] | null
          id: string | null
          itens_validados: number | null
          nivel_estrategico: Database["public"]["Enums"]["projeto_nivel"] | null
          nome: string | null
          reagendamentos: number | null
          responsavel_nome: string | null
          saldo_a_receber: number | null
          separacao_id: string | null
          separacao_status:
            | Database["public"]["Enums"]["separacao_status"]
            | null
          sinal_data: string | null
          sinal_status: Database["public"]["Enums"]["sinal_status"] | null
          sinal_valor: number | null
          status: Database["public"]["Enums"]["projeto_status"] | null
          total_itens: number | null
          total_parcelas: number | null
          updated_at: string | null
          valor_itens: number | null
          valor_total: number | null
        }
        Relationships: []
      }
      vw_projetos_por_status: {
        Row: {
          ativos: number | null
          status: Database["public"]["Enums"]["projeto_status"] | null
          total: number | null
          valor_total_sum: number | null
        }
        Relationships: []
      }
      vw_rh_resumo: {
        Row: {
          ativos: number | null
          departamento: string | null
          folha_total: number | null
          salario_medio: number | null
          total_funcionarios: number | null
        }
        Relationships: []
      }
      vw_separacoes_agenda: {
        Row: {
          cliente: string | null
          cliente_nome: string | null
          codigo_obra: string | null
          created_at: string | null
          data_entrega: string | null
          data_entrega_original: string | null
          delivery_type: string | null
          dias_ate_entrega: number | null
          endereco_entrega: string | null
          entrega_id: string | null
          entrega_status: Database["public"]["Enums"]["entrega_status"] | null
          entregador_id: string | null
          entregador_nome: string | null
          itens_separados: number | null
          observacoes: string | null
          projeto_codigo: string | null
          projeto_id: string | null
          projeto_nome: string | null
          projeto_status: Database["public"]["Enums"]["projeto_status"] | null
          reagendamentos: number | null
          scheduled_time: string | null
          separacao_id: string | null
          separacao_status:
            | Database["public"]["Enums"]["separacao_status"]
            | null
          total_itens: number | null
          updated_at: string | null
          urgencia: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entregas_entregador_id_fkey"
            columns: ["entregador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_vendas_loja: {
        Row: {
          categoria: string | null
          cliente: string | null
          data_venda: string | null
          marca: string | null
          margem_total: number | null
          observacoes: string | null
          preco_custo: number | null
          preco_venda: number | null
          produto: string | null
          produto_id: string | null
          quantidade: number | null
          separacao_id: string | null
          sku: string | null
        }
        Relationships: []
      }
      vw_vendas_por_projeto: {
        Row: {
          categoria: string | null
          cliente: string | null
          data_separacao: string | null
          marca: string | null
          margem_total: number | null
          preco_custo: number | null
          preco_venda: number | null
          produto: string | null
          produto_id: string | null
          projeto_cidade: string | null
          projeto_codigo: string | null
          projeto_estado: string | null
          projeto_id: string | null
          projeto_nome: string | null
          projeto_status: Database["public"]["Enums"]["projeto_status"] | null
          quantidade: number | null
          separacao_id: string | null
          sku: string | null
        }
        Relationships: []
      }
      vw_vendas_produtos: {
        Row: {
          categoria: string | null
          cliente: string | null
          data_venda: string | null
          marca: string | null
          margem_total: number | null
          origem: string | null
          preco_custo: number | null
          preco_venda: number | null
          produto: string | null
          produto_id: string | null
          projeto_codigo: string | null
          projeto_nome: string | null
          quantidade: number | null
          sku: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      criar_usuario: {
        Args: {
          p_email: string
          p_nome: string
          p_password: string
          p_role?: Database["public"]["Enums"]["usuario_role"]
        }
        Returns: string
      }
      stats_datacenter: { Args: never; Returns: Json }
    }
    Enums: {
      conta_tipo: "Corrente" | "Poupança" | "CDB" | "Investimento" | "Caixa"
      contato_tipo:
        | "cliente"
        | "arquiteto"
        | "engenheiro"
        | "eletricista"
        | "fornecedor"
        | "outro"
      entrega_status: "Pendente" | "Em rota" | "Entregue" | "Cancelado"
      estoque_local: "Estoque" | "Showroom" | "Em trânsito" | "Reservado"
      frequencia_tipo: "mensal" | "trimestral" | "semestral" | "anual"
      lancamento_status: "pendente" | "pago" | "cancelado"
      pagamento_forma: "pix" | "cartao" | "boleto" | "transferencia" | "cheque"
      parcela_status: "pendente" | "paga" | "atrasada" | "cancelada"
      projeto_nivel: "1" | "2" | "3" | "4"
      projeto_status:
        | "Estudo Inicial"
        | "Proposta Sinal"
        | "Elaboração Orçamento"
        | "Informações necessárias"
        | "Projeto executivo"
        | "Entrega materiais"
        | "Ajustes finais"
        | "Finalizado"
        | "Arquivado"
      separacao_status:
        | "Rascunho"
        | "Pendente"
        | "Em separação"
        | "Pronto"
        | "Enviado"
        | "Cancelado"
      sinal_status: "pendente" | "recebido" | "creditado" | "receita_servico"
      solicitacao_status:
        | "pendente"
        | "aprovada"
        | "rejeitada"
        | "comprada"
        | "cancelada"
      transacao_tipo: "receita" | "despesa" | "transferencia"
      usuario_role: "admin" | "gerente" | "operador" | "funcionario" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      conta_tipo: ["Corrente", "Poupança", "CDB", "Investimento", "Caixa"],
      contato_tipo: [
        "cliente",
        "arquiteto",
        "engenheiro",
        "eletricista",
        "fornecedor",
        "outro",
      ],
      entrega_status: ["Pendente", "Em rota", "Entregue", "Cancelado"],
      estoque_local: ["Estoque", "Showroom", "Em trânsito", "Reservado"],
      frequencia_tipo: ["mensal", "trimestral", "semestral", "anual"],
      lancamento_status: ["pendente", "pago", "cancelado"],
      pagamento_forma: ["pix", "cartao", "boleto", "transferencia", "cheque"],
      parcela_status: ["pendente", "paga", "atrasada", "cancelada"],
      projeto_nivel: ["1", "2", "3", "4"],
      projeto_status: [
        "Estudo Inicial",
        "Proposta Sinal",
        "Elaboração Orçamento",
        "Informações necessárias",
        "Projeto executivo",
        "Entrega materiais",
        "Ajustes finais",
        "Finalizado",
        "Arquivado",
      ],
      separacao_status: [
        "Rascunho",
        "Pendente",
        "Em separação",
        "Pronto",
        "Enviado",
        "Cancelado",
      ],
      sinal_status: ["pendente", "recebido", "creditado", "receita_servico"],
      solicitacao_status: [
        "pendente",
        "aprovada",
        "rejeitada",
        "comprada",
        "cancelada",
      ],
      transacao_tipo: ["receita", "despesa", "transferencia"],
      usuario_role: ["admin", "gerente", "operador", "funcionario", "viewer"],
    },
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
//   avaliador_id: uuid (nullable)
//   periodo: text (not null)
//   nota: numeric (nullable)
//   comentarios: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: candidatos
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   email: text (nullable)
//   telefone: character varying (nullable)
//   cargo_pretendido: text (nullable)
//   departamento_id: uuid (nullable)
//   status: text (not null, default: 'Em análise'::text)
//   curriculo_url: text (nullable)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: categorias_financeiras
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   tipo: transacao_tipo (not null)
//   grupo: text (not null)
//   icone: text (nullable)
//   ativo: boolean (not null, default: true)
//   created_at: timestamp with time zone (not null, default: now())
// Table: contas_bancarias
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   tipo: conta_tipo (not null)
//   saldo: numeric (not null, default: 0)
//   banco: text (nullable)
//   agencia: character varying (nullable)
//   conta: character varying (nullable)
//   status: text (not null, default: 'Ativa'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: contatos
//   id: uuid (not null, default: gen_random_uuid())
//   codigo_legado: bigint (nullable)
//   tipo: contato_tipo (not null)
//   nome: text (not null)
//   nome_empresa: text (nullable)
//   cpf_cnpj: character varying (nullable)
//   rg: character varying (nullable)
//   email: character varying (nullable)
//   email_financeiro: character varying (nullable)
//   telefone: character varying (nullable)
//   celular: character varying (nullable)
//   endereco: text (nullable)
//   bairro: character varying (nullable)
//   cep: character varying (nullable)
//   cidade: character varying (nullable)
//   estado: character varying (nullable)
//   data_nascimento: date (nullable)
//   observacoes: text (nullable)
//   ativo: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
//   created_by: uuid (nullable)
//   endereco_comercial: text (nullable)
//   bairro_comercial: character varying (nullable)
//   cep_comercial: character varying (nullable)
//   cidade_comercial: character varying (nullable)
//   estado_comercial: character varying (nullable)
//   especialidade: text (nullable)
//   updated_at: timestamp with time zone (nullable)
// Table: controle_ponto
//   id: uuid (not null, default: gen_random_uuid())
//   funcionario_id: uuid (not null)
//   data: date (not null)
//   hora_entrada: time without time zone (nullable)
//   hora_saida: time without time zone (nullable)
//   total_horas: numeric (nullable)
//   status: text (nullable)
//   justificativa: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: custos_recorrentes
//   id: uuid (not null, default: gen_random_uuid())
//   categoria_id: uuid (nullable)
//   conta_id: uuid (nullable)
//   descricao: text (not null)
//   valor: numeric (not null)
//   dia_vencimento: integer (nullable)
//   frequencia: frequencia_tipo (not null, default: 'mensal'::frequencia_tipo)
//   data_inicio: date (not null)
//   data_fim: date (nullable)
//   ativo: boolean (not null, default: true)
//   created_by: uuid (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: custos_recorrentes_lancamentos
//   id: uuid (not null, default: gen_random_uuid())
//   custo_id: uuid (not null)
//   competencia: date (not null)
//   data_vencimento: date (not null)
//   data_pagamento: date (nullable)
//   valor_original: numeric (not null)
//   valor_pago: numeric (nullable)
//   juros: numeric (not null, default: 0)
//   multa: numeric (not null, default: 0)
//   desconto: numeric (not null, default: 0)
//   status: lancamento_status (not null, default: 'pendente'::lancamento_status)
//   transacao_id: uuid (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: departamentos
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   descricao: text (nullable)
//   ativo: boolean (not null, default: true)
//   created_at: timestamp with time zone (not null, default: now())
// Table: entregas
//   id: uuid (not null, default: gen_random_uuid())
//   separacao_id: uuid (nullable)
//   projeto_id: uuid (nullable)
//   entregador_id: uuid (nullable)
//   endereco_entrega: text (nullable)
//   contato_destino: text (nullable)
//   delivery_type: text (not null, default: 'flexible'::text)
//   scheduled_time: time without time zone (nullable)
//   data_prevista: date (nullable)
//   data_entrega: date (nullable)
//   status: entrega_status (not null, default: 'Pendente'::entrega_status)
//   comprovante_url: text (nullable)
//   avaliacao: integer (nullable)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: estoque_itens
//   id: uuid (not null, default: gen_random_uuid())
//   produto_id: uuid (not null)
//   local: estoque_local (not null, default: 'Estoque'::estoque_local)
//   quantidade: numeric (not null, default: 0)
//   atualizado_por: uuid (nullable)
//   atualizado_em: timestamp with time zone (not null, default: now())
// Table: ferias
//   id: uuid (not null, default: gen_random_uuid())
//   funcionario_id: uuid (not null)
//   data_inicio: date (not null)
//   data_fim: date (not null)
//   dias: integer (not null)
//   status: text (not null, default: 'Pendente'::text)
//   aprovado_por: uuid (nullable)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: folha_pagamento
//   id: uuid (not null, default: gen_random_uuid())
//   funcionario_id: uuid (not null)
//   mes: integer (not null)
//   ano: integer (not null)
//   salario_base: numeric (not null)
//   descontos: numeric (not null, default: 0)
//   adicionais: numeric (not null, default: 0)
//   salario_liquido: numeric (not null)
//   data_geracao: timestamp with time zone (not null, default: now())
// Table: funcionarios
//   id: uuid (not null, default: gen_random_uuid())
//   usuario_id: uuid (nullable)
//   departamento_id: uuid (nullable)
//   nome: text (not null)
//   email: text (not null)
//   telefone: character varying (nullable)
//   cpf: character varying (nullable)
//   rg: character varying (nullable)
//   cargo: text (nullable)
//   salario_base: numeric (nullable)
//   data_admissao: date (nullable)
//   data_demissao: date (nullable)
//   status: text (not null, default: 'Ativo'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: marcas
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   ativo: boolean (not null, default: true)
//   created_at: timestamp with time zone (not null, default: now())
// Table: produtos
//   id: uuid (not null, default: gen_random_uuid())
//   marca_id: uuid (nullable)
//   nome: text (not null)
//   sku: text (nullable)
//   categoria: text (nullable)
//   preco_custo: numeric (nullable)
//   preco_venda: numeric (nullable)
//   ativo: boolean (not null, default: true)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: projeto_itens
//   id: uuid (not null, default: gen_random_uuid())
//   projeto_id: uuid (not null)
//   produto_id: uuid (nullable)
//   descricao: text (not null)
//   quantidade: numeric (not null)
//   preco_unitario: numeric (not null)
//   desconto: numeric (not null, default: 0)
//   subtotal: numeric (nullable)
//   validado: boolean (not null, default: false)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: projeto_parcelas
//   id: uuid (not null, default: gen_random_uuid())
//   projeto_id: uuid (not null)
//   numero_parcela: integer (not null)
//   valor: numeric (not null)
//   data_fechamento: date (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   status: parcela_status (not null, default: 'pendente'::parcela_status)
//   data_vencimento: date (nullable)
//   data_pagamento: date (nullable)
//   valor_pago: numeric (nullable)
//   juros: numeric (not null, default: 0)
//   multa: numeric (not null, default: 0)
//   desconto: numeric (not null, default: 0)
//   forma_pagamento: pagamento_forma (nullable)
//   comprovante_url: text (nullable)
//   observacoes: text (nullable)
//   transacao_id: uuid (nullable)
//   descricao: text (nullable)
// Table: projeto_sinal
//   id: uuid (not null, default: gen_random_uuid())
//   projeto_id: uuid (not null)
//   valor: numeric (not null)
//   data_pagamento: date (nullable)
//   forma_pagamento: pagamento_forma (nullable)
//   status: sinal_status (not null, default: 'pendente'::sinal_status)
//   transacao_id: uuid (nullable)
//   comprovante_url: text (nullable)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: projetos
//   id: uuid (not null, default: gen_random_uuid())
//   codigo: character varying (not null)
//   nome: text (not null)
//   nivel_estrategico: projeto_nivel (nullable)
//   status: projeto_status (nullable, default: 'Estudo Inicial'::projeto_status)
//   tipo_item: character varying (nullable)
//   cidade: character varying (nullable)
//   estado: character varying (nullable)
//   caminho: text (nullable)
//   data_entrada: date (nullable)
//   arquivado: boolean (nullable, default: false)
//   cliente_id: uuid (nullable)
//   arquiteto_id: uuid (nullable)
//   responsavel_id: uuid (nullable)
//   valor_total: numeric (nullable, default: 0)
//   created_at: timestamp with time zone (nullable, default: now())
//   historico: jsonb (not null, default: '[]'::jsonb)
//   responsavel_nome: text (nullable)
//   created_by: uuid (nullable)
//   forma_pagamento: pagamento_forma (nullable)
//   total_parcelas: integer (nullable)
//   data_vencimento: date (nullable)
//   responsavel_obra_id: uuid (nullable)
//   updated_at: timestamp with time zone (not null, default: now())
// Table: projetos_fechados
//   id: uuid (not null, default: gen_random_uuid())
//   cod: text (nullable)
//   valor_fechado: numeric (nullable)
//   data_fechamento: date (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: separacao_arquivos
//   id: uuid (not null, default: gen_random_uuid())
//   separacao_id: uuid (not null)
//   nome: text (not null)
//   url: text (not null)
//   tipo_mime: text (nullable)
//   tamanho_kb: integer (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: separacao_itens
//   id: uuid (not null, default: gen_random_uuid())
//   separacao_id: uuid (not null)
//   descricao: text (not null)
//   quantidade: numeric (not null, default: 1)
//   unidade: character varying (nullable)
//   observacoes: text (nullable)
//   separado: boolean (not null, default: false)
//   created_at: timestamp with time zone (not null, default: now())
//   produto_id: uuid (nullable)
// Table: separacoes
//   id: uuid (not null, default: gen_random_uuid())
//   projeto_id: uuid (nullable)
//   responsavel_id: uuid (nullable)
//   status: separacao_status (not null, default: 'Pendente'::separacao_status)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   endereco_entrega: text (nullable)
//   delivery_type: text (nullable, default: 'flexible'::text)
//   scheduled_time: time without time zone (nullable)
//   data_entrega: date (nullable)
//   cliente: text (nullable)
//   codigo_obra: text (nullable)
//   data_entrega_original: date (nullable)
//   reagendamentos: integer (not null, default: 0)
//   cliente_id: uuid (nullable)
// Table: solicitacoes_compra
//   id: uuid (not null, default: gen_random_uuid())
//   solicitante_id: uuid (not null)
//   aprovador_id: uuid (nullable)
//   categoria_id: uuid (nullable)
//   projeto_id: uuid (nullable)
//   descricao: text (not null)
//   justificativa: text (nullable)
//   valor_estimado: numeric (not null)
//   valor_aprovado: numeric (nullable)
//   status: solicitacao_status (not null, default: 'pendente'::solicitacao_status)
//   data_aprovacao: date (nullable)
//   data_compra: date (nullable)
//   comprovante_url: text (nullable)
//   transacao_id: uuid (nullable)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: sync_history
//   id: bigint (not null)
//   status: text (nullable)
//   mensagem: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   registros_atualizados: integer (not null, default: 0)
//   registros_inseridos: integer (not null, default: 0)
//   registros_erro: integer (not null, default: 0)
//   executado_por: uuid (nullable)
//   origem: text (nullable)
//   tipo: text (nullable)
// Table: transacoes
//   id: uuid (not null, default: gen_random_uuid())
//   conta_id: uuid (not null)
//   projeto_id: uuid (nullable)
//   parcela_id: uuid (nullable)
//   tipo: transacao_tipo (not null)
//   descricao: text (not null)
//   valor: numeric (not null)
//   data_transacao: date (not null)
//   comprovante_url: text (nullable)
//   created_by: uuid (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   categoria_id: uuid (nullable)
// Table: usuarios
//   id: uuid (not null)
//   email: text (not null)
//   nome: text (not null)
//   role: usuario_role (nullable)
//   ativo: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
//   avatar_url: text (nullable)
//   updated_at: timestamp with time zone (nullable)
// Table: vendas_marca
//   id: uuid (not null, default: gen_random_uuid())
//   marca_id: uuid (not null)
//   mes: integer (not null)
//   ano: integer (not null)
//   valor_custo: numeric (not null, default: 0)
//   valor_venda: numeric (not null, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
// Table: vw_custos_pendentes_mes
//   descricao: text (nullable)
//   categoria: text (nullable)
//   data_vencimento: date (nullable)
//   valor_original: numeric (nullable)
//   status: lancamento_status (nullable)
//   conta: text (nullable)
// Table: vw_estoque_liquido
//   produto_id: uuid (nullable)
//   produto: text (nullable)
//   sku: text (nullable)
//   marca: text (nullable)
//   categoria: text (nullable)
//   preco_custo: numeric (nullable)
//   preco_venda: numeric (nullable)
//   qtd_fisico: numeric (nullable)
//   qtd_reservado: numeric (nullable)
//   qtd_showroom: numeric (nullable)
//   qtd_em_transito: numeric (nullable)
//   qtd_disponivel: numeric (nullable)
//   alerta_estoque: text (nullable)
//   valor_estoque_total: numeric (nullable)
//   valor_reservado_total: numeric (nullable)
// Table: vw_estoque_por_marca
//   marca: text (nullable)
//   skus_total: bigint (nullable)
//   qtd_estoque: numeric (nullable)
//   qtd_showroom: numeric (nullable)
//   valor_disponivel_venda: numeric (nullable)
// Table: vw_financeiro_projetos
//   id: uuid (nullable)
//   codigo: character varying (nullable)
//   nome: text (nullable)
//   status: projeto_status (nullable)
//   valor_total: numeric (nullable)
//   valor_parcelas: numeric (nullable)
//   receitas: numeric (nullable)
//   despesas: numeric (nullable)
//   cliente_nome: text (nullable)
//   arquiteto_nome: text (nullable)
// Table: vw_fluxo_caixa_projetado
//   mes: timestamp with time zone (nullable)
//   a_receber: numeric (nullable)
//   recebido: numeric (nullable)
//   atrasado: numeric (nullable)
//   qtd_pendente: bigint (nullable)
//   qtd_atrasado: bigint (nullable)
// Table: vw_projetos_pipeline
//   id: uuid (nullable)
//   codigo: character varying (nullable)
//   nome: text (nullable)
//   status: projeto_status (nullable)
//   nivel_estrategico: projeto_nivel (nullable)
//   data_entrada: date (nullable)
//   arquivado: boolean (nullable)
//   cidade: character varying (nullable)
//   estado: character varying (nullable)
//   cliente: text (nullable)
//   arquiteto: text (nullable)
//   responsavel_nome: text (nullable)
//   valor_total: numeric (nullable)
//   total_parcelas: integer (nullable)
//   forma_pagamento: pagamento_forma (nullable)
//   sinal_valor: numeric (nullable)
//   sinal_status: sinal_status (nullable)
//   sinal_data: date (nullable)
//   total_itens: bigint (nullable)
//   itens_validados: bigint (nullable)
//   valor_itens: numeric (nullable)
//   saldo_a_receber: numeric (nullable)
//   separacao_id: uuid (nullable)
//   separacao_status: separacao_status (nullable)
//   data_entrega: date (nullable)
//   reagendamentos: integer (nullable)
//   created_at: timestamp with time zone (nullable)
//   updated_at: timestamp with time zone (nullable)
// Table: vw_projetos_por_status
//   status: projeto_status (nullable)
//   total: bigint (nullable)
//   valor_total_sum: numeric (nullable)
//   ativos: bigint (nullable)
// Table: vw_rh_resumo
//   departamento: text (nullable)
//   total_funcionarios: bigint (nullable)
//   ativos: bigint (nullable)
//   salario_medio: numeric (nullable)
//   folha_total: numeric (nullable)
// Table: vw_separacoes_agenda
//   separacao_id: uuid (nullable)
//   separacao_status: separacao_status (nullable)
//   data_entrega: date (nullable)
//   data_entrega_original: date (nullable)
//   reagendamentos: integer (nullable)
//   codigo_obra: text (nullable)
//   cliente: text (nullable)
//   endereco_entrega: text (nullable)
//   delivery_type: text (nullable)
//   scheduled_time: time without time zone (nullable)
//   observacoes: text (nullable)
//   projeto_id: uuid (nullable)
//   projeto_codigo: character varying (nullable)
//   projeto_nome: text (nullable)
//   projeto_status: projeto_status (nullable)
//   cliente_nome: text (nullable)
//   entrega_id: uuid (nullable)
//   entrega_status: entrega_status (nullable)
//   entregador_id: uuid (nullable)
//   entregador_nome: text (nullable)
//   total_itens: bigint (nullable)
//   itens_separados: bigint (nullable)
//   dias_ate_entrega: integer (nullable)
//   urgencia: text (nullable)
//   created_at: timestamp with time zone (nullable)
//   updated_at: timestamp with time zone (nullable)
// Table: vw_vendas_loja
//   produto_id: uuid (nullable)
//   produto: text (nullable)
//   sku: text (nullable)
//   marca: text (nullable)
//   categoria: text (nullable)
//   quantidade: numeric (nullable)
//   preco_custo: numeric (nullable)
//   preco_venda: numeric (nullable)
//   margem_total: numeric (nullable)
//   separacao_id: uuid (nullable)
//   data_venda: timestamp with time zone (nullable)
//   cliente: text (nullable)
//   observacoes: text (nullable)
// Table: vw_vendas_por_projeto
//   produto_id: uuid (nullable)
//   produto: text (nullable)
//   sku: text (nullable)
//   marca: text (nullable)
//   categoria: text (nullable)
//   quantidade: numeric (nullable)
//   preco_custo: numeric (nullable)
//   preco_venda: numeric (nullable)
//   margem_total: numeric (nullable)
//   separacao_id: uuid (nullable)
//   data_separacao: timestamp with time zone (nullable)
//   projeto_id: uuid (nullable)
//   projeto_codigo: character varying (nullable)
//   projeto_nome: text (nullable)
//   projeto_status: projeto_status (nullable)
//   cliente: text (nullable)
//   projeto_cidade: character varying (nullable)
//   projeto_estado: character varying (nullable)
// Table: vw_vendas_produtos
//   origem: text (nullable)
//   produto_id: uuid (nullable)
//   produto: text (nullable)
//   sku: text (nullable)
//   marca: text (nullable)
//   categoria: text (nullable)
//   quantidade: numeric (nullable)
//   preco_custo: numeric (nullable)
//   preco_venda: numeric (nullable)
//   margem_total: numeric (nullable)
//   data_venda: timestamp with time zone (nullable)
//   projeto_codigo: character varying (nullable)
//   projeto_nome: text (nullable)
//   cliente: text (nullable)

// --- CONSTRAINTS ---
// Table: avaliacoes
//   FOREIGN KEY avaliacoes_avaliador_id_fkey: FOREIGN KEY (avaliador_id) REFERENCES usuarios(id) ON DELETE SET NULL
//   FOREIGN KEY avaliacoes_funcionario_id_fkey: FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id) ON DELETE CASCADE
//   CHECK avaliacoes_nota_check: CHECK (((nota >= (0)::numeric) AND (nota <= (10)::numeric)))
//   PRIMARY KEY avaliacoes_pkey: PRIMARY KEY (id)
// Table: candidatos
//   FOREIGN KEY candidatos_departamento_id_fkey: FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE SET NULL
//   PRIMARY KEY candidatos_pkey: PRIMARY KEY (id)
//   CHECK candidatos_status_check: CHECK ((status = ANY (ARRAY['Em análise'::text, 'Entrevista agendada'::text, 'Aprovado'::text, 'Reprovado'::text, 'Desistiu'::text])))
// Table: categorias_financeiras
//   CHECK categorias_financeiras_grupo_check: CHECK ((grupo = ANY (ARRAY['fixo'::text, 'variavel'::text, 'investimento'::text, 'transferencia'::text])))
//   UNIQUE categorias_financeiras_nome_key: UNIQUE (nome)
//   PRIMARY KEY categorias_financeiras_pkey: PRIMARY KEY (id)
// Table: contas_bancarias
//   PRIMARY KEY contas_bancarias_pkey: PRIMARY KEY (id)
//   CHECK contas_bancarias_status_check: CHECK ((status = ANY (ARRAY['Ativa'::text, 'Encerrada'::text])))
// Table: contatos
//   FOREIGN KEY contatos_created_by_fkey: FOREIGN KEY (created_by) REFERENCES auth.users(id)
//   PRIMARY KEY contatos_pkey: PRIMARY KEY (id)
//   UNIQUE uq_contatos_codigo_legado_tipo: UNIQUE (codigo_legado, tipo)
//   UNIQUE uq_contatos_cpf_cnpj: UNIQUE (cpf_cnpj)
// Table: controle_ponto
//   UNIQUE controle_ponto_funcionario_id_data_key: UNIQUE (funcionario_id, data)
//   FOREIGN KEY controle_ponto_funcionario_id_fkey: FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id) ON DELETE CASCADE
//   PRIMARY KEY controle_ponto_pkey: PRIMARY KEY (id)
//   CHECK controle_ponto_status_check: CHECK ((status = ANY (ARRAY['presente'::text, 'ausente'::text, 'atraso'::text, 'meio_periodo'::text])))
// Table: custos_recorrentes
//   FOREIGN KEY custos_recorrentes_categoria_id_fkey: FOREIGN KEY (categoria_id) REFERENCES categorias_financeiras(id) ON DELETE SET NULL
//   FOREIGN KEY custos_recorrentes_conta_id_fkey: FOREIGN KEY (conta_id) REFERENCES contas_bancarias(id) ON DELETE SET NULL
//   FOREIGN KEY custos_recorrentes_created_by_fkey: FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL
//   CHECK custos_recorrentes_dia_vencimento_check: CHECK (((dia_vencimento >= 1) AND (dia_vencimento <= 31)))
//   PRIMARY KEY custos_recorrentes_pkey: PRIMARY KEY (id)
//   CHECK custos_recorrentes_valor_check: CHECK ((valor > (0)::numeric))
// Table: custos_recorrentes_lancamentos
//   UNIQUE custos_recorrentes_lancamentos_custo_id_competencia_key: UNIQUE (custo_id, competencia)
//   FOREIGN KEY custos_recorrentes_lancamentos_custo_id_fkey: FOREIGN KEY (custo_id) REFERENCES custos_recorrentes(id) ON DELETE CASCADE
//   CHECK custos_recorrentes_lancamentos_desconto_check: CHECK ((desconto >= (0)::numeric))
//   CHECK custos_recorrentes_lancamentos_juros_check: CHECK ((juros >= (0)::numeric))
//   CHECK custos_recorrentes_lancamentos_multa_check: CHECK ((multa >= (0)::numeric))
//   PRIMARY KEY custos_recorrentes_lancamentos_pkey: PRIMARY KEY (id)
//   FOREIGN KEY custos_recorrentes_lancamentos_transacao_id_fkey: FOREIGN KEY (transacao_id) REFERENCES transacoes(id) ON DELETE SET NULL
//   CHECK custos_recorrentes_lancamentos_valor_pago_check: CHECK ((valor_pago >= (0)::numeric))
// Table: departamentos
//   UNIQUE departamentos_nome_key: UNIQUE (nome)
//   PRIMARY KEY departamentos_pkey: PRIMARY KEY (id)
// Table: entregas
//   CHECK entregas_avaliacao_check: CHECK (((avaliacao >= 1) AND (avaliacao <= 5)))
//   CHECK entregas_delivery_type_check: CHECK ((delivery_type = ANY (ARRAY['scheduled'::text, 'flexible'::text])))
//   FOREIGN KEY entregas_entregador_id_fkey: FOREIGN KEY (entregador_id) REFERENCES usuarios(id) ON DELETE SET NULL
//   PRIMARY KEY entregas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY entregas_projeto_id_fkey: FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE SET NULL
//   FOREIGN KEY entregas_separacao_id_fkey: FOREIGN KEY (separacao_id) REFERENCES separacoes(id) ON DELETE SET NULL
// Table: estoque_itens
//   FOREIGN KEY estoque_itens_atualizado_por_fkey: FOREIGN KEY (atualizado_por) REFERENCES usuarios(id) ON DELETE SET NULL
//   PRIMARY KEY estoque_itens_pkey: PRIMARY KEY (id)
//   FOREIGN KEY estoque_itens_produto_id_fkey: FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
//   UNIQUE estoque_itens_produto_id_local_key: UNIQUE (produto_id, local)
// Table: ferias
//   FOREIGN KEY ferias_aprovado_por_fkey: FOREIGN KEY (aprovado_por) REFERENCES usuarios(id) ON DELETE SET NULL
//   FOREIGN KEY ferias_funcionario_id_fkey: FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id) ON DELETE CASCADE
//   PRIMARY KEY ferias_pkey: PRIMARY KEY (id)
//   CHECK ferias_status_check: CHECK ((status = ANY (ARRAY['Pendente'::text, 'Aprovado'::text, 'Rejeitado'::text, 'Cancelado'::text])))
// Table: folha_pagamento
//   FOREIGN KEY folha_pagamento_funcionario_id_fkey: FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id) ON DELETE CASCADE
//   UNIQUE folha_pagamento_funcionario_id_mes_ano_key: UNIQUE (funcionario_id, mes, ano)
//   CHECK folha_pagamento_mes_check: CHECK (((mes >= 1) AND (mes <= 12)))
//   PRIMARY KEY folha_pagamento_pkey: PRIMARY KEY (id)
// Table: funcionarios
//   FOREIGN KEY funcionarios_departamento_id_fkey: FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE SET NULL
//   UNIQUE funcionarios_email_key: UNIQUE (email)
//   PRIMARY KEY funcionarios_pkey: PRIMARY KEY (id)
//   CHECK funcionarios_status_check: CHECK ((status = ANY (ARRAY['Ativo'::text, 'Inativo'::text, 'Afastado'::text, 'Ferias'::text])))
//   FOREIGN KEY funcionarios_usuario_id_fkey: FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
// Table: marcas
//   UNIQUE marcas_nome_key: UNIQUE (nome)
//   PRIMARY KEY marcas_pkey: PRIMARY KEY (id)
// Table: produtos
//   FOREIGN KEY produtos_marca_id_fkey: FOREIGN KEY (marca_id) REFERENCES marcas(id) ON DELETE SET NULL
//   PRIMARY KEY produtos_pkey: PRIMARY KEY (id)
//   UNIQUE produtos_sku_key: UNIQUE (sku)
// Table: projeto_itens
//   CHECK projeto_itens_desconto_check: CHECK (((desconto >= (0)::numeric) AND (desconto <= (100)::numeric)))
//   PRIMARY KEY projeto_itens_pkey: PRIMARY KEY (id)
//   CHECK projeto_itens_preco_unitario_check: CHECK ((preco_unitario >= (0)::numeric))
//   FOREIGN KEY projeto_itens_produto_id_fkey: FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE SET NULL
//   FOREIGN KEY projeto_itens_projeto_id_fkey: FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
//   CHECK projeto_itens_quantidade_check: CHECK ((quantidade > (0)::numeric))
// Table: projeto_parcelas
//   CHECK chk_parcela_valor_positivo: CHECK ((valor > (0)::numeric))
//   CHECK projeto_parcelas_desconto_check: CHECK ((desconto >= (0)::numeric))
//   CHECK projeto_parcelas_juros_check: CHECK ((juros >= (0)::numeric))
//   CHECK projeto_parcelas_multa_check: CHECK ((multa >= (0)::numeric))
//   PRIMARY KEY projeto_parcelas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY projeto_parcelas_projeto_id_fkey: FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
//   UNIQUE projeto_parcelas_projeto_id_numero_parcela_key: UNIQUE (projeto_id, numero_parcela)
//   FOREIGN KEY projeto_parcelas_transacao_id_fkey: FOREIGN KEY (transacao_id) REFERENCES transacoes(id) ON DELETE SET NULL
//   CHECK projeto_parcelas_valor_check: CHECK ((valor > (0)::numeric))
//   CHECK projeto_parcelas_valor_pago_check: CHECK ((valor_pago >= (0)::numeric))
// Table: projeto_sinal
//   PRIMARY KEY projeto_sinal_pkey: PRIMARY KEY (id)
//   FOREIGN KEY projeto_sinal_projeto_id_fkey: FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
//   UNIQUE projeto_sinal_projeto_id_key: UNIQUE (projeto_id)
//   FOREIGN KEY projeto_sinal_transacao_id_fkey: FOREIGN KEY (transacao_id) REFERENCES transacoes(id) ON DELETE SET NULL
//   CHECK projeto_sinal_valor_check: CHECK ((valor > (0)::numeric))
// Table: projetos
//   CHECK chk_historico_is_array: CHECK ((jsonb_typeof(historico) = 'array'::text))
//   FOREIGN KEY projetos_arquiteto_id_fkey: FOREIGN KEY (arquiteto_id) REFERENCES contatos(id)
//   FOREIGN KEY projetos_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES contatos(id)
//   UNIQUE projetos_codigo_key: UNIQUE (codigo)
//   FOREIGN KEY projetos_created_by_fkey: FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL
//   PRIMARY KEY projetos_pkey: PRIMARY KEY (id)
//   FOREIGN KEY projetos_responsavel_id_fkey: FOREIGN KEY (responsavel_id) REFERENCES usuarios(id)
//   FOREIGN KEY projetos_responsavel_obra_id_fkey: FOREIGN KEY (responsavel_obra_id) REFERENCES contatos(id) ON DELETE SET NULL
//   CHECK projetos_total_parcelas_check: CHECK ((total_parcelas > 0))
// Table: projetos_fechados
//   PRIMARY KEY projetos_fechados_pkey: PRIMARY KEY (id)
// Table: separacao_arquivos
//   PRIMARY KEY separacao_arquivos_pkey: PRIMARY KEY (id)
//   FOREIGN KEY separacao_arquivos_separacao_id_fkey: FOREIGN KEY (separacao_id) REFERENCES separacoes(id) ON DELETE CASCADE
// Table: separacao_itens
//   PRIMARY KEY separacao_itens_pkey: PRIMARY KEY (id)
//   FOREIGN KEY separacao_itens_produto_id_fkey: FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE SET NULL
//   FOREIGN KEY separacao_itens_separacao_id_fkey: FOREIGN KEY (separacao_id) REFERENCES separacoes(id) ON DELETE CASCADE
// Table: separacoes
//   FOREIGN KEY separacoes_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES contatos(id) ON DELETE SET NULL
//   CHECK separacoes_delivery_type_check: CHECK ((delivery_type = ANY (ARRAY['scheduled'::text, 'flexible'::text])))
//   PRIMARY KEY separacoes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY separacoes_projeto_id_fkey: FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE SET NULL
//   FOREIGN KEY separacoes_responsavel_id_fkey: FOREIGN KEY (responsavel_id) REFERENCES usuarios(id) ON DELETE SET NULL
// Table: solicitacoes_compra
//   FOREIGN KEY solicitacoes_compra_aprovador_id_fkey: FOREIGN KEY (aprovador_id) REFERENCES usuarios(id) ON DELETE SET NULL
//   FOREIGN KEY solicitacoes_compra_categoria_id_fkey: FOREIGN KEY (categoria_id) REFERENCES categorias_financeiras(id) ON DELETE SET NULL
//   PRIMARY KEY solicitacoes_compra_pkey: PRIMARY KEY (id)
//   FOREIGN KEY solicitacoes_compra_projeto_id_fkey: FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE SET NULL
//   FOREIGN KEY solicitacoes_compra_solicitante_id_fkey: FOREIGN KEY (solicitante_id) REFERENCES usuarios(id) ON DELETE RESTRICT
//   FOREIGN KEY solicitacoes_compra_transacao_id_fkey: FOREIGN KEY (transacao_id) REFERENCES transacoes(id) ON DELETE SET NULL
//   CHECK solicitacoes_compra_valor_aprovado_check: CHECK ((valor_aprovado >= (0)::numeric))
//   CHECK solicitacoes_compra_valor_estimado_check: CHECK ((valor_estimado > (0)::numeric))
// Table: sync_history
//   FOREIGN KEY sync_history_executado_por_fkey: FOREIGN KEY (executado_por) REFERENCES usuarios(id) ON DELETE SET NULL
//   PRIMARY KEY sync_history_pkey: PRIMARY KEY (id)
// Table: transacoes
//   FOREIGN KEY transacoes_categoria_id_fkey: FOREIGN KEY (categoria_id) REFERENCES categorias_financeiras(id) ON DELETE SET NULL
//   FOREIGN KEY transacoes_conta_id_fkey: FOREIGN KEY (conta_id) REFERENCES contas_bancarias(id) ON DELETE RESTRICT
//   FOREIGN KEY transacoes_created_by_fkey: FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL
//   FOREIGN KEY transacoes_parcela_id_fkey: FOREIGN KEY (parcela_id) REFERENCES projeto_parcelas(id) ON DELETE SET NULL
//   PRIMARY KEY transacoes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY transacoes_projeto_id_fkey: FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE SET NULL
// Table: usuarios
//   UNIQUE usuarios_email_key: UNIQUE (email)
//   FOREIGN KEY usuarios_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY usuarios_pkey: PRIMARY KEY (id)
// Table: vendas_marca
//   CHECK chk_vendas_custo_positivo: CHECK ((valor_custo >= (0)::numeric))
//   CHECK chk_vendas_venda_positivo: CHECK ((valor_venda >= (0)::numeric))
//   FOREIGN KEY vendas_marca_marca_id_fkey: FOREIGN KEY (marca_id) REFERENCES marcas(id) ON DELETE CASCADE
//   UNIQUE vendas_marca_marca_id_mes_ano_key: UNIQUE (marca_id, mes, ano)
//   CHECK vendas_marca_mes_check: CHECK (((mes >= 1) AND (mes <= 12)))
//   PRIMARY KEY vendas_marca_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: avaliacoes
//   Policy "aval_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
// Table: candidatos
//   Policy "candidatos_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
// Table: categorias_financeiras
//   Policy "catfin_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "catfin_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "catfin_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "catfin_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
// Table: contas_bancarias
//   Policy "contas_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = 'admin'::usuario_role))))
//   Policy "contas_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = 'admin'::usuario_role))))
//   Policy "contas_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
//   Policy "contas_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = 'admin'::usuario_role))))
// Table: contatos
//   Policy "authenticated_all_contatos" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
//   Policy "contatos_delete_admin" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "contatos_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
//   Policy "contatos_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "contatos_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
// Table: controle_ponto
//   Policy "ponto_delete_admin" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "ponto_insert_admin" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "ponto_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role]))))) OR (funcionario_id IN ( SELECT funcionarios.id    FROM funcionarios   WHERE (funcionarios.usuario_id = ( SELECT auth.uid() AS uid)))))
//   Policy "ponto_update_admin" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
// Table: custos_recorrentes
//   Policy "custos_rec_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "custos_rec_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "custos_rec_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
//   Policy "custos_rec_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
// Table: custos_recorrentes_lancamentos
//   Policy "lanc_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "lanc_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "lanc_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
//   Policy "lanc_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
// Table: departamentos
//   Policy "dept_delete_admin" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "dept_insert_admin" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "dept_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "dept_update_admin" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
// Table: entregas
//   Policy "entregas_delete_admin" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "entregas_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
//   Policy "entregas_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "entregas_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
// Table: estoque_itens
//   Policy "estoque_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
//   Policy "estoque_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
//   Policy "estoque_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "estoque_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
// Table: ferias
//   Policy "ferias_delete_admin" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "ferias_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: ((funcionario_id IN ( SELECT funcionarios.id    FROM funcionarios   WHERE (funcionarios.usuario_id = ( SELECT auth.uid() AS uid)))) OR (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role]))))))
//   Policy "ferias_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role]))))) OR (funcionario_id IN ( SELECT funcionarios.id    FROM funcionarios   WHERE (funcionarios.usuario_id = ( SELECT auth.uid() AS uid)))))
//   Policy "ferias_update_admin" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
// Table: folha_pagamento
//   Policy "folha_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "folha_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "folha_own" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role]))))) OR (funcionario_id IN ( SELECT funcionarios.id    FROM funcionarios   WHERE (funcionarios.usuario_id = ( SELECT auth.uid() AS uid)))))
//   Policy "folha_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
// Table: funcionarios
//   Policy "func_delete_admin" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "func_insert_admin" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "func_select_admin" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role]))))) OR (usuario_id = ( SELECT auth.uid() AS uid)))
//   Policy "func_update_admin" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
// Table: marcas
//   Policy "marcas_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "marcas_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "marcas_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "marcas_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
// Table: produtos
//   Policy "prod_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "prod_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "prod_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "prod_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
// Table: projeto_itens
//   Policy "pi_delete_admin" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "pi_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
//   Policy "pi_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "pi_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
// Table: projeto_parcelas
//   Policy "authenticated_all_projeto_parcelas" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
//   Policy "parcelas_delete_admin" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "parcelas_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
//   Policy "parcelas_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "parcelas_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
// Table: projeto_sinal
//   Policy "sinal_delete_admin" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "sinal_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
//   Policy "sinal_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "sinal_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
// Table: projetos
//   Policy "authenticated_all_projetos" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
//   Policy "projetos_delete_admin" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "projetos_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
//   Policy "projetos_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "projetos_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
// Table: projetos_fechados
//   Policy "projetos_fechados_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "projetos_fechados_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "projetos_fechados_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "projetos_fechados_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: separacao_arquivos
//   Policy "sep_arq_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "sep_arq_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
//   Policy "sep_arq_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "sep_arq_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
// Table: separacao_itens
//   Policy "sep_itens_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "sep_itens_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
//   Policy "sep_itens_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "sep_itens_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
// Table: separacoes
//   Policy "separacoes_delete_admin" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "separacoes_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
//   Policy "separacoes_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "separacoes_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
// Table: solicitacoes_compra
//   Policy "solicit_admin" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = 'admin'::usuario_role))))
//   Policy "solicit_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (solicitante_id = ( SELECT auth.uid() AS uid))
//   Policy "solicit_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((solicitante_id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role]))))))
//   Policy "solicit_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((solicitante_id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role]))))))
// Table: sync_history
//   Policy "sync_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
//   Policy "sync_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
// Table: transacoes
//   Policy "trans_delete_admin" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = 'admin'::usuario_role))))
//   Policy "trans_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
//   Policy "trans_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
//   Policy "trans_update_admin" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = 'admin'::usuario_role))))
// Table: usuarios
//   Policy "usuarios_delete_admin" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = 'admin'::usuario_role))))
//   Policy "usuarios_insert_admin" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = 'admin'::usuario_role))))
//   Policy "usuarios_select_own" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "usuarios_update_own" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = 'admin'::usuario_role)))))
// Table: vendas_marca
//   Policy "vendas_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "vendas_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))
//   Policy "vendas_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role, 'operador'::usuario_role])))))
//   Policy "vendas_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios u   WHERE ((u.id = ( SELECT auth.uid() AS uid)) AND (u.role = ANY (ARRAY['admin'::usuario_role, 'gerente'::usuario_role])))))

// --- DATABASE FUNCTIONS ---
// FUNCTION criar_usuario(text, text, text, usuario_role)
//   CREATE OR REPLACE FUNCTION public.criar_usuario(p_email text, p_password text, p_nome text, p_role usuario_role DEFAULT 'viewer'::usuario_role)
//    RETURNS uuid
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   DECLARE
//     v_caller_role usuario_role;
//     v_new_id      UUID;
//   BEGIN
//     SELECT role INTO v_caller_role FROM usuarios WHERE id = auth.uid();
//     IF v_caller_role != 'admin' THEN
//       RAISE EXCEPTION 'Apenas administradores podem criar usuários.';
//     END IF;
//     IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
//       RAISE EXCEPTION 'E-mail % já cadastrado.', p_email;
//     END IF;
//   
//     v_new_id := gen_random_uuid();
//     INSERT INTO auth.users (
//       id, instance_id, email, encrypted_password, email_confirmed_at,
//       created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
//       is_super_admin, role, aud,
//       confirmation_token, recovery_token, email_change_token_new,
//       email_change, email_change_token_current, phone, phone_change, phone_change_token, reauthentication_token
//     ) VALUES (
//       v_new_id, '00000000-0000-0000-0000-000000000000', p_email,
//       crypt(p_password, gen_salt('bf')), NOW(), NOW(), NOW(),
//       '{"provider":"email","providers":["email"]}',
//       json_build_object('nome', p_nome),
//       false, 'authenticated', 'authenticated',
//       '', '', '', '', '', NULL, '', '', ''
//     );
//   
//     INSERT INTO usuarios (id, email, nome, role)
//     VALUES (v_new_id, p_email, p_nome, p_role)
//     ON CONFLICT (id) DO UPDATE SET nome = p_nome, role = p_role;
//   
//     RETURN v_new_id;
//   END;
//   $function$
//   
// FUNCTION handle_new_auth_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     INSERT INTO public.usuarios (id, email, nome, role)
//     VALUES (
//       NEW.id,
//       NEW.email,
//       COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
//       'viewer'
//     )
//     ON CONFLICT (id) DO NOTHING;
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION propagate_contato_nome()
//   CREATE OR REPLACE FUNCTION public.propagate_contato_nome()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     IF OLD.nome IS NOT DISTINCT FROM NEW.nome THEN
//       RETURN NEW;
//     END IF;
//   
//     UPDATE public.separacoes
//     SET cliente    = NEW.nome,
//         updated_at = NOW()
//     WHERE cliente_id = NEW.id;
//   
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION propagate_projeto_codigo()
//   CREATE OR REPLACE FUNCTION public.propagate_projeto_codigo()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     IF OLD.codigo IS NOT DISTINCT FROM NEW.codigo THEN
//       RETURN NEW;
//     END IF;
//   
//     UPDATE separacoes
//     SET codigo_obra = NEW.codigo,
//         updated_at  = NOW()
//     WHERE projeto_id = NEW.id;
//   
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION propagate_usuario_nome()
//   CREATE OR REPLACE FUNCTION public.propagate_usuario_nome()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     IF OLD.nome IS NOT DISTINCT FROM NEW.nome THEN
//       RETURN NEW;
//     END IF;
//   
//     UPDATE public.projetos
//     SET responsavel_nome = NEW.nome,
//         updated_at       = NOW()
//     WHERE responsavel_id = NEW.id;
//   
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION set_updated_at()
//   CREATE OR REPLACE FUNCTION public.set_updated_at()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     NEW.updated_at = NOW();
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION stats_datacenter()
//   CREATE OR REPLACE FUNCTION public.stats_datacenter()
//    RETURNS json
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     RETURN json_build_object(
//       'projetos',    (SELECT COUNT(*) FROM projetos WHERE arquivado = false),
//       'contatos',    (SELECT COUNT(*) FROM contatos WHERE ativo = true),
//       'funcionarios',(SELECT COUNT(*) FROM funcionarios WHERE status = 'Ativo'),
//       'separacoes',  (SELECT COUNT(*) FROM separacoes WHERE status NOT IN ('Cancelado','Enviado')),
//       'marcas',      (SELECT COUNT(*) FROM marcas WHERE ativo = true),
//       'ultima_sync', (SELECT MAX(created_at) FROM sync_history WHERE status = 'sucesso')
//     );
//   END;
//   $function$
//   
// FUNCTION sync_projeto_valor_total()
//   CREATE OR REPLACE FUNCTION public.sync_projeto_valor_total()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     UPDATE projetos
//     SET valor_total = (
//       SELECT COALESCE(SUM(subtotal), 0)
//       FROM projeto_itens
//       WHERE projeto_id = NEW.projeto_id
//     )
//     WHERE id = NEW.projeto_id;
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION sync_responsavel_nome()
//   CREATE OR REPLACE FUNCTION public.sync_responsavel_nome()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     IF NEW.responsavel_id IS NOT NULL THEN
//       SELECT nome INTO NEW.responsavel_nome
//       FROM public.usuarios WHERE id = NEW.responsavel_id;
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION sync_separacao_cliente()
//   CREATE OR REPLACE FUNCTION public.sync_separacao_cliente()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     IF NEW.cliente_id IS NOT NULL THEN
//       SELECT nome INTO NEW.cliente
//       FROM contatos
//       WHERE id = NEW.cliente_id;
//     END IF;
//     -- Se cliente_id for NULL, mantém o texto livre existente (separação avulsa)
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION sync_separacao_codigo_obra()
//   CREATE OR REPLACE FUNCTION public.sync_separacao_codigo_obra()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     IF NEW.projeto_id IS NOT NULL THEN
//       SELECT codigo INTO NEW.codigo_obra
//       FROM projetos
//       WHERE id = NEW.projeto_id;
//     END IF;
//     -- Se projeto_id for NULL, mantém o codigo_obra manual (separação avulsa)
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION track_reagendamento()
//   CREATE OR REPLACE FUNCTION public.track_reagendamento()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     -- Salvar data original na primeira vez
//     IF OLD.data_entrega IS NULL AND NEW.data_entrega IS NOT NULL THEN
//       NEW.data_entrega_original = NEW.data_entrega;
//     END IF;
//     -- Contar reagendamentos quando data muda após estar definida
//     IF OLD.data_entrega IS NOT NULL
//        AND NEW.data_entrega IS NOT NULL
//        AND OLD.data_entrega <> NEW.data_entrega THEN
//       NEW.reagendamentos = OLD.reagendamentos + 1;
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION trigger_fechar_projeto()
//   CREATE OR REPLACE FUNCTION public.trigger_fechar_projeto()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   DECLARE
//     v_sinal RECORD;
//   BEGIN
//     IF NEW.status = 'Entrega materiais' AND OLD.status <> 'Entrega materiais' THEN
//   
//       -- 3a. Baixar estoque físico (local='Estoque') por produto
//       UPDATE estoque_itens ei
//       SET quantidade    = GREATEST(0, ei.quantidade - pi.quantidade),
//           atualizado_em = NOW()
//       FROM projeto_itens pi
//       WHERE pi.projeto_id = NEW.id
//         AND pi.produto_id = ei.produto_id
//         AND ei.local = 'Estoque';
//   
//       -- 3b. Zerar a reserva desse projeto
//       UPDATE estoque_itens ei
//       SET quantidade    = GREATEST(0, ei.quantidade - pi.quantidade),
//           atualizado_em = NOW()
//       FROM projeto_itens pi
//       WHERE pi.projeto_id = NEW.id
//         AND pi.produto_id = ei.produto_id
//         AND ei.local = 'Reservado';
//   
//       -- 3c. Marcar sinal como 'creditado' (cliente comprou)
//       UPDATE projeto_sinal
//       SET status     = 'creditado',
//           updated_at = NOW()
//       WHERE projeto_id = NEW.id
//         AND status = 'recebido';
//   
//       -- 3d. Criar separação automaticamente com os itens validados
//       --     (só cria se ainda não existe separação para esse projeto)
//       IF NOT EXISTS (
//         SELECT 1 FROM separacoes
//         WHERE projeto_id = NEW.id
//           AND status NOT IN ('Cancelado')
//       ) THEN
//         WITH nova_sep AS (
//           INSERT INTO separacoes (
//             projeto_id, responsavel_id, status,
//             codigo_obra, cliente, observacoes
//           )
//           SELECT
//             NEW.id,
//             NEW.created_by,
//             'Pendente'::separacao_status,
//             NEW.codigo,
//             (SELECT nome FROM contatos WHERE id = NEW.cliente_id),
//             'Separação gerada automaticamente no fechamento do projeto'
//           RETURNING id
//         )
//         INSERT INTO separacao_itens (separacao_id, produto_id, descricao, quantidade, unidade)
//         SELECT
//           nova_sep.id,
//           pi.produto_id,
//           pi.descricao,
//           pi.quantidade,
//           NULL
//         FROM projeto_itens pi, nova_sep
//         WHERE pi.projeto_id = NEW.id
//           AND pi.validado = true;
//   
//       END IF;
//   
//     END IF;
//   
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION trigger_proteger_fechamento()
//   CREATE OR REPLACE FUNCTION public.trigger_proteger_fechamento()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO 'public'
//   AS $function$
//   DECLARE
//     itens_nao_validados INTEGER;
//     status_fechamento TEXT[] := ARRAY[
//       'Projeto executivo',
//       'Entrega materiais',
//       'Ajustes finais',
//       'Finalizado'
//     ];
//   BEGIN
//     -- Só verifica quando está indo para um status de execução/fechamento
//     IF NEW.status = ANY(status_fechamento)
//        AND (OLD.status IS NULL OR OLD.status <> NEW.status) THEN
//   
//       SELECT COUNT(*) INTO itens_nao_validados
//       FROM projeto_itens
//       WHERE projeto_id = NEW.id
//         AND validado = false;
//   
//       IF itens_nao_validados > 0 THEN
//         RAISE EXCEPTION
//           'Não é possível avançar o projeto para "%". Existem % item(ns) não validado(s). Valide todos os itens antes de fechar.',
//           NEW.status, itens_nao_validados;
//       END IF;
//   
//       -- Também verifica se existe pelo menos 1 item no projeto
//       IF NOT EXISTS (SELECT 1 FROM projeto_itens WHERE projeto_id = NEW.id) THEN
//         RAISE EXCEPTION
//           'Não é possível fechar o projeto sem nenhum item cadastrado.';
//       END IF;
//   
//     END IF;
//   
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION trigger_proteger_parcelas()
//   CREATE OR REPLACE FUNCTION public.trigger_proteger_parcelas()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO 'public'
//   AS $function$
//   DECLARE
//     v_status TEXT;
//   BEGIN
//     SELECT status INTO v_status FROM projetos WHERE id = NEW.projeto_id;
//   
//     IF v_status NOT IN ('Ajustes finais', 'Finalizado') THEN
//       RAISE EXCEPTION
//         'Parcelas só podem ser criadas após o projeto estar em "Ajustes finais" ou "Finalizado". Status atual: %',
//         v_status;
//     END IF;
//   
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION trigger_reserva_estoque()
//   CREATE OR REPLACE FUNCTION public.trigger_reserva_estoque()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     -- Só age quando status MUDA para 'Proposta Sinal'
//     IF NEW.status = 'Proposta Sinal' AND OLD.status <> 'Proposta Sinal' THEN
//   
//       -- Inserir ou somar na reserva de estoque para cada item do projeto
//       INSERT INTO estoque_itens (produto_id, local, quantidade, atualizado_por, atualizado_em)
//       SELECT
//         pi.produto_id,
//         'Reservado'::estoque_local,
//         pi.quantidade,
//         NEW.created_by,
//         NOW()
//       FROM projeto_itens pi
//       WHERE pi.projeto_id = NEW.id
//         AND pi.produto_id IS NOT NULL
//       ON CONFLICT (produto_id, local)
//       DO UPDATE SET
//         quantidade    = estoque_itens.quantidade + EXCLUDED.quantidade,
//         atualizado_em = NOW();
//   
//     END IF;
//   
//     -- Ao SAIR de 'Proposta Sinal' para trás (ex: cancelamento),
//     -- liberar a reserva
//     IF OLD.status = 'Proposta Sinal'
//        AND NEW.status NOT IN ('Proposta Sinal','Elaboração Orçamento',
//                                'Informações necessárias','Projeto executivo',
//                                'Entrega materiais','Ajustes finais','Finalizado') THEN
//   
//       UPDATE estoque_itens ei
//       SET quantidade = GREATEST(0, ei.quantidade - pi.quantidade),
//           atualizado_em = NOW()
//       FROM projeto_itens pi
//       WHERE pi.projeto_id = NEW.id
//         AND pi.produto_id = ei.produto_id
//         AND ei.local = 'Reservado';
//   
//     END IF;
//   
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION trigger_separacao_pronta()
//   CREATE OR REPLACE FUNCTION public.trigger_separacao_pronta()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     IF NEW.status = 'Pronto' AND OLD.status <> 'Pronto' THEN
//   
//       -- Proteção: data_entrega obrigatória para gerar entrega
//       IF NEW.data_entrega IS NULL THEN
//         RAISE EXCEPTION
//           'Defina a data de entrega antes de marcar a separação como Pronto.';
//       END IF;
//   
//       -- Criar entrega se ainda não existir para essa separação
//       IF NOT EXISTS (
//         SELECT 1 FROM entregas
//         WHERE separacao_id = NEW.id
//           AND status <> 'Cancelado'
//       ) THEN
//         INSERT INTO entregas (
//           separacao_id,
//           projeto_id,
//           entregador_id,
//           endereco_entrega,
//           contato_destino,
//           data_prevista,
//           status
//         ) VALUES (
//           NEW.id,
//           NEW.projeto_id,
//           NEW.responsavel_id,
//           NEW.endereco_entrega,
//           NEW.cliente,
//           NEW.data_entrega,
//           'Pendente'::entrega_status
//         );
//       ELSE
//         -- Se entrega já existe, só atualiza a data_prevista
//         UPDATE entregas
//         SET data_prevista = NEW.data_entrega,
//             updated_at    = NOW()
//         WHERE separacao_id = NEW.id
//           AND status = 'Pendente';
//       END IF;
//   
//     END IF;
//   
//     -- Quando data_entrega muda em separação já Pronta,
//     -- propagar para entrega pendente correspondente
//     IF NEW.status = 'Pronto'
//        AND OLD.data_entrega IS DISTINCT FROM NEW.data_entrega
//        AND NEW.data_entrega IS NOT NULL THEN
//   
//       UPDATE entregas
//       SET data_prevista = NEW.data_entrega,
//           updated_at    = NOW()
//       WHERE separacao_id = NEW.id
//         AND status = 'Pendente';
//   
//     END IF;
//   
//     RETURN NEW;
//   END;
//   $function$
//   

// --- TRIGGERS ---
// Table: candidatos
//   candidatos_updated_at: CREATE TRIGGER candidatos_updated_at BEFORE UPDATE ON public.candidatos FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: contas_bancarias
//   contas_updated_at: CREATE TRIGGER contas_updated_at BEFORE UPDATE ON public.contas_bancarias FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: contatos
//   contatos_updated_at: CREATE TRIGGER contatos_updated_at BEFORE UPDATE ON public.contatos FOR EACH ROW EXECUTE FUNCTION set_updated_at()
//   trg_propagate_contato_nome: CREATE TRIGGER trg_propagate_contato_nome AFTER UPDATE OF nome ON public.contatos FOR EACH ROW EXECUTE FUNCTION propagate_contato_nome()
// Table: custos_recorrentes
//   custos_rec_updated_at: CREATE TRIGGER custos_rec_updated_at BEFORE UPDATE ON public.custos_recorrentes FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: entregas
//   entregas_updated_at: CREATE TRIGGER entregas_updated_at BEFORE UPDATE ON public.entregas FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: funcionarios
//   funcionarios_updated_at: CREATE TRIGGER funcionarios_updated_at BEFORE UPDATE ON public.funcionarios FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: produtos
//   produtos_updated_at: CREATE TRIGGER produtos_updated_at BEFORE UPDATE ON public.produtos FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: projeto_itens
//   projeto_itens_updated_at: CREATE TRIGGER projeto_itens_updated_at BEFORE UPDATE ON public.projeto_itens FOR EACH ROW EXECUTE FUNCTION set_updated_at()
//   trg_sync_valor_total: CREATE TRIGGER trg_sync_valor_total AFTER INSERT OR DELETE OR UPDATE ON public.projeto_itens FOR EACH ROW EXECUTE FUNCTION sync_projeto_valor_total()
// Table: projeto_parcelas
//   trg_proteger_parcelas: CREATE TRIGGER trg_proteger_parcelas BEFORE INSERT ON public.projeto_parcelas FOR EACH ROW EXECUTE FUNCTION trigger_proteger_parcelas()
// Table: projeto_sinal
//   projeto_sinal_updated_at: CREATE TRIGGER projeto_sinal_updated_at BEFORE UPDATE ON public.projeto_sinal FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: projetos
//   projetos_updated_at: CREATE TRIGGER projetos_updated_at BEFORE UPDATE ON public.projetos FOR EACH ROW EXECUTE FUNCTION set_updated_at()
//   trg_fechar_projeto: CREATE TRIGGER trg_fechar_projeto AFTER UPDATE OF status ON public.projetos FOR EACH ROW EXECUTE FUNCTION trigger_fechar_projeto()
//   trg_propagate_projeto_codigo: CREATE TRIGGER trg_propagate_projeto_codigo AFTER UPDATE OF codigo ON public.projetos FOR EACH ROW EXECUTE FUNCTION propagate_projeto_codigo()
//   trg_proteger_fechamento: CREATE TRIGGER trg_proteger_fechamento BEFORE UPDATE OF status ON public.projetos FOR EACH ROW EXECUTE FUNCTION trigger_proteger_fechamento()
//   trg_reserva_estoque: CREATE TRIGGER trg_reserva_estoque AFTER UPDATE OF status ON public.projetos FOR EACH ROW EXECUTE FUNCTION trigger_reserva_estoque()
//   trg_sync_responsavel_nome: CREATE TRIGGER trg_sync_responsavel_nome BEFORE INSERT OR UPDATE OF responsavel_id ON public.projetos FOR EACH ROW EXECUTE FUNCTION sync_responsavel_nome()
// Table: separacoes
//   separacoes_updated_at: CREATE TRIGGER separacoes_updated_at BEFORE UPDATE ON public.separacoes FOR EACH ROW EXECUTE FUNCTION set_updated_at()
//   trg_separacao_pronta: CREATE TRIGGER trg_separacao_pronta AFTER UPDATE OF status, data_entrega ON public.separacoes FOR EACH ROW EXECUTE FUNCTION trigger_separacao_pronta()
//   trg_sync_sep_cliente: CREATE TRIGGER trg_sync_sep_cliente BEFORE INSERT OR UPDATE OF cliente_id ON public.separacoes FOR EACH ROW EXECUTE FUNCTION sync_separacao_cliente()
//   trg_sync_sep_codigo_obra: CREATE TRIGGER trg_sync_sep_codigo_obra BEFORE INSERT OR UPDATE OF projeto_id ON public.separacoes FOR EACH ROW EXECUTE FUNCTION sync_separacao_codigo_obra()
//   trg_track_reagendamento: CREATE TRIGGER trg_track_reagendamento BEFORE UPDATE OF data_entrega ON public.separacoes FOR EACH ROW EXECUTE FUNCTION track_reagendamento()
// Table: solicitacoes_compra
//   solicit_updated_at: CREATE TRIGGER solicit_updated_at BEFORE UPDATE ON public.solicitacoes_compra FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: usuarios
//   trg_propagate_usuario_nome: CREATE TRIGGER trg_propagate_usuario_nome AFTER UPDATE OF nome ON public.usuarios FOR EACH ROW EXECUTE FUNCTION propagate_usuario_nome()
//   usuarios_updated_at: CREATE TRIGGER usuarios_updated_at BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION set_updated_at()

// --- INDEXES ---
// Table: avaliacoes
//   CREATE INDEX idx_aval_avaliador ON public.avaliacoes USING btree (avaliador_id)
//   CREATE INDEX idx_aval_funcionario ON public.avaliacoes USING btree (funcionario_id)
// Table: candidatos
//   CREATE INDEX idx_cand_departamento ON public.candidatos USING btree (departamento_id)
// Table: categorias_financeiras
//   CREATE UNIQUE INDEX categorias_financeiras_nome_key ON public.categorias_financeiras USING btree (nome)
// Table: contatos
//   CREATE INDEX idx_contatos_cidade_estado ON public.contatos USING btree (cidade, estado)
//   CREATE INDEX idx_contatos_codigo_legado ON public.contatos USING btree (codigo_legado, tipo)
//   CREATE INDEX idx_contatos_cpf_cnpj ON public.contatos USING btree (cpf_cnpj)
//   CREATE INDEX idx_contatos_created_by ON public.contatos USING btree (created_by)
//   CREATE INDEX idx_contatos_email ON public.contatos USING btree (email)
//   CREATE INDEX idx_contatos_nome ON public.contatos USING gin (to_tsvector('portuguese'::regconfig, nome))
//   CREATE INDEX idx_contatos_nome_trgm ON public.contatos USING gin (nome gin_trgm_ops)
//   CREATE INDEX idx_contatos_tipo ON public.contatos USING btree (tipo)
//   CREATE UNIQUE INDEX uq_contatos_codigo_legado_tipo ON public.contatos USING btree (codigo_legado, tipo)
//   CREATE UNIQUE INDEX uq_contatos_cpf_cnpj ON public.contatos USING btree (cpf_cnpj)
// Table: controle_ponto
//   CREATE UNIQUE INDEX controle_ponto_funcionario_id_data_key ON public.controle_ponto USING btree (funcionario_id, data)
//   CREATE INDEX idx_ponto_data ON public.controle_ponto USING btree (data DESC)
//   CREATE INDEX idx_ponto_funcionario ON public.controle_ponto USING btree (funcionario_id)
// Table: custos_recorrentes
//   CREATE INDEX idx_custos_rec_categoria ON public.custos_recorrentes USING btree (categoria_id)
//   CREATE INDEX idx_custos_rec_conta ON public.custos_recorrentes USING btree (conta_id)
//   CREATE INDEX idx_custos_rec_created_by ON public.custos_recorrentes USING btree (created_by)
// Table: custos_recorrentes_lancamentos
//   CREATE UNIQUE INDEX custos_recorrentes_lancamentos_custo_id_competencia_key ON public.custos_recorrentes_lancamentos USING btree (custo_id, competencia)
//   CREATE INDEX idx_lanc_competencia ON public.custos_recorrentes_lancamentos USING btree (competencia DESC)
//   CREATE INDEX idx_lanc_custo ON public.custos_recorrentes_lancamentos USING btree (custo_id)
//   CREATE INDEX idx_lanc_status ON public.custos_recorrentes_lancamentos USING btree (status)
//   CREATE INDEX idx_lanc_transacao ON public.custos_recorrentes_lancamentos USING btree (transacao_id)
//   CREATE INDEX idx_lanc_vencimento ON public.custos_recorrentes_lancamentos USING btree (data_vencimento)
// Table: departamentos
//   CREATE UNIQUE INDEX departamentos_nome_key ON public.departamentos USING btree (nome)
// Table: entregas
//   CREATE INDEX idx_entregas_data ON public.entregas USING btree (data_prevista)
//   CREATE INDEX idx_entregas_entregador ON public.entregas USING btree (entregador_id)
//   CREATE INDEX idx_entregas_projeto ON public.entregas USING btree (projeto_id)
//   CREATE INDEX idx_entregas_separacao ON public.entregas USING btree (separacao_id)
//   CREATE INDEX idx_entregas_status ON public.entregas USING btree (status)
// Table: estoque_itens
//   CREATE UNIQUE INDEX estoque_itens_produto_id_local_key ON public.estoque_itens USING btree (produto_id, local)
//   CREATE INDEX idx_estoque_atualizado_por ON public.estoque_itens USING btree (atualizado_por)
//   CREATE INDEX idx_estoque_local ON public.estoque_itens USING btree (local)
//   CREATE INDEX idx_estoque_produto ON public.estoque_itens USING btree (produto_id)
// Table: ferias
//   CREATE INDEX idx_ferias_aprovado_por ON public.ferias USING btree (aprovado_por)
//   CREATE INDEX idx_ferias_funcionario ON public.ferias USING btree (funcionario_id)
//   CREATE INDEX idx_ferias_status ON public.ferias USING btree (status)
// Table: folha_pagamento
//   CREATE UNIQUE INDEX folha_pagamento_funcionario_id_mes_ano_key ON public.folha_pagamento USING btree (funcionario_id, mes, ano)
//   CREATE INDEX idx_folha_funcionario ON public.folha_pagamento USING btree (funcionario_id)
//   CREATE INDEX idx_folha_mes_ano ON public.folha_pagamento USING btree (ano DESC, mes DESC)
// Table: funcionarios
//   CREATE UNIQUE INDEX funcionarios_email_key ON public.funcionarios USING btree (email)
//   CREATE INDEX idx_func_departamento ON public.funcionarios USING btree (departamento_id)
//   CREATE INDEX idx_func_status ON public.funcionarios USING btree (status)
//   CREATE INDEX idx_func_usuario ON public.funcionarios USING btree (usuario_id)
// Table: marcas
//   CREATE UNIQUE INDEX marcas_nome_key ON public.marcas USING btree (nome)
// Table: produtos
//   CREATE INDEX idx_prod_categoria ON public.produtos USING btree (categoria)
//   CREATE INDEX idx_prod_marca ON public.produtos USING btree (marca_id)
//   CREATE INDEX idx_prod_sku ON public.produtos USING btree (sku)
//   CREATE UNIQUE INDEX produtos_sku_key ON public.produtos USING btree (sku)
// Table: projeto_itens
//   CREATE INDEX idx_pi_produto ON public.projeto_itens USING btree (produto_id)
//   CREATE INDEX idx_pi_projeto ON public.projeto_itens USING btree (projeto_id)
//   CREATE INDEX idx_pi_validado ON public.projeto_itens USING btree (projeto_id, validado)
// Table: projeto_parcelas
//   CREATE INDEX idx_parcelas_projeto ON public.projeto_parcelas USING btree (projeto_id)
//   CREATE INDEX idx_parcelas_status ON public.projeto_parcelas USING btree (status)
//   CREATE INDEX idx_parcelas_transacao ON public.projeto_parcelas USING btree (transacao_id)
//   CREATE INDEX idx_parcelas_vencimento ON public.projeto_parcelas USING btree (data_vencimento)
//   CREATE UNIQUE INDEX projeto_parcelas_projeto_id_numero_parcela_key ON public.projeto_parcelas USING btree (projeto_id, numero_parcela)
// Table: projeto_sinal
//   CREATE INDEX idx_sinal_projeto ON public.projeto_sinal USING btree (projeto_id)
//   CREATE INDEX idx_sinal_status ON public.projeto_sinal USING btree (status)
//   CREATE INDEX idx_sinal_transacao ON public.projeto_sinal USING btree (transacao_id)
//   CREATE UNIQUE INDEX projeto_sinal_projeto_id_key ON public.projeto_sinal USING btree (projeto_id)
// Table: projetos
//   CREATE INDEX idx_projetos_arquiteto ON public.projetos USING btree (arquiteto_id)
//   CREATE INDEX idx_projetos_arquivado ON public.projetos USING btree (arquivado)
//   CREATE INDEX idx_projetos_cliente_id ON public.projetos USING btree (cliente_id)
//   CREATE INDEX idx_projetos_codigo ON public.projetos USING btree (codigo)
//   CREATE INDEX idx_projetos_created_by ON public.projetos USING btree (created_by)
//   CREATE INDEX idx_projetos_data_entrada ON public.projetos USING btree (data_entrada)
//   CREATE INDEX idx_projetos_nivel ON public.projetos USING btree (nivel_estrategico)
//   CREATE INDEX idx_projetos_nome ON public.projetos USING gin (to_tsvector('portuguese'::regconfig, nome))
//   CREATE INDEX idx_projetos_resp_obra ON public.projetos USING btree (responsavel_obra_id)
//   CREATE INDEX idx_projetos_responsavel ON public.projetos USING btree (responsavel_id)
//   CREATE INDEX idx_projetos_status ON public.projetos USING btree (status)
//   CREATE UNIQUE INDEX projetos_codigo_key ON public.projetos USING btree (codigo)
// Table: separacao_arquivos
//   CREATE INDEX idx_sep_arq_separacao ON public.separacao_arquivos USING btree (separacao_id)
// Table: separacao_itens
//   CREATE INDEX idx_sep_itens_produto ON public.separacao_itens USING btree (produto_id)
//   CREATE INDEX idx_sep_itens_separacao ON public.separacao_itens USING btree (separacao_id)
// Table: separacoes
//   CREATE INDEX idx_sep_cliente_id ON public.separacoes USING btree (cliente_id)
//   CREATE INDEX idx_sep_data_entrega ON public.separacoes USING btree (data_entrega)
//   CREATE INDEX idx_sep_projeto ON public.separacoes USING btree (projeto_id)
//   CREATE INDEX idx_sep_responsavel ON public.separacoes USING btree (responsavel_id)
//   CREATE INDEX idx_sep_status ON public.separacoes USING btree (status)
// Table: solicitacoes_compra
//   CREATE INDEX idx_solicit_aprovador ON public.solicitacoes_compra USING btree (aprovador_id)
//   CREATE INDEX idx_solicit_categoria ON public.solicitacoes_compra USING btree (categoria_id)
//   CREATE INDEX idx_solicit_projeto ON public.solicitacoes_compra USING btree (projeto_id)
//   CREATE INDEX idx_solicit_solicitante ON public.solicitacoes_compra USING btree (solicitante_id)
//   CREATE INDEX idx_solicit_status ON public.solicitacoes_compra USING btree (status)
//   CREATE INDEX idx_solicit_transacao ON public.solicitacoes_compra USING btree (transacao_id)
// Table: sync_history
//   CREATE INDEX idx_sync_executado_por ON public.sync_history USING btree (executado_por)
//   CREATE INDEX idx_sync_history_data ON public.sync_history USING btree (created_at DESC)
// Table: transacoes
//   CREATE INDEX idx_trans_categoria_id ON public.transacoes USING btree (categoria_id)
//   CREATE INDEX idx_trans_conta ON public.transacoes USING btree (conta_id)
//   CREATE INDEX idx_trans_created_by ON public.transacoes USING btree (created_by)
//   CREATE INDEX idx_trans_data ON public.transacoes USING btree (data_transacao DESC)
//   CREATE INDEX idx_trans_parcela ON public.transacoes USING btree (parcela_id)
//   CREATE INDEX idx_trans_projeto ON public.transacoes USING btree (projeto_id)
//   CREATE INDEX idx_trans_tipo ON public.transacoes USING btree (tipo)
// Table: usuarios
//   CREATE INDEX idx_usuarios_email ON public.usuarios USING btree (email)
//   CREATE INDEX idx_usuarios_role ON public.usuarios USING btree (role)
//   CREATE UNIQUE INDEX usuarios_email_key ON public.usuarios USING btree (email)
// Table: vendas_marca
//   CREATE UNIQUE INDEX vendas_marca_marca_id_mes_ano_key ON public.vendas_marca USING btree (marca_id, mes, ano)

