import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

Deno.serve(async (req) => {
  return new Response(JSON.stringify({ message: 'ok' }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
