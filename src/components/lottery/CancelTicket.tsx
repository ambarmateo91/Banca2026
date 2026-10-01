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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ticketApi } from '@/lib/api';
import type { Ticket } from '@/types/lottery';
import { XCircle } from 'lucide-react';

const cancelSchema = z.object({ ticketNumber: z.string().min(1, 'Ingresa el número de boleto'), reason: z.string().min(5, 'Mínimo 5 caracteres') });
type CancelForm = z.infer<typeof cancelSchema>;

export function CancelTicket() {
  const { user } = useAuth();
  void user;
  const { toast } = useToast();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [searching, setSearching] = useState(false);
  const { register, handleSubmit, reset } = useForm<CancelForm>({ resolver: zodResolver(cancelSchema) });

  const searchTicket = async (data: { ticketNumber: string }) => {
    setSearching(true);
    try {
      const result = await ticketApi.verify(data.ticketNumber);
      if (!result) { toast({ title: 'No encontrado', description: 'El boleto no existe', variant: 'destructive' }); return; }
      if (result.status !== 'sold') { toast({ title: 'No cancelable', description: `El boleto está ${result.status}`, variant: 'destructive' }); return; }
      setTicket(result);
    } catch { toast({ title: 'Error', description: 'Error al buscar el boleto', variant: 'destructive' }); }
    finally { setSearching(false); }
  };

  const cancelTicket = async () => {
    if (!ticket) return;
    try {
      await ticketApi.cancel(ticket.id);
      toast({ title: 'Cancelado', description: 'El boleto ha sido cancelado', variant: 'success' });
      setTicket(null); reset();
    } catch { toast({ title: 'Error', description: 'No se pudo cancelar el boleto', variant: 'destructive' }); }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><XCircle className="h-5 w-5 text-destructive" />Cancelar Boleto</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {!ticket ? (
          <form onSubmit={handleSubmit(searchTicket)} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="ticketNumber">Número de Boleto *</Label><Input id="ticketNumber" {...register('ticketNumber')} placeholder="TKT-123456789-0" /></div>
            <Button type="submit" disabled={searching} className="w-full">Buscar Boleto</Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg"><p className="font-semibold">{ticket.ticket_number}</p><p className="text-sm text-muted-foreground">{ticket.lottery_id}</p></div>
            <form onSubmit={handleSubmit(() => {})} className="space-y-4">
              <div className="space-y-2"><Label htmlFor="reason">Razón de cancelación *</Label><Input id="reason" {...register('reason')} placeholder="Motivo de la cancelación..." /></div>
              <Button variant="destructive" onClick={cancelTicket} className="w-full">Confirmar Cancelación</Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}