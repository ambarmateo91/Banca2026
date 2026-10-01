export interface TicketPrintData { lotteryName: string; ticketNumber: string; customerName?: string; customerPhone?: string; sellerName: string; price: number; drawDate: string; drawTime: string; issuedAt: string; prizes: Array<{ name: string; value: number; condition: string }>; }
export function formatTicketForPrint(data: TicketPrintData): string { return `BOLETO: ${data.ticketNumber}\nLotería: ${data.lotteryName}\nVendedor: ${data.sellerName}\nPrecio: ${formatCurrency(data.price)}\n`; }
export function generateTicketHTML(data: TicketPrintData): string { return `<html><body><pre>${formatTicketForPrint(data)}</pre></body></html>`; }
function formatCurrency(amount: number): string { return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount); }
