 "use client"

import { useState, useEffect } from "react"
import { DollarSign, Plus, Download, User, BookOpen, CreditCard, Search, MoreVertical, Trash2, Receipt } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Egreso {
  idEgreso: number
  docente: string
  docenteDni: string
  docenteEmail: string
  docenteCelular: string
  curso: string
  monto: number
  concepto: string
  metodoPago: string
  nroOperacion: string
  fechaEgreso: string
  estado: string
}

interface Docente {
  idUsuario: number
  nombres: string
  dni: string
  email: string
  nmrCelular: string
}

interface Curso {
  idCurso: number
  titulo: string
  precioCurso: number
}

export default function EgresosPage() {
  const [egresos, setEgresos] = useState<Egreso[]>([])
  const [docentes, setDocentes] = useState<Docente[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBoletaModalOpen, setIsBoletaModalOpen] = useState(false)
  const [selectedEgreso, setSelectedEgreso] = useState<Egreso | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [formData, setFormData] = useState({
    idDocente: "",
    idCurso: "",
    monto: "",
    concepto: "Pago por creación de módulos del curso",
    metodoPago: "TRANSFERENCIA",
    nroOperacion: ""
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [egresosRes, docentesRes] = await Promise.all([
        fetch("http://localhost:8081/api/egresos-docentes"),
        fetch("http://localhost:8081/api/egresos-docentes/docentes")
      ])
      setEgresos(await egresosRes.json())
      setDocentes(await docentesRes.json())
    } catch {
      toast.error("Error al conectar con el servidor")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDocenteChange = async (idDocente: string) => {
    setFormData({ ...formData, idDocente, idCurso: "", monto: "" })
    if (!idDocente) {
      setCursos([])
      return
    }
    try {
      const res = await fetch(`http://localhost:8081/api/egresos-docentes/cursos-docente/${idDocente}`)
      setCursos(await res.json())
    } catch {
      toast.error("Error al cargar cursos del docente")
    }
  }

  const handleCursoChange = (idCurso: string) => {
    setFormData({
      ...formData,
      idCurso
    })
  }

  const handleRegistrar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.idDocente || !formData.idCurso || !formData.monto) {
      toast.warning("Completa los campos obligatorios")
      return
    }

    try {
      const res = await fetch("http://localhost:8081/api/egresos-docentes/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        const egreso = await res.json()
        toast.success("¡Egreso registrado exitosamente!")
        setIsModalOpen(false)
        resetForm()
        await fetchData()
        
        // Mostrar vista previa de la boleta
        setTimeout(() => {
          setSelectedEgreso(egreso)
          setIsBoletaModalOpen(true)
        }, 500)
      } else {
        const error = await res.json()
        toast.error(error.error || "Error al registrar egreso")
      }
    } catch {
      toast.error("Error de conexión")
    }
  }

  const resetForm = () => {
    setFormData({
      idDocente: "",
      idCurso: "",
      monto: "",
      concepto: "Pago por creación de módulos del curso",
      metodoPago: "TRANSFERENCIA",
      nroOperacion: ""
    })
    setCursos([])
  }

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Eliminar este egreso?")) return
    try {
      const res = await fetch(`http://localhost:8081/api/egresos-docentes/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Egreso eliminado")
        await fetchData()
      }
    } catch {
      toast.error("Error al eliminar")
    }
  }

  const verBoleta = (egreso: Egreso) => {
    setSelectedEgreso(egreso)
    setIsBoletaModalOpen(true)
  }

  const generarBoleta = async (egreso: Egreso) => {
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

      // Formato ticket: 80mm de ancho (aprox 226 puntos)
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [226, 400] // ancho x alto inicial (se ajusta después)
      })

      const w = 226
      let y = 40

      // ══════════════════════════════════════════════════════════════════════════
      // HEADER - LOGO Y EMPRESA
      // ══════════════════════════════════════════════════════════════════════════
      
      // Logo centrado
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

      // Línea separadora
      doc.setLineWidth(0.5)
      doc.line(10, y, w - 10, y)
      y += 10

      // ══════════════════════════════════════════════════════════════════════════
      // TIPO DE DOCUMENTO
      // ══════════════════════════════════════════════════════════════════════════
      doc.setFontSize(10)
      doc.setFont("courier", "bold")
      doc.text("BOLETA DE PAGO", w / 2, y, { align: "center" })
      y += 10
      doc.setFontSize(8)
      doc.text(`N° ${String(egreso.idEgreso).padStart(8, '0')}`, w / 2, y, { align: "center" })
      y += 10

      // Línea separadora
      doc.line(10, y, w - 10, y)
      y += 10

      // ══════════════════════════════════════════════════════════════════════════
      // DATOS DEL CLIENTE (DOCENTE)
      // ══════════════════════════════════════════════════════════════════════════
      doc.setFontSize(7)
      doc.setFont("courier", "bold")
      doc.text("DOCENTE:", 15, y)
      y += 8

      doc.setFont("courier", "normal")
      doc.text(`Nombre: ${egreso.docente}`, 15, y)
      y += 8
      doc.text(`DNI: ${egreso.docenteDni}`, 15, y)
      y += 8
      doc.text(`Email: ${egreso.docenteEmail}`, 15, y)
      y += 10

      // Línea separadora
      doc.line(10, y, w - 10, y)
      y += 10

      // ══════════════════════════════════════════════════════════════════════════
      // FECHA Y MÉTODO
      // ══════════════════════════════════════════════════════════════════════════
      doc.setFont("courier", "normal")
      doc.text(`Fecha: ${new Date(egreso.fechaEgreso).toLocaleDateString('es-PE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, 15, y)
      y += 8
      doc.text(`Método: ${egreso.metodoPago}`, 15, y)
      y += 8
      if (egreso.nroOperacion) {
        doc.text(`N° Op: ${egreso.nroOperacion}`, 15, y)
        y += 8
      }
      y += 3

      // Línea separadora
      doc.line(10, y, w - 10, y)
      y += 10

      // ══════════════════════════════════════════════════════════════════════════
      // DETALLE DE PRODUCTOS/SERVICIOS
      // ══════════════════════════════════════════════════════════════════════════
      doc.setFont("courier", "bold")
      doc.text("DESCRIPCIÓN", 15, y)
      doc.text("IMPORTE", w - 15, y, { align: "right" })
      y += 8

      doc.line(10, y, w - 10, y)
      y += 8

      // Item
      doc.setFont("courier", "normal")
      const maxWidth = w - 80
      const lines = doc.splitTextToSize(egreso.concepto, maxWidth)
      lines.forEach((line: string) => {
        doc.text(line, 15, y)
        y += 8
      })
      
      // Curso en línea aparte
      doc.setFontSize(6)
      doc.setFont("courier", "italic")
      const cursoLines = doc.splitTextToSize(`Curso: ${egreso.curso}`, maxWidth)
      cursoLines.forEach((line: string) => {
        doc.text(line, 15, y)
        y += 7
      })
      y += 3

      doc.setFontSize(7)
      doc.setFont("courier", "normal")
      doc.text(`S/ ${Number(egreso.monto).toFixed(2)}`, w - 15, y - 8, { align: "right" })
      y += 3

      // Línea separadora
      doc.line(10, y, w - 10, y)
      y += 10

      // ══════════════════════════════════════════════════════════════════════════
      // TOTALES
      // ══════════════════════════════════════════════════════════════════════════
      doc.setFont("courier", "bold")
      doc.setFontSize(8)
      doc.text("SUBTOTAL:", 15, y)
      doc.text(`S/ ${Number(egreso.monto).toFixed(2)}`, w - 15, y, { align: "right" })
      y += 10

      doc.text("IGV (0%):", 15, y)
      doc.text("S/ 0.00", w - 15, y, { align: "right" })
      y += 12

      // Línea doble
      doc.setLineWidth(1)
      doc.line(10, y, w - 10, y)
      y += 2
      doc.line(10, y, w - 10, y)
      y += 10

      doc.setFontSize(10)
      doc.text("TOTAL:", 15, y)
      doc.text(`S/ ${Number(egreso.monto).toFixed(2)}`, w - 15, y, { align: "right" })
      y += 12

      // Línea doble
      doc.line(10, y, w - 10, y)
      y += 2
      doc.line(10, y, w - 10, y)
      y += 12

      // ══════════════════════════════════════════════════════════════════════════
      // FOOTER
      // ══════════════════════════════════════════════════════════════════════════
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

      // Ajustar altura del documento
      const finalHeight = y + 10
      doc.internal.pageSize.height = finalHeight

      doc.save(`Boleta_${String(egreso.idEgreso).padStart(8, '0')}.pdf`)
      toast.success("Boleta generada exitosamente")
    } catch (error) {
      console.error(error)
      toast.error("Error al generar la boleta")
    }
  }

  const totalEgresos = egresos.reduce((acc, e) => acc + Number(e.monto), 0)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentEgresos = egresos.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(egresos.length / itemsPerPage)

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-rose-600" />
            Egresos a Docentes
          </h4>
          <p className="text-muted-foreground mt-1 font-medium text-sm">
            Pagos por creación de módulos y contenido de cursos
          </p>
        </div>
        <Button
          className="rounded-xl h-11 bg-rose-600 hover:bg-rose-700 gap-2 font-black text-white"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Registrar Egreso
        </Button>
      </div>

      {/* MODAL */}
      <Dialog open={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); if (!open) resetForm() }}>
        <DialogContent className="bg-card sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
          <div className="p-6 border-b border-border">
            <DialogTitle className="text-2xl font-black text-foreground">Nuevo Egreso</DialogTitle>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              Registra el pago al docente por creación de módulos
            </p>
          </div>

          <form onSubmit={handleRegistrar} className="p-6 space-y-6">
            
            {/* Docente */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Seleccionar Docente
              </label>
              <Select onValueChange={handleDocenteChange} value={formData.idDocente}>
                <SelectTrigger className="w-full h-12 rounded-xl bg-muted/40 border-0 px-4 font-bold">
                  <SelectValue placeholder="Busca al docente..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {docentes.map(d => (
                    <SelectItem key={d.idUsuario} value={d.idUsuario.toString()} className="font-medium">
                      {d.nombres} - {d.dni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Curso */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Seleccionar Curso
              </label>
              <Select onValueChange={handleCursoChange} value={formData.idCurso} disabled={!formData.idDocente}>
                <SelectTrigger className="w-full h-12 rounded-xl bg-muted/40 border-0 px-4 font-bold">
                  <SelectValue placeholder={
                    !formData.idDocente 
                      ? "Primero selecciona un docente..." 
                      : cursos.length === 0 
                        ? "No hay cursos disponibles" 
                        : "Elige el curso..."
                  } />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {cursos.length === 0 && formData.idDocente ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                      Todos los cursos de este docente ya tienen egreso registrado
                    </div>
                  ) : (
                    cursos.map(c => (
                      <SelectItem key={c.idCurso} value={c.idCurso.toString()} className="font-medium">
                        {c.titulo}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {formData.idDocente && cursos.length === 0 && (
                <p className="text-xs text-amber-600 font-medium ml-1">
                  ⚠️ Este docente ya tiene egresos registrados para todos sus cursos activos
                </p>
              )}
            </div>

            {/* Monto + Método */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Monto
                </label>
                <Input
                  type="number"
                  className="h-12 rounded-xl bg-muted/40 border-0 px-4 font-black text-lg"
                  value={formData.monto}
                  onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Método
                </label>
                <Select onValueChange={(val) => setFormData({ ...formData, metodoPago: val })} value={formData.metodoPago}>
                  <SelectTrigger className="h-12 rounded-xl bg-muted/40 border-0 px-4 font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
                    <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                    <SelectItem value="CHEQUE">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Nro Operación */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                N° Operación (Opcional)
              </label>
              <Input
                placeholder="Ej: 9283401"
                className="h-12 rounded-xl bg-muted/40 border-0 px-4 font-mono"
                value={formData.nroOperacion}
                onChange={(e) => setFormData({ ...formData, nroOperacion: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 text-lg font-black shadow-xl">
              Confirmar y Generar Boleta
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL VISTA PREVIA BOLETA */}
      <Dialog open={isBoletaModalOpen} onOpenChange={setIsBoletaModalOpen}>
        <DialogContent className="bg-card sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-border sticky top-0 bg-card z-10">
            <DialogTitle className="text-2xl font-black text-foreground">Vista Previa - Boleta</DialogTitle>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              Revisa la boleta antes de descargar
            </p>
          </div>

          {selectedEgreso && (
            <div className="p-8">
              {/* Simulación de boleta tipo ticket */}
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
                  <p className="text-xs">Tel: (01) 123-4567</p>
                </div>

                {/* TIPO DOCUMENTO */}
                <div className="text-center border-b border-gray-400 pb-2 mb-3">
                  <p className="font-black text-base">BOLETA DE PAGO</p>
                  <p className="text-sm font-bold">N° {String(selectedEgreso.idEgreso).padStart(8, '0')}</p>
                </div>

                {/* CLIENTE */}
                <div className="border-b border-gray-400 pb-2 mb-3">
                  <p className="font-bold text-xs mb-1">DOCENTE:</p>
                  <p className="text-xs">Nombre: {selectedEgreso.docente}</p>
                  <p className="text-xs">DNI: {selectedEgreso.docenteDni}</p>
                  <p className="text-xs">Email: {selectedEgreso.docenteEmail}</p>
                </div>

                {/* FECHA Y MÉTODO */}
                <div className="border-b border-gray-400 pb-2 mb-3 text-xs">
                  <p>Fecha: {new Date(selectedEgreso.fechaEgreso).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                  <p>Método: {selectedEgreso.metodoPago}</p>
                  {selectedEgreso.nroOperacion && <p>N° Op: {selectedEgreso.nroOperacion}</p>}
                </div>

                {/* DETALLE */}
                <div className="border-b border-gray-400 pb-2 mb-3">
                  <div className="flex justify-between font-bold text-xs mb-2">
                    <span>DESCRIPCIÓN</span>
                    <span>IMPORTE</span>
                  </div>
                  <div className="border-t border-gray-400 pt-2">
                    <p className="text-xs mb-1">{selectedEgreso.concepto}</p>
                    <p className="text-xs italic text-gray-600 mb-2">Curso: {selectedEgreso.curso}</p>
                    <div className="flex justify-between">
                      <span className="text-xs">Cantidad: 1</span>
                      <span className="text-xs font-bold">S/ {Number(selectedEgreso.monto).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* TOTALES */}
                <div className="border-b-2 border-gray-800 pb-2 mb-3 text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold">SUBTOTAL:</span>
                    <span>S/ {Number(selectedEgreso.monto).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">IGV (0%):</span>
                    <span>S/ 0.00</span>
                  </div>
                  <div className="flex justify-between text-base font-black border-t-2 border-gray-800 pt-2">
                    <span>TOTAL:</span>
                    <span>S/ {Number(selectedEgreso.monto).toFixed(2)}</span>
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
                  className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 font-black gap-2"
                  onClick={() => {
                    generarBoleta(selectedEgreso)
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

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "TOTAL EGRESOS", value: `S/ ${totalEgresos.toFixed(2)}`, icon: DollarSign, color: "text-rose-600", bg: "bg-rose-400/10" },
          { title: "PAGOS REALIZADOS", value: egresos.length.toString(), icon: Receipt, color: "text-blue-600", bg: "bg-blue-400/10" },
          { title: "DOCENTES PAGADOS", value: new Set(egresos.map(e => e.docente)).size.toString(), icon: User, color: "text-violet-600", bg: "bg-violet-400/10" },
        ].map((stat) => (
          <Card key={stat.title}>
            <CardContent className="px-4 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                  <p className="text-2xl font-black mt-1">{stat.value}</p>
                </div>
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TABLA */}
      <div className="rounded-2xl  bg-card backdrop-blur-sm overflow-hidden border border-border/30">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 bg-muted/20 px-6 py-4">
          {/* DERECHA: título */}
          <h2 className="text-lg font-black text-foreground text-right md:text-left flex items-center gap-2">
            Listado de Egresos
          </h2>
          {/* IZQUIERDA: filtros */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">

            <Badge className="ml-2 font-bold text-xs h-6 px-2 py-1 rounded-full bg-chart-3">
              {egresos.length} registros
            </Badge>
          </div>
        </div>
        <div className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-b border-border/50 hover:bg-transparent">
                <TableHead className="py-2 px-6 font-bold text-xs uppercase">ID</TableHead>
                <TableHead className="font-bold text-xs">Docente / Curso</TableHead>
                <TableHead className="font-bold text-xs">Monto</TableHead>
                <TableHead className="font-bold text-xs">Método</TableHead>
                <TableHead className="font-bold text-xs">Fecha</TableHead>
                <TableHead className="text-right font-bold pr-8 text-xs">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-20 text-center font-bold text-muted-foreground animate-pulse">
                    Cargando egresos...
                  </TableCell>
                </TableRow>
              ) : egresos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-20 text-center">
                    <p className="font-bold opacity-30">No hay egresos registrados</p>
                  </TableCell>
                </TableRow>
              ) : currentEgresos.map((e) => (
                <TableRow key={e.idEgreso} className="border-b border-border hover:bg-muted/70 transition-colors">
                  <TableCell className="px-6 py-4">
                    <span className="font-mono text-sm font-bold text-muted-foreground">#{e.idEgreso}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-foreground leading-none">{e.docente}</span>
                      <span className="text-xs font-bold text-rose-600 mt-1 leading-none">{e.curso}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-sm font-black text-rose-600">S/ {Number(e.monto).toFixed(2)}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className="bg-muted text-muted-foreground border-0 text-[10px] font-black rounded-full px-4">
                      {e.metodoPago}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-xs font-medium text-muted-foreground">
                      {new Date(e.fechaEgreso).toLocaleDateString('es-PE')}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => verBoleta(e)} className="font-bold cursor-pointer">
                          <Receipt className="mr-2 h-4 w-4" />
                          Ver Boleta
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEliminar(e.idEgreso)} className="text-rose-600 font-bold cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* PAGINACIÓN */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-muted/10">
          <p className="text-xs text-muted-foreground font-medium">
            Mostrando <span className="font-bold text-foreground">{egresos.length === 0 ? 0 : indexOfFirstItem + 1}</span> a{" "}
            <span className="font-bold text-foreground">{Math.min(indexOfLastItem, egresos.length)}</span> de{" "}
            <span className="font-bold text-foreground">{egresos.length}</span> egresos
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-xl"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant="outline"
                size="sm"
                className={cn("h-9 rounded-xl", currentPage === i + 1 && "bg-background shadow-sm ring-1 ring-primary/5")}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-xl"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

