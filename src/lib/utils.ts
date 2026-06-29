/* General utility functions (exposes cn) */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges multiple class names into a single string
 * @param inputs - Array of class names
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add any other utility functions here

export function formatCurrency(value: number | null | undefined): string {
  const num = Number(value)
  if (value === null || value === undefined || isNaN(num)) {
    return 'Não informado'
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num)
}

export function displayOrNa(value: string | null | undefined): string {
  if (!value || value.trim() === '') return 'Não informado'
  return value
}
