export function cn(...inputs: (string | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}

export function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES');
}
