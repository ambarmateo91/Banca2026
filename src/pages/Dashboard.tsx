'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardStats } from '@/components/dashboard/StatsCards';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { lotteryApi } from '@/lib/api';
import { Ticket, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const { isAdmin: _isAdmin } = useAuth();
  void _isAdmin;
  const [loading, setLoading] = useState(true);
  const [recentLotteries, setRecentLotteries] = useState<Array<{ id: string; name: string; sold_tickets: number; max_tickets: number; draw_date: string }>>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try { const data = await lotteryApi.getAll(); setRecentLotteries((data as Array<unknown>).slice(0, 5) as Array<{ id: string; name: string; sold_tickets: number; max_tickets: number; draw_date: string }>); } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    loadData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" /><p>Cargando dashboard...</p></div></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold tracking-tight">Dashboard</h1><p className="text-muted-foreground">Resumen del sistema de lotería</p></div>
      <DashboardStats totalSales={0} totalTickets={0} totalRevenue={0} activeUsers={0} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-2"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Ticket className="h-5 w-5" />Loterías Activas</CardTitle></CardHeader><CardContent>{recentLotteries.length === 0 ? <p className="text-center text-muted-foreground py-8">No hay loterías activas</p> : recentLotteries.map(renderLotteryItem)}</CardContent></Card></div>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Acciones Rápidas</CardTitle></CardHeader><CardContent><div className="space-y-2"><a href="/sell" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"><span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><span className="text-primary">💳</span></span><div><p className="font-medium">Vender Boletos</p></div></a></div></CardContent></Card>
      </div>
    </div>
  );
}

function renderLotteryItem(lottery: { id: string; name: string; sold_tickets: number; max_tickets: number; draw_date: string }) {
  return (
    <div key={lottery.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
      <div><p className="font-medium">{lottery.name}</p><p className="text-sm text-muted-foreground">{new Date(lottery.draw_date).toLocaleDateString('es-ES')}</p></div>
      <div className="text-right"><p className="font-semibold">{lottery.sold_tickets} / {lottery.max_tickets}</p><p className="text-sm text-muted-foreground">{Math.round((lottery.sold_tickets / lottery.max_tickets) * 100)}%</p></div>
    </div>
  );
}