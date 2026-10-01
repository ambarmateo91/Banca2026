'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ticketApi } from '@/lib/api';
import { Search, Loader2 } from 'lucide-react';

const verifySchema = z.object({ ticketNumber: z.string().min(1, 'Ingresa el número de boleto') });
type VerifyForm = z.infer<typeof verifySchema>;

export function VerifyPrize() {
  const { toast } = useToast();
  const [checking, setChecking] = useState(false);
  const { register, handleSubmit } = useForm<VerifyForm>({ resolver: zodResolver(verifySchema) });

  const onSubmit = async (data: VerifyForm) => {
    setChecking(true);
    try {
      const result = await ticketApi.verify(data.ticketNumber);
      if (!result) { toast({ title: 'No encontrado', description: 'El boleto no existe', variant: 'destructive' }); return; }
      toast({ title: 'Boleto encontrado', description: `Estado: ${result.status}`, variant: 'default' });
    } catch { toast({ title: 'Error', description: 'Error al verificar el boleto', variant: 'destructive' }); }
    finally { setChecking(false); }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" />Verificar Premio</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2"><Label htmlFor="ticketNumber">Número de Boleto *</Label>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="ticketNumber" {...register('ticketNumber')} placeholder="TKT-123456789-0" className="pl-10" disabled={checking} /></div>
          </div>
          <Button type="submit" disabled={checking} className="w-full">{checking ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando...</> : <><Search className="mr-2 h-4 w-4" />Verificar</>}</Button>
        </form>
      </CardContent>
    </Card>
  );
}