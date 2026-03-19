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

    // Buscar contexto no banco de dados
    const { data: projetos, error: projetosError } = await supabaseClient
      .from('projetos')
      .select('nome, responsavel, status, prazo, valor, observacoes')

    const { data: precos, error: precosError } = await supabaseClient
      .from('tabela_precos')
      .select('servico, categoria, preco, vigencia, observacao')

    if (projetosError || precosError) {
      console.error('Erro ao acessar o banco de dados:', projetosError || precosError)
      return new Response(
        JSON.stringify({ error: 'Erro ao buscar dados de contexto no banco de dados.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const systemPrompt = `Você é um assistente virtual inteligente de um portal corporativo.
Responda à pergunta do usuário de forma clara, objetiva e profissional, baseando-se EXCLUSIVAMENTE nos dados em JSON fornecidos abaixo.
Formate sua resposta em texto simples, utilizando quebras de linha e marcadores clássicos (como • ou -) para listas, caso seja necessário listar itens. Não utilize formatações complexas de Markdown (como asteriscos ** para negrito).
Se a informação necessária para responder não constar nos dados abaixo, informe educadamente que você não possui essa informação no momento e não invente dados.

=== DADOS DE PROJETOS ===
${JSON.stringify(projetos)}

=== DADOS DE TABELA DE PREÇOS ===
${JSON.stringify(precos)}`

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
