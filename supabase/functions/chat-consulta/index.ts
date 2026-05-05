import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()

    if (!query) {
      return new Response(JSON.stringify({ error: 'A pergunta (query) é obrigatória.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const authHeader = req.headers.get('Authorization')

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado. Faça login para usar o chat.' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    // Obter dados do usuário logado
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Não foi possível autenticar o usuário no chat.' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // Identificar role do usuário
    const { data: userData } = await supabaseClient
      .from('usuarios')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = userData?.role || 'funcionario'

    // Identificar funcionario_id caso seja colaborador
    const { data: funcData } = await supabaseClient
      .from('funcionarios')
      .select('id')
      .eq('usuario_id', user.id)
      .maybeSingle()

    const funcionarioId = funcData?.id

    // Preparar queries baseadas no perfil
    let feriasQuery = supabaseClient.from('vw_controle_ferias_clt').select('*')
    let faltasQuery = supabaseClient
      .from('vw_historico_faltas')
      .select('*')
      .order('data_falta', { ascending: false })
      .limit(100)

    if (role === 'funcionario' || role === 'viewer') {
      if (!funcionarioId) {
        return new Response(
          JSON.stringify({
            reply:
              'Seu perfil de colaborador ainda não foi vinculado a um registro de funcionário no sistema. Procure o RH.',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
      feriasQuery = feriasQuery.eq('funcionario_id', funcionarioId)
      faltasQuery = faltasQuery.eq('funcionario_id', funcionarioId)
    }

    const [
      { data: feriasContext, error: feriasError },
      { data: faltasContext, error: faltasError },
    ] = await Promise.all([feriasQuery, faltasQuery])

    if (feriasError || faltasError) {
      console.error('Erro ao acessar o banco de dados:', feriasError || faltasError)
      return new Response(JSON.stringify({ error: 'Erro ao buscar contexto no banco de dados.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const systemPrompt = `Você atua como o Gestor de Inteligência de RH da Lucenera.
Sua operação deve se adaptar estritamente ao nível de permissão do usuário logado.

NÍVEL DE PERMISSÃO ATUAL: ${role.toUpperCase()}

=== REGRAS DE ATUAÇÃO ===
1. Visão Administrador (Gestão Global) - Aplicável se a permissão for ADMIN ou GERENTE:
- Ao receber solicitações, você pode consultar o histórico de qualquer colaborador ou da empresa como um todo.
- Para detalhamento de faltas, utilize os dados da view vw_historico_faltas fornecidos. Se o gestor perguntar por um nome específico, filtre os resultados. Se pedir o histórico geral, liste as ocorrências de todos os funcionários.
- Sempre que um saldo estiver reduzido, identifique o total de faltas e explique a aplicação da faixa da CLT (Art. 130), reforçando que a base são 30 dias de férias.

2. Visão Colaborador (Self-Service) - Aplicável se a permissão for FUNCIONARIO ou VIEWER:
- Restrinja as respostas APENAS aos dados do próprio usuário logado (os dados JSON já estão filtrados para o funcionário logado). Nunca forneça dados de terceiros, mesmo que solicitado.
- O foco deve ser a transparência: mostre ao funcionário exatamente quais datas foram registradas como faltas injustificadas para que ele entenda a redução no seu saldo.
- Resumo de férias: mostre Período Atual, Dias de Direito, Dias Gozados e Saldo Restante. Se o direito for menor que 30, explique que é devido às faltas injustificadas no período.

3. Padrão de Resposta para Histórico de Faltas:
- Apresente os dados em ordem cronológica inversa (da mais recente para a mais antiga).
- Formate a resposta com: Funcionário (apenas se for ADMIN ou GERENTE), Data da Ocorrência, Status (Justificada/Injustificada), Justificativa (se houver) e o Período Aquisitivo impactado.

4. Regra de Negócio (CLT Art. 130):
- Base de cálculo: 30 dias de direito.
- Reduções automáticas aplicadas:
  • 0 a 5 faltas injustificadas: 30 dias
  • 6 a 14 faltas injustificadas: 24 dias
  • 15 a 23 faltas injustificadas: 18 dias
  • 24 a 32 faltas injustificadas: 12 dias
  • Mais de 32 faltas injustificadas: 0 dias

5. Visualização por Cards:
- Sempre que solicitado um resumo de um funcionário, apresente os dados estruturados como um 'Card de Período', destacando: Período Aquisitivo, Faltas Injustificadas, Dias de Direito, Dias Gozados e Saldo.

Responda de forma clara, educada, objetiva e profissional, baseando-se EXCLUSIVAMENTE nos dados em JSON fornecidos abaixo. Não invente ou presuma dados que não estejam no contexto. Se não encontrar a informação solicitada nos dados JSON, diga que não tem essa informação no momento.
Formate sua resposta em texto simples, utilizando quebras de linha e marcadores clássicos (como • ou -). Não utilize formatações complexas de Markdown como asteriscos duplos (**) para negrito.

=== DADOS DE FÉRIAS E SALDOS (vw_controle_ferias_clt) ===
${JSON.stringify(feriasContext)}

=== HISTÓRICO DE FALTAS (vw_historico_faltas) ===
${JSON.stringify(faltasContext)}`

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Chave da API do Gemini não está configurada no servidor.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // Chamada para a API do Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\n=== PERGUNTA DO USUÁRIO ===\n${query}` }],
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Erro na API do Gemini:', errorData)
      return new Response(
        JSON.stringify({ error: 'Erro ao processar a resposta com a Inteligência Artificial.' }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const aiData = await response.json()
    const reply =
      aiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Desculpe, não consegui formular uma resposta clara com os dados disponíveis.'

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Erro na Edge Function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno no processamento do chat.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
