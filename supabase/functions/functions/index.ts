import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

Deno.serve(async (req: Request) => {
  return new Response(JSON.stringify({ error: 'Endpoint not configured' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  })
})
