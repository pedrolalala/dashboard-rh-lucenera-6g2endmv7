import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { type Employee } from '@/pages/Funcionarios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const schema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  admissionDate: z.string().optional(),
  department: z.string().min(1, 'Selecione um departamento'),
  role: z.string().optional(),
  salary: z.coerce.number().optional(),
  status: z.enum(['Ativo', 'Inativo']),
})

interface EmployeeFormProps {
  employee?: Employee
  departments: { id: string; nome: string }[]
  onSubmit: (data: z.infer<typeof schema>) => void
  onCancel: () => void
}

export function EmployeeForm({ employee, departments, onSubmit, onCancel }: EmployeeFormProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: employee || {
      name: '',
      email: '',
      phone: '',
      cpf: '',
      admissionDate: '',
      department: '',
      role: '',
      salary: 0,
      status: 'Ativo',
    },
  })

  const Field = ({ name, label, type = 'text', placeholder = '' }: any) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Field name="name" label="Nome Completo" placeholder="Ex: João da Silva" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field name="email" label="E-mail" type="email" placeholder="joao@lucenera.com" />
          <Field name="phone" label="Telefone" placeholder="(11) 99999-9999" />
          <Field name="cpf" label="CPF" placeholder="000.000.000-00" />
          <Field name="admissionDate" label="Data de Admissão" type="date" />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.nome}>
                        {d.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Field name="role" label="Cargo" placeholder="Ex: Analista Pleno" />
          <Field name="salary" label="Salário Base (R$)" type="number" />
        </div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Status Ativo</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value === 'Ativo'}
                  onCheckedChange={(c) => field.onChange(c ? 'Ativo' : 'Inativo')}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-secondary text-secondary-foreground">
            Salvar Colaborador
          </Button>
        </div>
      </form>
    </Form>
  )
}
