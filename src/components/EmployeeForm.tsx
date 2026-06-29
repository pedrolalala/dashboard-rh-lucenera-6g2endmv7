import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { type Employee } from '@/pages/Funcionarios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
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
  nome: z.string().min(2, 'Nome muito curto. Insira o nome completo.'),
  cargo: z.string().optional(),
  data_admissao: z.string().optional(),
  ativo: z.boolean().default(true),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  data_nascimento: z.string().optional(),
  endereco: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email('E-mail inválido.').optional().or(z.literal('')),
  salario_base: z.coerce.number().optional(),
  salario_por_fora: z.coerce.number().optional(),
  comissao_percentual: z.coerce.number().optional(),
  salario_liquido: z.coerce.number().optional(),
  empresa: z.string().optional(),
  valor_vt_dia: z.coerce.number().optional(),
})

type FormData = z.infer<typeof schema>

interface EmployeeFormProps {
  employee?: Employee
  onSubmit: (data: any) => void
  onCancel: () => void
}

const Field = ({ control, name, label, type = 'text', placeholder = '' }: any) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="uppercase text-[10px] tracking-widest">{label}</FormLabel>
        <FormControl>
          <Input
            type={type}
            placeholder={placeholder}
            {...field}
            value={field.value ?? ''}
            step={type === 'number' ? '0.01' : undefined}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)

export function EmployeeForm({ employee, onSubmit, onCancel }: EmployeeFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: employee
      ? {
          nome: employee.nome,
          cargo: employee.cargo || '',
          data_admissao: employee.data_admissao
            ? new Date(employee.data_admissao).toISOString().split('T')[0]
            : '',
          ativo: employee.ativo,
          cpf: employee.cpf || '',
          rg: employee.rg || '',
          data_nascimento: employee.data_nascimento
            ? new Date(employee.data_nascimento).toISOString().split('T')[0]
            : '',
          endereco: employee.endereco || '',
          telefone: employee.telefone || '',
          email: employee.email || '',
          salario_base: employee.salario_base || 0,
          salario_por_fora: employee.salario_por_fora || 0,
          comissao_percentual: employee.comissao_percentual || 0,
          salario_liquido: employee.salario_liquido || 0,
          empresa: employee.empresa || '',
          valor_vt_dia: employee.valor_vt_dia || 0,
        }
      : {
          nome: '',
          cargo: '',
          data_admissao: '',
          ativo: true,
          cpf: '',
          rg: '',
          data_nascimento: '',
          endereco: '',
          telefone: '',
          email: '',
          salario_base: 0,
          salario_por_fora: 0,
          comissao_percentual: 0,
          salario_liquido: 0,
          empresa: '',
          valor_vt_dia: 0,
        },
  })

  const handleSubmit = (data: FormData) => {
    onSubmit({
      ...data,
      email: data.email || undefined,
      data_nascimento: data.data_nascimento || undefined,
      data_admissao: data.data_admissao || undefined,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Field
          control={form.control}
          name="nome"
          label="Nome Completo *"
          placeholder="Ex: João da Silva"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            control={form.control}
            name="cargo"
            label="Cargo"
            placeholder="Ex: Analista Pleno"
          />
          <Field control={form.control} name="data_admissao" label="Data de Admissão" type="date" />
        </div>

        <FormField
          control={form.control}
          name="endereco"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="uppercase text-[10px] tracking-widest">
                Endereço Completo
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Rua, Número, Complemento, Bairro, Cidade - UF, CEP"
                  className="resize-none"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            control={form.control}
            name="email"
            label="E-mail"
            type="email"
            placeholder="joao@lucenera.com"
          />
          <Field
            control={form.control}
            name="telefone"
            label="Telefone"
            placeholder="(11) 99999-9999"
          />
          <Field control={form.control} name="cpf" label="CPF" placeholder="000.000.000-00" />
          <Field control={form.control} name="rg" label="RG" placeholder="00.000.000-0" />
          <Field
            control={form.control}
            name="data_nascimento"
            label="Data de Nascimento"
            type="date"
          />
          <FormField
            control={form.control}
            name="empresa"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-[10px] tracking-widest">Empresa</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="islight">Islight</SelectItem>
                    <SelectItem value="Manoela">Manoela</SelectItem>
                    <SelectItem value="Foco">Foco</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t border-border pt-4 space-y-4">
          <h3 className="uppercase text-[10px] tracking-widest text-muted-foreground">
            Dados Financeiros
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              control={form.control}
              name="salario_base"
              label="Salário Base (R$)"
              type="number"
            />
            <Field
              control={form.control}
              name="salario_liquido"
              label="Salário Líquido (R$)"
              type="number"
            />
            <Field
              control={form.control}
              name="salario_por_fora"
              label="Salário por Fora (R$)"
              type="number"
              placeholder="0.00"
            />
            <Field
              control={form.control}
              name="comissao_percentual"
              label="Comissão Padrão (%)"
              type="number"
            />
            <Field
              control={form.control}
              name="valor_vt_dia"
              label="Vale Transporte / Dia (R$)"
              type="number"
              placeholder="0.00"
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="ativo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between border-border border p-3 bg-muted/10">
              <div className="space-y-0.5">
                <FormLabel className="uppercase text-[10px] tracking-widest">
                  Status Ativo
                </FormLabel>
                <p className="text-xs text-muted-foreground">
                  Desative para suspender o colaborador.
                </p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="uppercase text-[10px] tracking-widest"
          >
            Cancelar
          </Button>
          <Button type="submit" className="uppercase text-[10px] tracking-widest">
            {employee ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
