"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import {
  CreditCard,
  Receipt,
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Eye
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

export default function MisPagosPage() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBoletaModalOpen, setIsBoletaModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)

  useEffect(() => {
    if (user?.id) {
      fetchMyPayments()
    }
  }, [user])

  const fetchMyPayments = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`http://localhost:8081/api/pagos/historial/${user?.id}`)
      if (res.ok) {
        setPayments(await res.json())
      }
    } catch {
      toast.error("Error al cargar tus pagos")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAGADO":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-0 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Pagado
          </Badge>
        )
      case "PENDIENTE":
        return (
          <Badge className="bg-amber-500/10 text-amber-500 border-0 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pendiente
          </Badge>
        )
      case "RECHAZADO":
        return (
          <Badge className="bg-rose-500/10 text-rose-500 border-0 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Rechazado
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            {status}
          </Badge>
        )
    }
  }

  const verBoleta = (pago: any) => {
    setSelectedPayment(pago)
    setIsBoletaModalOpen(true)
  }

  const generarBoleta = async (pago: any) => {
    try {
      // @ts-ignore
      const jspdfModule = await import("jspdf/dist/jspdf.umd.min.js")
      const jsPDF = jspdfModule.jsPDF

      // Cargar logo
      const imgData = await new Promise<string>((resolve) => {
        const img = new window.Image()
        img.src = '/images/logo_brusben_light.png'
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          if (ctx) ctx.drawImage(img, 0, 0)
          resolve(canvas.toDataURL('image/png'))
        }
        img.onerror = () => resolve('')
      })

      // Formato ticket: 80mm de ancho
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [226, 800]
      })

      const w = 226
      let y = 15

      // HEADER
      if (imgData) {
        const logoWidth = 60
        const logoHeight = 22
        doc.addImage(imgData, 'PNG', (w - logoWidth) / 2, y, logoWidth, logoHeight)
        y += logoHeight + 5
      }

      doc.setFontSize(7)
      doc.setFont("courier", "normal")
      doc.text("Sistema de Aula Virtual", w / 2, y, { align: "center" })
      y += 8
      doc.text("RUC: 20409499849", w / 2, y, { align: "center" })
      y += 8
      doc.text("Chiclayo, Perú", w / 2, y, { align: "center" })
      y += 8
      doc.text("Tel: (01) 123-4567", w / 2, y, { align: "center" })
      y += 10

      doc.setLineWidth(0.5)
      doc.line(10, y, w - 10, y)
      y += 10

      // TIPO DOCUMENTO
      doc.setFontSize(10)
      doc.setFont("courier", "bold")
      doc.text("BOLETA DE VENTA", w / 2, y, { align: "center" })
      y += 10
      doc.setFontSize(8)
      doc.text(`N° ${String(pago.idPago).padStart(8, '0')}`, w / 2, y, { align: "center" })
      y += 10

      doc.line(10, y, w - 10, y)
      y += 10

      // CLIENTE
      doc.setFontSize(7)
      doc.setFont("courier", "bold")
      doc.text("CLIENTE:", 15, y)
      y += 8

      doc.setFont("courier", "normal")
      doc.text(`Nombre: ${user?.nombre || "Estudiante"}`, 15, y)
      y += 8
      doc.text(`Curso: ${pago.course}`, 15, y)
      y += 10

      doc.line(10, y, w - 10, y)
      y += 10

      // FECHA Y MÉTODO
      doc.setFont("courier", "normal")
      const monto = typeof pago.amount === 'string' ? parseFloat(pago.amount.replace(/[^\d.-]/g, "")) : pago.amount
      doc.text(`Fecha: ${new Date(pago.date).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, 15, y)
      y += 8
      doc.text(`Método: ${pago.method}`, 15, y)
      y += 11

      doc.line(10, y, w - 10, y)
      y += 10

      // DETALLE
      doc.setFont("courier", "bold")
      doc.text("DESCRIPCIÓN", 15, y)
      doc.text("IMPORTE", w - 15, y, { align: "right" })
      y += 8

      doc.line(10, y, w - 10, y)
      y += 8

      doc.setFont("courier", "normal")
      doc.text("Matrícula al curso", 15, y)
      y += 8
      doc.setFontSize(6)
      doc.setFont("courier", "italic")
      const cursoLines = doc.splitTextToSize(`${pago.course}`, w - 80)
      cursoLines.forEach((line: string) => {
        doc.text(line, 15, y)
        y += 7
      })
      y += 3

      doc.setFontSize(7)
      doc.setFont("courier", "normal")
      doc.text(`S/ ${monto.toFixed(2)}`, w - 15, y - 8, { align: "right" })
      y += 3

      doc.line(10, y, w - 10, y)
      y += 10

      // TOTALES
      doc.setFont("courier", "bold")
      doc.setFontSize(8)
      doc.text("SUBTOTAL:", 15, y)
      doc.text(`S/ ${monto.toFixed(2)}`, w - 15, y, { align: "right" })
      y += 10

      doc.text("IGV (0%):", 15, y)
      doc.text("S/ 0.00", w - 15, y, { align: "right" })
      y += 12

      doc.setLineWidth(1)
      doc.line(10, y, w - 10, y)
      y += 2
      doc.line(10, y, w - 10, y)
      y += 10

      doc.setFontSize(10)
      doc.text("TOTAL:", 15, y)
      doc.text(`S/ ${monto.toFixed(2)}`, w - 15, y, { align: "right" })
      y += 12

      doc.line(10, y, w - 10, y)
      y += 2
      doc.line(10, y, w - 10, y)
      y += 12

      // FOOTER
      doc.setFontSize(6)
      doc.setFont("courier", "normal")
      doc.text("¡Gracias por su preferencia!", w / 2, y, { align: "center" })
      y += 8
      doc.text("Conserve este documento", w / 2, y, { align: "center" })
      y += 8
      doc.text("para cualquier reclamo", w / 2, y, { align: "center" })
      y += 10

      doc.setFontSize(5)
      doc.text("Sistema generado por Brusben E.I.R.L", w / 2, y, { align: "center" })
      y += 15

      const finalHeight = y + 20
      doc.setPage(1)
      doc.internal.pageSize.height = finalHeight
      doc.internal.pageSize.setHeight(finalHeight)

      doc.save(`Boleta_Brusben_${String(pago.idPago).padStart(8, '0')}.pdf`)
      toast.success("Boleta descargada exitosamente")
    } catch (error) {
      console.error(error)
      toast.error("Error al generar la boleta")
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-3">
             <CreditCard className="h-6 w-6 text-primary" />
             Mis Pagos
          </h4>
          <p className="text-muted-foreground mt-1 font-medium text-sm">
            Historial de tus pagos e inscripciones a cursos.
          </p>
        </div>
      </div>

      <div className="border-0 shadow-sm rounded-3xl bg-card overflow-hidden">
        <div className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-b border-border/50 hover:bg-transparent">
                  <TableHead className="py-4 px-6 font-bold text-xs uppercase tracking-wider"></TableHead>
                  <TableHead className="py-4 px-6 font-bold text-xs uppercase tracking-wider">Curso</TableHead>
                  <TableHead className="py-4 px-6 font-bold text-center text-xs uppercase tracking-wider">Monto</TableHead>
                  <TableHead className="py-4 px-6 font-bold text-xs uppercase tracking-wider">Fecha</TableHead>
                  <TableHead className="py-4 px-6 font-bold text-xs uppercase tracking-wider">Método</TableHead>
                  <TableHead className="py-4 px-6 font-bold text-center text-xs uppercase tracking-wider">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-bold animate-pulse">
                      Cargando historial de pagos...
                    </TableCell>
                  </TableRow>
                ) : payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                        <Receipt className="h-10 w-10 text-slate-300" />
                        <p className="font-bold text-slate-500">No tienes pagos registrados aún.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((p) => (
                    <TableRow key={p.idPago} className="border-b border-border/40 hover:bg-muted/50 transition-colors group">
                      <TableCell className="px-6 py-4 w-20">
                        <div className="h-10 w-10 rounded-xl overflow-hidden bg-muted relative group/card">
                          <div className="absolute inset-0  bg-black/20 transition-all duration-300 flex items-center justify-center opacity-100">
                            <Eye className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-0">
                        <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                          {p.course}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                          ID #{p.idPago}
                        </p>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <span className="font-black text-sm text-foreground">
                          {p.amount}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm font-bold text-muted-foreground">
                        {p.date ? new Date(p.date).toLocaleDateString("es-PE", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        }) : "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm font-bold text-muted-foreground">
                        {p.method}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-9 px-4 rounded-xl text-black font-bold"
                          onClick={() => verBoleta(p)}
                          disabled={p.status !== "PAGADO"}
                          title="Ver Boleta"
                        >
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* MODAL VISTA PREVIA BOLETA */}
      <Dialog open={isBoletaModalOpen} onOpenChange={setIsBoletaModalOpen}>
        <DialogContent className="bg-card sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-border sticky top-0 bg-card z-10">
            <DialogTitle className="text-2xl font-black text-foreground">Vista Previa - Boleta</DialogTitle>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              Revisa la boleta de tu inscripción antes de descargarla
            </p>
          </div>

          {selectedPayment && (
            <div className="p-8">
              <div className="bg-white text-black p-6 rounded-lg shadow-lg border-2 border-dashed border-gray-300 text-sm max-w-[320px] mx-auto" style={{ fontFamily: 'Courier New, monospace' }}>
                
                {/* HEADER */}
                <div className="text-center border-b-2 border-gray-800 pb-3 mb-3">
                  <div className="flex justify-center mb-2">
                    <img 
                      src="/images/logo_brusben_light.png" 
                      alt="Brusben" 
                      className="h-12 object-contain"
                    />
                  </div>
                  <p className="text-xs mt-1">Sistema de Aula Virtual</p>
                  <p className="text-xs">RUC: 20409499849</p>
                  <p className="text-xs">Chiclayo, Perú</p>
                  <p className="text-xs">Tel: (+51) 994-995-141</p>
                </div>

                {/* TIPO DOCUMENTO */}
                <div className="text-center border-b border-gray-400 pb-2 mb-3">
                  <p className="font-black text-base">BOLETA DE VENTA</p>
                  <p className="text-sm font-bold">N° {String(selectedPayment.idPago).padStart(8, '0')}</p>
                </div>

                {/* CLIENTE */}
                <div className="border-b border-gray-400 pb-2 mb-3">
                  <p className="font-bold text-xs mb-1">CLIENTE:</p>
                  <p className="text-xs">Nombre: {user?.nombre || "Estudiante"}</p>
                  <p className="text-xs">Curso: {selectedPayment.course}</p>
                </div>

                {/* FECHA Y MÉTODO */}
                <div className="border-b border-gray-400 pb-2 mb-3 text-xs">
                  <p>Fecha: {new Date(selectedPayment.date).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                  <p>Método: {selectedPayment.method}</p>
                </div>

                {/* DETALLE */}
                <div className="border-b border-gray-400 pb-2 mb-3">
                  <div className="flex justify-between font-bold text-xs mb-2">
                    <span>DESCRIPCIÓN</span>
                    <span>IMPORTE</span>
                  </div>
                  <div className="border-t border-gray-400 pt-2">
                    <p className="text-xs mb-1">Matrícula al curso</p>
                    <p className="text-xs italic text-gray-600 mb-2">{selectedPayment.course}</p>
                    <div className="flex justify-between">
                      <span className="text-xs">Cantidad: 1</span>
                      <span className="text-xs font-bold">{selectedPayment.amount}</span>
                    </div>
                  </div>
                </div>

                {/* TOTALES */}
                <div className="border-b-2 border-gray-800 pb-2 mb-3 text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold">SUBTOTAL:</span>
                    <span>{selectedPayment.amount}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">IGV (0%):</span>
                    <span>S/ 0.00</span>
                  </div>
                  <div className="flex justify-between text-base font-black border-t-2 border-gray-800 pt-2">
                    <span>TOTAL:</span>
                    <span>{selectedPayment.amount}</span>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="text-center text-xs border-t border-gray-400 pt-3">
                  <p className="font-bold mb-1">¡Gracias por su preferencia!</p>
                  <p className="mb-1">Conserve este documento</p>
                  <p className="mb-2">para cualquier reclamo</p>
                  <p className="text-[10px] text-gray-600">Sistema generado por Brusben E.I.R.L</p>
                </div>

              </div>

              {/* BOTONES */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl font-bold"
                  onClick={() => setIsBoletaModalOpen(false)}
                >
                  Cerrar
                </Button>
                <Button
                  className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 font-black gap-2 text-white"
                  onClick={() => {
                    generarBoleta(selectedPayment)
                    setIsBoletaModalOpen(false)
                  }}
                >
                  <Download className="h-4 w-4" />
                  Descargar PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
