import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().optional(),
  vaga: z.string().optional(),
  file: z.any().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function CandidatoForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: '', email: '', telefone: '', vaga: '' },
  })

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      let curriculo_url = null

      if (values.file && values.file instanceof File) {
        const fileExt = values.file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('Arquivo-recrutamento')
          .upload(fileName, values.file)

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from('Arquivo-recrutamento')
          .getPublicUrl(fileName)

        curriculo_url = publicUrlData.publicUrl
      }

      const { error: insertError } = await supabase.from('candidatos').insert({
        nome: values.nome,
        email: values.email,
        telefone: values.telefone || null,
        vaga: values.vaga || null,
        curriculo_url,
        status: 'Em Análise',
      })

      if (insertError) throw insertError

      toast({ title: 'Sucesso', description: 'Candidato cadastrado com sucesso!' })
      form.reset()
      onSuccess()
    } catch (error: any) {
      console.error(error)
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao cadastrar candidato',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: João da Silva" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Ex: joao@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="(11) 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vaga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vaga / Cargo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Desenvolvedor Frontend" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="file"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Currículo (Anexo)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="cursor-pointer file:cursor-pointer file:bg-primary/10 file:text-primary file:font-medium file:border-0 file:rounded-sm file:px-3 file:py-1 file:mr-3 text-muted-foreground"
                    onChange={(event) => onChange(event.target.files?.[0])}
                    {...fieldProps}
                  />
                </FormControl>
                <FormDescription>Formatos aceitos: PDF, DOC, DOCX.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Cadastrar Candidato'
          )}
        </Button>
      </form>
    </Form>
  )
}
