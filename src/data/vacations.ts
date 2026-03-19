import { addDays, subDays } from 'date-fns'
import { employees } from './mock'

export type VacationStatus = 'Pendente' | 'Aprovado' | 'Rejeitado'

export interface VacationRequest {
  id: string
  employeeId: string
  employeeName: string
  department: string
  startDate: Date
  endDate: Date
  days: number
  status: VacationStatus
}

const today = new Date()

export const initialRequests: VacationRequest[] = [
  {
    id: 'req-1',
    employeeId: employees[0].id,
    employeeName: employees[0].name,
    department: employees[0].department,
    startDate: addDays(today, 5),
    endDate: addDays(today, 19),
    days: 15,
    status: 'Aprovado',
  },
  {
    id: 'req-2',
    employeeId: employees[1].id,
    employeeName: employees[1].name,
    department: employees[1].department,
    startDate: subDays(today, 2),
    endDate: addDays(today, 9),
    days: 12,
    status: 'Aprovado',
  },
  {
    id: 'req-3',
    employeeId: employees[2].id,
    employeeName: employees[2].name,
    department: employees[2].department,
    startDate: addDays(today, 10),
    endDate: addDays(today, 19),
    days: 10,
    status: 'Pendente',
  },
  {
    id: 'req-4',
    employeeId: employees[3].id,
    employeeName: employees[3].name,
    department: employees[3].department,
    startDate: addDays(today, 15),
    endDate: addDays(today, 24),
    days: 10,
    status: 'Rejeitado',
  },
  {
    id: 'req-5',
    employeeId: employees[4].id,
    employeeName: employees[4].name,
    department: employees[4].department,
    startDate: addDays(today, 1),
    endDate: addDays(today, 20),
    days: 20,
    status: 'Pendente',
  },
]
