 "use client"

import { useState, useEffect } from "react"
import { DollarSign, Plus, Download, User, BookOpen, CreditCard, Search, Settings, Trash2, Receipt, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { logSystemAction } from "@/lib/logging"
import { useAuth } from "@/lib/auth-context"
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
  const { user } = useAuth()
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
        
        // Get teacher and course names for logging
        const teacher = docentes.find(d => d.idUsuario === parseInt(formData.idDocente))
        const course = cursos.find(c => c.idCurso === parseInt(formData.idCurso))
        
        // Log the action
        await logSystemAction('EGRESO_REGISTRADO', [formData.monto, `${teacher?.nombres || 'Docente'} - ${course?.titulo || 'Curso'}`], user?.id)
        
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
      // Find egreso details for logging
      const egresoToDelete = egresos.find(e => e.idEgreso === id)
      
      const res = await fetch(`http://localhost:8081/api/egresos-docentes/${id}`, { method: "DELETE" })
      if (res.ok) {
        // Log the action
        if (egresoToDelete) {
          await logSystemAction('EGRESO_ELIMINADO', [egresoToDelete.monto.toString(), `${egresoToDelete.docente} - ${egresoToDelete.curso}`], user?.id)
        }
        
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
      const QRCode = (await import("qrcode")).default

      // =========================================================================
      // QR
      // =========================================================================

      const qrData = `
      COMPROBANTE: ${String(egreso.idEgreso).padStart(8, "0")}
      DOCENTE: ${egreso.docente}
      CURSO: ${egreso.curso}
      MONTO: S/ ${Number(egreso.monto).toFixed(2)}
      FECHA: ${egreso.fechaEgreso}
      `

      const qrImage = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 1,
      })
      // LOGO
      const imgData = await new Promise<string>((resolve) => {
        const img = new window.Image()

        img.src = "/images/logo_brusben_light.png"

        img.onload = () => {
          const canvas = document.createElement("canvas")

          canvas.width = img.width
          canvas.height = img.height

          const ctx = canvas.getContext("2d")

          if (ctx) ctx.drawImage(img, 0, 0)

          resolve(canvas.toDataURL("image/png"))
        }

        img.onerror = () => resolve("")
      })

      const firmaData = await new Promise<string>((resolve) => {
        const img = new window.Image()

        img.src = "/images/firma_rodrigo.png"

        img.onload = () => {
          const canvas = document.createElement("canvas")

          canvas.width = img.width
          canvas.height = img.height

          const ctx = canvas.getContext("2d")

          if (ctx) ctx.drawImage(img, 0, 0)

          resolve(canvas.toDataURL("image/png"))
        }

        img.onerror = () => resolve("")
      })

      // PDF
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      })

      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      const margin = 20
      const contentWidth = pageWidth - margin * 2

      let y = 70

      // =========================================================================
      // HEADER ROJO
      // =========================================================================
      doc.setFillColor(220, 38, 38)

      doc.roundedRect(
        0,
        0,
        pageWidth,
        20,
        0,
        0,
        "F"
      )


      // =========================================================================
      // CARD PRINCIPAL
      // =========================================================================
      doc.setFillColor(255, 255, 255)

      doc.roundedRect(
        margin,
        45,
        contentWidth,
        pageHeight - 90,
        24,
        24,
        "F"
      )

      // =========================================================================
      // HEADER CONTENIDO
      // =========================================================================

      // LOGO BOX
      doc.setFillColor(254, 242, 242)

      doc.roundedRect(
        margin + 20,
        y,
        80,
        70,
        18,
        18,
        "F"
      )

      // LOGO
      if (imgData) {
        doc.addImage(
          imgData,
          "PNG",
          margin + 25,
          y + 10,
          70,
          42
        )
      }

      // EMPRESA
      doc.setTextColor(20)

      doc.setFont("helvetica", "bold")
      doc.setFontSize(20)

      doc.text(
        "BRUSBEN E.I.R.L",
        margin + 110,
        y + 20
      )

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.setTextColor(120)

      doc.text(
        "Sistema de Aula Virtual",
        margin + 110,
        y + 40
      )

      doc.text(
        "RUC: 20409499849",
        margin + 110,
        y + 56
      )

      doc.text(
        "Chiclayo, Perú",
        margin + 110,
        y + 72
      )

      // BADGE
      doc.setFillColor(254, 242, 242)

      doc.roundedRect(
        pageWidth - 190,
        y + 5,
        130,
        30,
        15,
        15,
        "F"
      )

      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
      doc.setTextColor(220, 38, 38)

      doc.text(
        "COMPROBANTE",
        pageWidth - 125,
        y + 24,
        {
          align: "center",
        }
      )

      // NUMERO
      doc.setTextColor(20)

      doc.setFontSize(24)

      doc.text(
        `#${String(egreso.idEgreso).padStart(8, "0")}`,
        pageWidth - 60,
        y + 65,
        {
          align: "right",
        }
      )

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.setTextColor(120)

      doc.text(
        "Emitido automáticamente",
        pageWidth - 60,
        y + 84,
        {
          align: "right",
        }
      )

      // LÍNEA PUNTEADA
      doc.setDrawColor(220, 220, 220)

      doc.setLineDashPattern([2, 2], 0)

      doc.line(
        margin + 20,
        y + 105,
        pageWidth - margin - 30,
        y + 105
      )

      // volver línea normal
      doc.setLineDashPattern([], 0)

      y += 120

      // =========================================================================
      // INFO CARDS
      // =========================================================================

      // espacio horizontal entre cards
      const cardGap = 20

      // ancho reducido
      const cardWidth = (contentWidth - 60 - cardGap) / 2

      // posición inicial
      const leftCardX = margin + 20

      // CARD IZQUIERDA
      doc.setFillColor(249, 250, 251)

      doc.roundedRect(
        leftCardX,
        y,
        cardWidth,
        120,
        18,
        18,
        "F"
      )

      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      doc.setTextColor(140)

      doc.text(
        "INFORMACIÓN DEL DOCENTE",
        leftCardX + 15,
        y + 22
      )

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.setTextColor(90)

      doc.text("Nombre", leftCardX + 15, y + 45)

      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      doc.setTextColor(20)

      doc.text(
        egreso.docente,
        leftCardX + 15,
        y + 62
      )

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.setTextColor(90)

      doc.text("DNI", leftCardX + 15, y + 84)

      doc.setFont("helvetica", "bold")
      doc.setTextColor(20)

      doc.text(
        egreso.docenteDni,
        leftCardX + 15,
        y + 100
      )

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.setTextColor(90)

      doc.text("Correo", leftCardX + 120, y + 84)

      doc.setFont("helvetica", "bold")
      doc.setTextColor(20)
      doc.setFontSize(8)

      const emailLines = doc.splitTextToSize(
        egreso.docenteEmail,
        cardWidth - 135
      )

      doc.text(
        emailLines,
        leftCardX + 120,
        y + 100
      )

      // CARD DERECHA
      const rightX = leftCardX + cardWidth + cardGap

      doc.setFillColor(249, 250, 251)

      doc.roundedRect(
        rightX,
        y,
        cardWidth,
        120,
        18,
        18,
        "F"
      )

      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      doc.setTextColor(140)

      doc.text(
        "DETALLE DEL PAGO",
        rightX + 15,
        y + 22
      )

      const fecha = new Date(
        egreso.fechaEgreso
      ).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })

      const details = [
        ["Fecha", fecha],
        ["Método", egreso.metodoPago],
        ["N° Operación", egreso.nroOperacion || "-"],
      ]

      let detailY = y + 50

      details.forEach(([label, value]) => {
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.setTextColor(100)

        doc.text(
          label,
          rightX + 15,
          detailY
        )

        doc.setFont("helvetica", "bold")
        doc.setTextColor(20)

        doc.text(
          String(value),
          rightX + cardWidth - 15,
          detailY,
          {
            align: "right",
          }
        )

        detailY += 24
      })

      y += 160

      // =========================================================================
      // CONCEPTO
      // =========================================================================
      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      doc.setTextColor(140)

      doc.text(
        "CONCEPTO",
        margin + 20,
        y
      )

      y += 25

      doc.setFont("helvetica", "bold")
      doc.setFontSize(18)
      doc.setTextColor(20)

      const conceptoLines = doc.splitTextToSize(
        egreso.concepto,
        contentWidth - 100
      )

      doc.text(
        conceptoLines,
        margin + 20,
        y
      )

      y += conceptoLines.length * 20

      doc.setFont("helvetica", "normal")
      doc.setFontSize(11)
      doc.setTextColor(110)

      doc.text(
        `Curso: ${egreso.curso}`,
        margin + 20,
        y
      )

      y += 40

      // =========================================================================
      // TABLA
      // =========================================================================

      doc.setFillColor(243, 244, 246)

      // RECTANGULAR (sin bordes redondos)
      doc.rect(
        margin + 20,
        y,
        contentWidth - 40,
        38,
        "F"
      )

      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
      doc.setTextColor(60)

      doc.text(
        "Descripción",
        margin + 35,
        y + 24
      )

      doc.text(
        "Importe",
        pageWidth - 75,
        y + 24,
        {
          align: "right",
        }
      )

      y += 38

      doc.setDrawColor(229, 231, 235)

      doc.line(
        margin + 20,
        y + 35,
        pageWidth - margin - 20,
        y + 35
      )

      y += 28

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.setTextColor(40)

      doc.text(
        egreso.concepto,
        margin + 35,
        y
      )

      doc.setFont("helvetica", "bold")

      doc.text(
        `S/ ${Number(egreso.monto).toFixed(2)}`,
        pageWidth - 75,
        y,
        {
          align: "right",
        }
      )

      y += 60

      // -------------------------------------------------------------------------
      // FIRMA IZQUIERDA
      // -------------------------------------------------------------------------

      const firmaX = margin + 40
      const firmaY = y - 10

      // Imagen firma
      if (firmaData) {
        doc.addImage(
          firmaData,
          "PNG",
          firmaX,
          firmaY,
          100,
          55
        )
      }

      // Línea firma
      doc.setDrawColor(180)

      doc.line(
        firmaX,
        firmaY + 58,
        firmaX + 130,
        firmaY + 58
      )

      // Nombre
      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
      doc.setTextColor(30)

      doc.text(
        "Rodrigo Morazzani",
        firmaX + 65,
        firmaY + 74,
        {
          align: "center"
        }
      )

      // Cargo
      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.setTextColor(120)

      doc.text(
        "Gerente General",
        firmaX + 65,
        firmaY + 88,
        {
          align: "center"
        }
      )

      // -------------------------------------------------------------------------
      // TOTALES DERECHA
      // -------------------------------------------------------------------------

      const totalX = pageWidth - 280

      doc.setFont("helvetica", "normal")
      doc.setFontSize(11)
      doc.setTextColor(100)

      doc.text("Subtotal", totalX, y)

      doc.text(
        `S/ ${Number(egreso.monto).toFixed(2)}`,
        pageWidth - 60,
        y,
        {
          align: "right",
        }
      )

      y += 24

      doc.text("IGV", totalX, y)

      doc.text(
        "S/ 0.00",
        pageWidth - 60,
        y,
        {
          align: "right",
        }
      )

      y += 20

      doc.setDrawColor(220)

      doc.line(
        totalX,
        y,
        pageWidth - 60,
        y
      )

      y += 30

      doc.setFont("helvetica", "bold")
      doc.setFontSize(16)
      doc.setTextColor(20)

      doc.text("TOTAL", totalX, y)

      doc.setTextColor(220, 38, 38)
      doc.setFontSize(26)

      doc.text(
        `S/ ${Number(egreso.monto).toFixed(2)}`,
        pageWidth - 60,
        y,
        {
          align: "right",
        }
      )

      y += 40

      // =========================================================================
      // FOOTER TEXTO + QR
      // =========================================================================

      // línea punteada
      doc.setDrawColor(220, 220, 220)

      doc.setLineDashPattern([2, 2], 0)

      doc.line(
        margin + 20,
        y,
        pageWidth - margin - 30,
        y
      )

      doc.setLineDashPattern([], 0)

      y += 25

      // -------------------------------------------------------------------------
      // QR IZQUIERDA
      // -------------------------------------------------------------------------

      const qrX = margin + 33
      const qrY = y

      doc.setFillColor(250, 250, 250)

      doc.addImage(
        qrImage,
        "PNG",
        qrX,
        qrY,
        70,
        70
      )

      doc.setFont("helvetica", "normal")
      doc.setFontSize(7)
      doc.setTextColor(120)

      // -------------------------------------------------------------------------
      // TEXTO DERECHA
      // -------------------------------------------------------------------------

      const footerTextX = pageWidth / 2 + 240

      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.setTextColor(30)

      doc.text(
        "Gracias por confiar en Brusben",
        footerTextX,
        y + 18,
        {
          align: "right",
        }
      )

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.setTextColor(120)

      doc.text(
        "Este comprobante fue generado electrónicamente",
        footerTextX,
        y + 40,
        {
          align: "right",
        }
      )

      doc.setFontSize(8)

      doc.text(
        "© Brusben E.I.R.L — Sistema Aula Virtual",
        footerTextX,
        y + 62,
        {
          align: "right",
        }
      )

      y += 95

      // =========================================================================
      // FOOTER ROJO
      // =========================================================================
      doc.setFillColor(220, 38, 38)

      doc.roundedRect(
        0,
        pageHeight - 20,
        pageWidth,
        20,
        0,
        0,
        "F"
      )


      // SAVE
      doc.save(
        `Comprobante_${String(egreso.idEgreso).padStart(8, "0")}.pdf`
      )

      toast.success("Comprobante generado exitosamente")
    } catch (error) {
      console.error(error)
      toast.error("Error al generar el comprobante")
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
                  Este docente ya tiene egresos registrados para todos sus cursos activos
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

      {/* MODAL VISTA PREVIA COMPROBANTE */}
      <Dialog open={isBoletaModalOpen} onOpenChange={setIsBoletaModalOpen}>
        <DialogContent className="bg-card sm:max-w-[650px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem] max-h-[92vh] overflow-y-auto">
          
          {/* HEADER MODAL */}
          <div className="sticky top-0 z-10 backdrop-blur-xl bg-card/90 border-b border-border px-8 py-6">
            <DialogTitle className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              Comprobante de Pago
            </DialogTitle>

            <p className="text-sm text-muted-foreground mt-1 font-medium">
              Verifica la información antes de descargar el PDF
            </p>
          </div>

          {selectedEgreso && (
            <div className="p-8">

              {/* COMPROBANTE */}
              <div className="relative overflow-hidden rounded-[2rem] border border-border bg-white shadow-2xl">

                {/* DECORACIÓN */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-primary/70 to-primary"></div>

                <div className="p-8">

                  {/* HEADER */}
                  <div className="flex items-start justify-between gap-6 border-b border-dashed border-gray-300 pb-6">
                    
                    {/* EMPRESA */}
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
                        <img
                          src="/images/logo_brusben_light.png"
                          alt="Brusben"
                          className="w-12 h-12 object-contain"
                        />
                      </div>

                      <div>
                        <h2 className="text-xl font-black text-gray-900">
                          BRUSBEN E.I.R.L
                        </h2>

                        <p className="text-sm text-gray-500">
                          Sistema de Aula Virtual
                        </p>

                        <div className="mt-2 space-y-1 text-xs text-gray-500">
                          <p>RUC: 20409499849</p>
                          <p>Chiclayo, Perú</p>
                          <p>Tel: (+51) 994-995-141</p>
                        </div>
                      </div>
                    </div>

                    {/* COMPROBANTE */}
                    <div className="text-right">
                      <div className="inline-flex items-center rounded-full bg-primary/10 text-primary px-4 py-2 text-xs font-black uppercase tracking-wider">
                        Comprobante
                      </div>

                      <h3 className="mt-4 text-2xl font-black text-gray-900">
                        #{String(selectedEgreso.idEgreso).padStart(8, '0')}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Emitido automáticamente
                      </p>
                    </div>
                  </div>

                  {/* INFORMACIÓN */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-dashed border-gray-300">

                    {/* DOCENTE */}
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                      <p className="text-xs font-black tracking-widest text-gray-400 uppercase mb-3">
                        Información del Docente
                      </p>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500">Nombre</p>
                          <p className="font-bold text-gray-900">
                            {selectedEgreso.docente}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">DNI</p>
                          <p className="font-semibold text-gray-800">
                            {selectedEgreso.docenteDni}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Correo</p>
                          <p className="font-medium text-gray-800 break-all">
                            {selectedEgreso.docenteEmail}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* DETALLE PAGO */}
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                      <p className="text-xs font-black tracking-widest text-gray-400 uppercase mb-3">
                        Detalle del Pago
                      </p>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">Fecha</span>
                          <span className="font-semibold text-right text-gray-900">
                            {new Date(selectedEgreso.fechaEgreso).toLocaleDateString('es-PE', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">Método</span>
                          <span className="font-semibold text-gray-900">
                            {selectedEgreso.metodoPago}
                          </span>
                        </div>

                        {selectedEgreso.nroOperacion && (
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-500">N° Operación</span>
                            <span className="font-semibold text-gray-900">
                              {selectedEgreso.nroOperacion}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* DETALLE */}
                  <div className="py-6 border-b border-dashed border-gray-300">

                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <p className="text-xs font-black tracking-widest text-gray-400 uppercase">
                          Concepto
                        </p>

                        <h4 className="text-lg font-black text-gray-900 mt-1">
                          {selectedEgreso.concepto}
                        </h4>

                        <p className="text-sm text-gray-500 mt-1">
                          Curso: {selectedEgreso.curso}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Cantidad
                        </p>

                        <p className="text-lg font-black text-gray-900">
                          1
                        </p>
                      </div>
                    </div>

                    {/* TABLA */}
                    <div className="overflow-hidden rounded-2xl border border-gray-200">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="text-left px-4 py-3 font-black text-gray-700">
                              Descripción
                            </th>
                            <th className="text-right px-4 py-3 font-black text-gray-700">
                              Importe
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr className="border-t border-gray-200">
                            <td className="px-4 py-4 text-gray-700">
                              {selectedEgreso.concepto}
                            </td>

                            <td className="px-4 py-4 text-right font-black text-gray-900">
                              S/ {Number(selectedEgreso.monto).toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div className="pt-6 flex justify-end">
                    <div className="w-full max-w-sm space-y-3">

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-medium">
                          Subtotal
                        </span>

                        <span className="font-bold text-gray-900">
                          S/ {Number(selectedEgreso.monto).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-medium">
                          IGV
                        </span>

                        <span className="font-bold text-gray-900">
                          S/ 0.00
                        </span>
                      </div>

                      <div className="border-t border-dashed border-gray-300 pt-4 flex justify-between items-center">
                        <span className="text-lg font-black text-gray-900">
                          TOTAL
                        </span>

                        <span className="text-3xl font-black text-primary">
                          S/ {Number(selectedEgreso.monto).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="mt-8 pt-6 border-t border-dashed border-gray-300 text-center">
                    <p className="font-bold text-gray-800">
                      Gracias por confiar en Brusben
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Este comprobante fue generado electrónicamente
                    </p>

                    <p className="text-xs text-gray-400 mt-3">
                      © Brusben E.I.R.L — Sistema Aula Virtual
                    </p>
                  </div>

                </div>
              </div>

              {/* BOTONES */}
              <div className="flex gap-3 mt-8">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-2xl font-bold border-2"
                  onClick={() => setIsBoletaModalOpen(false)}
                >
                  Cerrar
                </Button>

                <Button
                  className="flex-1 h-12 rounded-2xl bg-primary hover:bg-primary/90 font-black gap-2 shadow-lg"
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
          <Card key={stat.title} className="bg-card shadow-md dark:border border-0">
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
      <div className="rounded-2xl  bg-card shadow-md dark:border border-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50  px-6 py-4">
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
                <TableHead className="font-bold text-center">Monto</TableHead>
                <TableHead className="font-bold text-center">Método</TableHead>
                <TableHead className="font-bold text-center">Fecha</TableHead>
                <TableHead className="font-bold text-center">Acciones</TableHead>
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
                  <TableCell className="px-6 py-4 text-center">
                    <Badge className="bg-muted text-muted-foreground border-0 text-[10px] font-black rounded-full px-4">
                      {e.metodoPago}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <span className="text-xs font-medium text-muted-foreground">
                      {new Date(e.fechaEgreso).toLocaleDateString('es-PE')}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl p-4 border-1 border-gray-300">
                          <Settings className="h-5 w-5" />
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
        {!isLoading && egresos.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-6 border-t border-border/30">
            <div className="text-sm text-muted-foreground font-medium">
              Mostrando{" "}
              <span className="font-bold text-foreground">{indexOfFirstItem + 1}</span>
              {" "}–{" "}
              <span className="font-bold text-foreground">{Math.min(indexOfLastItem, egresos.length)}</span>
              {" "}de{" "}
              <span className="font-bold text-foreground">{egresos.length}</span>
              {" "}egresos
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-xl font-bold h-10 border-border/50 bg-card hover:bg-muted/50 disabled:opacity-50 transition-all"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "w-10 h-10 rounded-xl font-bold transition-all",
                        currentPage === pageNum 
                          ? "bg-primary text-primary-foreground shadow-md border-primary" 
                          : "border-border/50 bg-card hover:bg-muted/50"
                      )}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-xl font-bold h-10 border-border/50 bg-card hover:bg-muted/50 disabled:opacity-50 transition-all"
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

