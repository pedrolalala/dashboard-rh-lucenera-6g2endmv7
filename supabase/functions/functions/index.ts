import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

Deno.serve(async (req: Request) => {
  return new Response(JSON.stringify({ error: 'Function not implemented' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  })
})
