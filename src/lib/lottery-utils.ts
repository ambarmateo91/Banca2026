export async function getActiveLotteries(): Promise<Array<unknown>> { return []; }
export function validateTicketSale(lotteryId: string, quantity: number): { valid: boolean; error?: string } { void lotteryId; void quantity; return { valid: true }; }
export function calculateCommission(amount: number, rate: number = 0.1): number { return Math.round(amount * rate * 100) / 100; }