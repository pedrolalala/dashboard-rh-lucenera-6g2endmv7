const names = [
  'Ana Silva',
  'Carlos Santos',
  'Bruna Costa',
  'Diego Oliveira',
  'Eduarda Lima',
  'Fábio Souza',
  'Gabriela Pereira',
  'Henrique Alves',
  'Isabela Ribeiro',
  'João Carvalho',
  'Karina Mendes',
  'Lucas Rocha',
  'Mariana Fernandes',
  'Nicolas Barbosa',
  'Olívia Castro',
  'Pedro Martins',
  'Quintino Ramos',
  'Rafaela Melo',
  'Samuel Teixeira',
  'Tatiana Correia',
  'Ubirajara Nunes',
  'Vitória Dias',
  'Wagner Morais',
]
const depts = ['TI', 'Vendas', 'RH', 'Operações', 'Financeiro']
const roles = ['Analista', 'Especialista', 'Coordenador(a)', 'Assistente', 'Gerente']

export const employees = names.map((name, i) => ({
  id: String(i + 1).padStart(3, '0'),
  name,
  department: depts[i % depts.length],
  role: roles[i % roles.length],
  status: i >= 21 ? 'Inativo' : 'Ativo',
  email: `${name.split(' ')[0].toLowerCase()}@lucenera.com`,
}))

export const dashboardStats = {
  total: 23,
  departments: 5,
  active: 21,
  inactive: 2,
}

export const chartData = [
  { sector: 'TI', value: 6, fill: 'var(--color-chart-1)' },
  { sector: 'Vendas', value: 5, fill: 'var(--color-chart-2)' },
  { sector: 'RH', value: 4, fill: 'var(--color-chart-3)' },
  { sector: 'Operações', value: 5, fill: 'var(--color-chart-4)' },
  { sector: 'Financeiro', value: 3, fill: 'var(--color-chart-5)' },
]

export const recentActivities = [
  { id: 1, action: 'Novo funcionário admitido', target: 'Vitória Dias', time: 'Hoje, 09:30' },
  { id: 2, action: 'Férias aprovadas', target: 'Carlos Santos', time: 'Ontem, 14:15' },
  { id: 3, action: 'Avaliação concluída', target: 'TI Departamento', time: 'Ontem, 16:45' },
  { id: 4, action: 'Ajuste de ponto', target: 'Diego Oliveira', time: '2 dias atrás' },
]

export const vacationData = [
  { id: 1, name: 'Ana Silva', start: '2024-07-10', end: '2024-07-25', remaining: 15, total: 30 },
  { id: 2, name: 'Fábio Souza', start: '2024-08-01', end: '2024-08-15', remaining: 30, total: 30 },
  {
    id: 3,
    name: 'Mariana Fernandes',
    start: '2024-06-20',
    end: '2024-07-05',
    remaining: 0,
    total: 30,
  },
]

export const payrollData = [
  { month: 'Junho/2024', status: 'Processado', total: 'R$ 145.230,00', date: '30/06/2024' },
  { month: 'Maio/2024', status: 'Processado', total: 'R$ 142.100,00', date: '31/05/2024' },
  { month: 'Abril/2024', status: 'Processado', total: 'R$ 140.500,00', date: '30/04/2024' },
]
