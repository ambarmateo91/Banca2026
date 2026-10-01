import { TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardStatsProps { totalSales: number; totalTickets: number; totalRevenue: number; activeUsers: number; }

export function DashboardStats({ totalSales, totalTickets, totalRevenue, activeUsers }: DashboardStatsProps) {
  const stats = [
    { title: 'Ventas Totales', value: totalSales, icon: TrendingUp, color: 'text-blue-600' },
    { title: 'Boletos Vendidos', value: totalTickets, icon: TrendingUp, color: 'text-green-600' },
    { title: 'Ingresos Totales', value: totalRevenue, icon: TrendingUp, color: 'text-purple-600' },
    { title: 'Usuarios Activos', value: activeUsers, icon: TrendingUp, color: 'text-orange-600' },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={cn('h-4 w-4', stat.color)} />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent>
        </Card>
      ))}
    </div>
  );
}
