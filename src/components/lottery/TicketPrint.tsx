'use client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Printer, Download } from 'lucide-react';

interface PrintableTicket { id: string; ticket_number: string; lottery_name?: string; customer_name?: string; seller_name: string; price?: number; draw_date?: string; sold_at: string; }

export function TicketPrint({ ticket }: { ticket?: PrintableTicket }) {
  const handlePrint = () => { if (!ticket) return; const printWindow = window.open('', '_blank'); if (printWindow) { printWindow.document.write(`<html><body style="font-family:monospace;padding:20px"><pre>TICKET: ${ticket.ticket_number}\nLotería: ${ticket.lottery_name || 'Lotería'}\nVendedor: ${ticket.seller_name}\nPrecio: ${ticket.price || 0}\n</pre></body></html>`); printWindow.document.close(); printWindow.print(); } };
  const handleDownload = () => { if (!ticket) return; const html = `<html><body><pre>TICKET: ${ticket.ticket_number}</pre></body></html>`; const blob = new Blob([html], { type: 'text/html' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `ticket-${ticket.ticket_number}.html`; a.click(); };

  if (!ticket) return <Card className="w-full max-w-md mx-auto"><CardHeader><CardTitle className="flex items-center gap-2"><Printer className="h-5 w-5" />Imprimir Ticket</CardTitle></CardHeader><CardContent><p className="text-muted-foreground text-center py-8">Selecciona un boleto para imprimir</p></CardContent></Card>;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Printer className="h-5 w-5" />Ticket: {ticket.ticket_number}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex justify-between"><span>Lotería:</span><span className="font-semibold">{ticket.lottery_name}</span></div>
          <div className="flex justify-between"><span>Número:</span><span className="font-mono">{ticket.ticket_number}</span></div>
          <div className="flex justify-between"><span>Vendedor:</span><span>{ticket.seller_name}</span></div>
          {ticket.customer_name && <div className="flex justify-between"><span>Cliente:</span><span>{ticket.customer_name}</span></div>}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2"><Button variant="outline" onClick={handleDownload}><Download className="mr-2 h-4 w-4" />Descargar HTML</Button><Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" />Imprimir</Button></CardFooter>
    </Card>
  );
}