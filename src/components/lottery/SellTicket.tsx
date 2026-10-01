'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { lotteryApi, ticketApi } from '@/lib/api';
import type { Lottery } from '@/types/lottery';
import { Loader2, CreditCard, Ticket as TicketIcon } from 'lucide-react';

const sellSchema = z.object({ lotteryId: z.string().min(1, 'Selecciona una lotería'), quantity: z.coerce.number().min(1, 'Mínimo 1').max(100, 'Máximo 100'), customerName: z.string().optional(), customerPhone: z.string().optional() });
type SellForm = z.infer<typeof sellSchema>;

export function SellTicket() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLottery, setSelectedLottery] = useState<Lottery | null>(null);
  const { register, handleSubmit, watch, setValue } = useForm<SellForm>({ resolver: zodResolver(sellSchema), defaultValues: { quantity: 1 } });
  const quantity = watch('quantity');

  const loadLotteries = async () => { try { const data = await lotteryApi.getAll(); setLotteries(data); } catch { toast({ title: 'Error', description: 'No se pudieron cargar las loterías', variant: 'destructive' }); } };
  const handleLotteryChange = (lotteryId: string) => { const lottery = lotteries.find(l => l.id === lotteryId); setSelectedLottery(lottery || null); setValue('lotteryId', lotteryId); };

  const onSubmit = async (data: SellForm) => {
    if (!user) { toast({ title: 'Error', description: 'Debes iniciar sesión', variant: 'destructive' }); return; }
    const validation = await validateTicketSale(data.lotteryId, data.quantity);
    if (!validation.valid) { toast({ title: 'Error', description: validation.error, variant: 'destructive' }); return; }
    setLoading(true);
    try { await ticketApi.sell({ lottery_id: data.lotteryId, quantity: data.quantity, customer_name: data.customerName, customer_phone: data.customerPhone, seller_id: user.id }); toast({ title: 'Éxito', description: `${data.quantity} boleto(s) vendido(s) correctamente`, variant: 'success' }); setValue('quantity', 1); setValue('customerName', ''); setValue('customerPhone', ''); loadLotteries(); }
    catch { toast({ title: 'Error', description: 'No se pudo vender el boleto', variant: 'destructive' }); }
    finally { setLoading(false); }
  };

  const total = selectedLottery ? quantity * selectedLottery.price : 0;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><TicketIcon className="h-5 w-5" />Vender Boletos</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2"><Label htmlFor="lotteryId">Lotería *</Label>
            <Select onValueChange={handleLotteryChange}><SelectTrigger><SelectValue placeholder="Selecciona una lotería" /></SelectTrigger><SelectContent>{lotteries.map(lottery => <SelectItem key={lottery.id} value={lottery.id}>{lottery.name} - ${lottery.price.toFixed(2)}</SelectItem>)}</SelectContent></Select>
            {register('lotteryId') && <p className="text-sm text-red-500">Selecciona una lotería</p>}
          </div>
          {selectedLottery && <div className="space-y-2 p-4 bg-muted rounded-lg"><div className="flex justify-between"><span>Precio unitario:</span><span className="font-semibold">${selectedLottery.price.toFixed(2)}</span></div><div className="flex justify-between"><span>Disponibles:</span><span>{selectedLottery.max_tickets - selectedLottery.sold_tickets}</span></div></div>}
          <div className="space-y-2"><Label htmlFor="quantity">Cantidad *</Label><Input type="number" min="1" {...register('quantity')} className="w-24" /></div>
          <div className="space-y-2"><Label htmlFor="customerName">Nombre del cliente (opcional)</Label><Input {...register('customerName')} placeholder="Juan Pérez" /></div>
          <div className="space-y-2"><Label htmlFor="customerPhone">Teléfono (opcional)</Label><Input type="tel" {...register('customerPhone')} placeholder="+34 600 000 000" /></div>
          {selectedLottery && <div className="flex justify-between text-lg font-semibold pt-4 border-t"><span>Total:</span><span>${total.toFixed(2)}</span></div>}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end"><Button type="submit" disabled={loading || !selectedLottery} className="w-full sm:w-auto">{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : <><CreditCard className="mr-2 h-4 w-4" />Vender</>}</Button></CardFooter>
    </Card>
  );
}

async function validateTicketSale(lotteryId: string, quantity: number): Promise<{ valid: boolean; error?: string }> {
  try { const lottery = await lotteryApi.getById(lotteryId); if (lottery.sold_tickets + quantity > lottery.max_tickets) return { valid: false, error: 'No hay suficientes boletos disponibles' }; return { valid: true }; }
  catch { return { valid: false, error: 'Error al validar la lotería' }; }
}