'use client';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutDashboard, CreditCard, Search, Printer, RotateCcw, LogOut, Menu, X } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Vender Boletos', href: '/sell', icon: CreditCard },
  { name: 'Verificar Premio', href: '/verify', icon: Search },
  { name: 'Imprimir Ticket', href: '/print', icon: Printer },
  { name: 'Cancelar Boleto', href: '/cancel', icon: RotateCcw },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => { await signOut(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={cn('fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r transition-transform duration-200 lg:translate-x-0', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link to="/" className="font-bold text-xl">Lotería</Link>
          <button className="lg:hidden p-2" onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex flex-1 flex-col px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return <Link key={item.name} to={item.href} className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors', isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground')} onClick={() => setSidebarOpen(false)}>
              <item.icon className="h-5 w-5" />{item.name}
            </Link>;
          })}
        </nav>
        <div className="p-3 border-t">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{user?.email}</p></div>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleSignOut}><LogOut className="h-4 w-4" />Cerrar sesión</Button>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
          <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></button>
          <div className="flex-1" />
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
