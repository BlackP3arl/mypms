import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    'bg-slate-100': 'bg-slate-100 border-slate-200',
    'bg-blue-100': 'bg-blue-100 border-blue-200',
    'bg-green-100': 'bg-green-100 border-green-200',
    'bg-red-100': 'bg-red-100 border-red-200',
    'bg-yellow-100': 'bg-yellow-100 border-yellow-200',
    'bg-purple-100': 'bg-purple-100 border-purple-200',
    'bg-pink-100': 'bg-pink-100 border-pink-200',
    'bg-indigo-100': 'bg-indigo-100 border-indigo-200',
  }
  return colorMap[color] || 'bg-slate-100 border-slate-200'
}

export const COLUMN_COLORS = [
  'bg-slate-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-red-100',
  'bg-yellow-100',
  'bg-purple-100',
  'bg-pink-100',
  'bg-indigo-100',
]
