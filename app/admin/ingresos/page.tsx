"use client"

import { 
  Clock, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Plus, 
  Download,
  DollarSign,
  CreditCard, 
  TrendingUp,
  GraduationCap,
  Search,
  Settings,
  Receipt,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { logSystemAction } from "@/lib/logging"
import { useAuth } from "@/lib/auth-context"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
export default function PagosPage() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBoletaModalOpen, setIsBoletaModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [statusFilter, setStatusFilter] = useState("")
  
  const [formData, setFormData] = useState({
    idUsuario: "",
    idCurso: "",
    monto: "",
    metodoPago: "TRANSFERENCIA",
    nroOperacion: ""
  })

  useEffect(() => {
    fetchData()
  }, [])

  // Filter payments based on status
  const filteredPayments = payments.filter(payment => {
    if (!statusFilter) return true
    return payment.status === statusFilter
  })


  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [payRes, stuRes, curRes] = await Promise.all([
        fetch("http://localhost:8081/api/pagos"),
        fetch("http://localhost:8081/api/usuarios"),
        fetch("http://localhost:8081/api/cursos")
      ])
      setPayments(await payRes.json())
      
      const allUsers = await stuRes.json()
      const onlyStudents = allUsers.filter((u: any) => {
        const rol = (u.nombreRol || "").toLowerCase()
        return rol === "estudiante" && u.activo === true
      })
      setStudents(onlyStudents)
      
      const allCourses = await curRes.json()
      setCourses(allCourses.filter((c: any) => c.estCurso === "A"))
    } catch (e) {
      toast.error("Error al conectar con la base de datos")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.idUsuario || !formData.idCurso || !formData.monto) {
      toast.warning("Por favor completa los campos obligatorios")
      return
    }

    try {
      const res = await fetch("http://localhost:8081/api/pagos/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        // Get student and course names for logging
        const student = students.find(s => s.idUsuario === parseInt(formData.idUsuario))
        const course = courses.find(c => c.idCurso === parseInt(formData.idCurso))
        
        // Log the action
        await logSystemAction('PAGO_REGISTRADO', [formData.monto, `${student?.nombres || 'Estudiante'} - ${course?.titulo || 'Curso'}`], user?.id)
        
        toast.success("¡Pago registrado e inscripción realizada!")
        setIsModalOpen(false)
        setFormData({ idUsuario: "", idCurso: "", monto: "", metodoPago: "TRANSFERENCIA", nroOperacion: "" })
        await fetchData()
      } else {
        const error = await res.json()
        toast.error(error.error || "Error al procesar el pago")
      }
    } catch {
      toast.error("Error de conexión con el servidor")
    }
  }

  // 2. Agrega una función helper para el reset del form:
  const resetForm = () => {
    setFormData({ idUsuario: "", idCurso: "", monto: "", metodoPago: "TRANSFERENCIA", nroOperacion: "" })
  }

  // Marcar como pagado un registro PENDIENTE
  const handleActualizarEstado = async (idPago: number, nuevoEstado: string) => {
    try {
      const res = await fetch(`http://localhost:8081/api/pagos/${idPago}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nuevoEstado })
      })

      if (res.ok) {
        // Log the action
        await logSystemAction('PAGO_ACTUALIZADO', [idPago.toString()], user?.id)
        
        toast.success(`Pago #${idPago} marcado como ${nuevoEstado}`)
        await fetchData()
      } else {
        toast.error("Error al actualizar el estado del pago.")
      }
    } catch {
      toast.error("Error de conexión al marcar como pagado.")
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
      doc.text(`Nombre: ${pago.student}`, 15, y)
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

      doc.save(`Boleta_${String(pago.idPago).padStart(8, '0')}.pdf`)
      toast.success("Boleta generada exitosamente")
    } catch (error) {
      console.error(error)
      toast.error("Error al generar la boleta")
    }
  }

  const handleExportPDF = async () => {
    if (payments.length === 0) {
      toast.info("No hay datos para exportar")
      return
    }

    // Importación del bundle para el explorador web en vez del bundle de node (que falla en SSR)
    // @ts-ignore
    const jspdfModule = await import("jspdf/dist/jspdf.umd.min.js")
    const jsPDF = jspdfModule.jsPDF

    // @ts-ignore
    const autoTableModule = await import("jspdf-autotable")
    const autoTable = autoTableModule.default

    // --- CÁLCULOS PARA EL REPORTE ---
    const totalC = payments.reduce((acc, p) => {
      const validAmount = typeof p.amount === 'string' ? parseFloat(p.amount.replace(/[^\d.-]/g, "")) : 0
      return acc + (isNaN(validAmount) ? 0 : validAmount)
    }, 0)

    const totalPagados = payments.filter(p => p.status === "PAGADO").length
    const totalPendientes = payments.filter(p => p.status === "PENDIENTE").length

    // Crear documento en HORIZONTAL (landscape)
    const doc = new jsPDF("landscape")
    
    // Carga de la imagen para el PDF
    const imgData = await new Promise<string>((resolve) => {
      // Intentamos cargar el logo original, como es oscuro/claro lo ponemos
      const img = new window.Image();
      img.src = '/images/logo_brusben_light.png';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(''); // Continuar si falla
    });

    // --- CABECERA (Header sin fondo completo) ---
    
    // Logo renderizado directamente
    if (imgData) {
      doc.addImage(imgData, 'PNG', 14, 10, 30, 15); 
    }
    
    // Título Principal
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    // Si hay imagen la desplazamos, sino va junto al borde
    doc.text("REPORTE FINANCIERO", imgData ? 50 : 14, 16);
    
    // Subtítulo e Información
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139); // slate-500
    const dateStr = new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    doc.text(`Brusben E.I.R.L - Sistema de Aula Virtual`, imgData ? 50 : 14, 21);
    doc.text(`Generado el: ${dateStr}`, imgData ? 50 : 14, 25);

    // --- BLOQUE DE RESUMEN (Derecha) ---
    // En apaisado el ancho de hoja A4 es ~297mm
    const blockX = 220; 
    // Tarjeta Total Recaudado
    doc.setFillColor(248, 250, 252); // bg-slate-50
    doc.setDrawColor(226, 232, 240); // border-slate-200
    doc.setLineWidth(0.3);
    doc.roundedRect(blockX, 10, 63, 18, 2, 2, 'FD');
    
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("TOTAL RECAUDADO", blockX + 4, 15);
    
    doc.setFontSize(12);
    doc.setTextColor(15, 118, 110); // teal-700
    doc.text(`S/ ${totalC.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, blockX + 4, 21);

    // Metadatos Adicionales
    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`${totalPagados} Pagados • ${totalPendientes} Pendientes • ${payments.length} Pagos`, blockX + 4, 25);

    // --- LÍNEA DIVISORIA ---
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, 30, 283, 30); // Hasta 283 para llenar a lo ancho

    // --- TABLA DE DATOS ---
    autoTable(doc, {
      startY: 33,
      head: [["ID", "ESTUDIANTE", "CURSO", "MONTO", "ESTADO", "MÉTODO"]],
      body: payments.map(p => [
        `#${p.idPago}`,
        p.student || '-',
        p.course || '-',
        p.amount || '-',
        p.status || '-',
        p.method || '-'
      ]),
      theme: 'plain',
      headStyles: {
        fillColor: [52,73,94],
        textColor: 255, // blanco
        fontStyle: 'bold',
        halign: 'left',
        fontSize: 8
      },
      bodyStyles: {
        textColor: [50, 50, 50],
        halign: 'left',
        valign: 'middle',
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [252, 253, 254] // very subtle slate
      },
      styles: {
        font: 'helvetica',
        cellPadding: 6,
        lineWidth: 0.1,
        lineColor: [226, 232, 240] // slate-200
      },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold', textColor: [100, 116, 139] },
        3: { halign: 'right', fontStyle: 'bold', textColor: [15, 118, 110] }, // teal-700 p/ monto
        4: { fontStyle: 'bold' } // Estado
      },
      // --- PIE DE PÁGINA (Footer) ---
      didDrawPage: function (data: any) {
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // slate-400
        
        // Número de página
        const pageStr = "Página " + doc.internal.getNumberOfPages();
        doc.text(pageStr, data.settings.margin.left, pageHeight - 12);
        
        // Logo en Footer (debido a que la cabecera es blanca, el logo light se pondrá abajo en un cuadro oscuro si deseas, o solo texto)
        const textFooter = "Documento Oficial • Brusben E.I.R.L - Propiedad Exclusiva";
        const textWidth = doc.getTextWidth(textFooter);
        doc.text(textFooter, pageSize.width - data.settings.margin.left - textWidth, pageHeight - 12);
        
        // Línea superior del footer
        doc.setDrawColor(241, 245, 249); // borde slate-100
        doc.setLineWidth(1);
        doc.line(data.settings.margin.left, pageHeight - 18, pageSize.width - data.settings.margin.left, pageHeight - 18);
      }
    })

    doc.save(`Reporte_Financiero_${new Date().toISOString().split('T')[0]}.pdf`)
    toast.success("PDF exportado exitosamente")
  }

  // --- Cálculos Dinámicos ---
  const totalRecaudado = payments
    .filter(p => p.status === "PAGADO")
    .reduce((acc, p) => {
    const validAmount = typeof p.amount === 'string' ? parseFloat(p.amount.replace(/[^\d.-]/g, "")) : 0
    return acc + (isNaN(validAmount) ? 0 : validAmount)
  }, 0)

  const totalPendientes = payments
    .filter(p => p.status === "PENDIENTE")
    .reduce((acc, p) => {
      const validAmount = typeof p.amount === 'string' ? parseFloat(p.amount.replace(/[^\d.-]/g, "")) : 0
      return acc + (isNaN(validAmount) ? 0 : validAmount)
    }, 0)

  const matriculasMes = payments
    .filter(p => p.status === "PAGADO")
    .length
  const nuevosAbonos = payments
    .filter(p => p.status === "PENDIENTE")
    .length

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-3">
             <TrendingUp className="h-6 w-6 text-primary" />
             Ingresos
          </h4>
          <p className="text-muted-foreground mt-1 font-medium text-sm">Gestiona y monitorea todos los ingresos financieros de la plataforma.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="rounded-xl h-11 px-6 font-bold bg-card border-border gap-2 hover:bg-muted/50" onClick={handleExportPDF}>
             <Download className="h-4 w-4 text-muted-foreground" />
             Exportar a PDF
           </Button>
           
           <Button 
             className="rounded-xl h-11 bg-primary hover:bg-primary/90 gap-2 font-black text-primary-foreground transition-all"
             onClick={() => setIsModalOpen(true)}
           >
             <Plus className="h-5 w-5" />
             Registrar Pago
           </Button>
        </div>
      </div>

      {/* Modal de Registro */}
      <Dialog open={isModalOpen} 
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) resetForm()  // <-- limpia el form al cerrar de CUALQUIER forma
        }}>
        <DialogContent className="bg-card sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
          
          <div className="p-6 border-b border-border">
            <DialogTitle className="text-2xl font-black text-foreground">
              Nueva Inscripción
            </DialogTitle>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              Registra el abono del estudiante para habilitar su acceso al curso.
            </p>
          </div>
          
          <form onSubmit={handleRegisterPayment} className="p-6 space-y-6">
            
            {/* Estudiante */}
            <div className="space-y-2 w-full">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Seleccionar Estudiante
              </label>
              <Select 
                onValueChange={(val) => setFormData({...formData, idUsuario: val})} 
                value={formData.idUsuario}
              >
                <SelectTrigger className="w-full h-12 rounded-xl bg-muted/40 border-0 px-4 focus:ring-primary font-bold">
                  <SelectValue placeholder="Busca al alumno..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {students.map(s => (
                    <SelectItem 
                      key={s.idUsuario} 
                      value={s.idUsuario.toString()} 
                      className="font-medium"
                    >
                      {s.nombres}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Curso */}
            <div className="space-y-2 w-full">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Seleccionar Curso
              </label>
              <Select 
                onValueChange={(val) => {
                  const curso = courses.find(c => c.idCurso.toString() === val)
                  setFormData({
                    ...formData, 
                    idCurso: val, 
                    monto: curso?.precioCurso?.toString() || ""
                  })
                }} 
                value={formData.idCurso}
              >
                <SelectTrigger className="w-full h-12 rounded-xl bg-muted/40 border-0 px-4 focus:ring-primary font-bold">
                  <SelectValue placeholder="Elige el curso..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {courses.map(c => (
                    <SelectItem 
                      key={c.idCurso} 
                      value={c.idCurso.toString()} 
                      className="font-medium"
                    >
                      {c.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Monto + Método */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Monto */}
              <div className="space-y-2 w-full">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Monto Pagado
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                  </span>
                  <Input 
                    type="number"
                    className="w-full h-9 rounded-xl bg-muted/40 border-0 pl-10 px-4 focus:ring-primary font-black text-lg left-6" 
                    value={formData.monto}
                    onChange={(e) => setFormData({...formData, monto: e.target.value})}
                  />
                </div>
              </div>

              {/* Método */}
              <div className="space-y-2 w-full">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Método
                </label>
                <Select 
                  onValueChange={(val) => setFormData({...formData, metodoPago: val})} 
                  value={formData.metodoPago}
                >
                  <SelectTrigger className="w-full h-12 rounded-xl bg-muted/40 border-0 px-4 focus:ring-primary font-bold">
                    <SelectValue placeholder="Método" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
                    <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                    <SelectItem value="VISA">VISA / Mastercard</SelectItem>
                    <SelectItem value="YAPE/PLIN">Yape / Plin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* Nro Operación */}
            <div className="space-y-2 w-full">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Nro. de Operación (Opcional)
              </label>
              <Input 
                placeholder="Ej: 9283401"
                className="w-full h-12 rounded-xl bg-muted/40 border-0 px-4 focus:ring-primary font-mono"
                value={formData.nroOperacion}
                onChange={(e) => setFormData({...formData, nroOperacion: e.target.value})}
              />
            </div>

            {/* Botón */}
            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-black shadow-xl shadow-primary/20"
            >
              Confirmar e Inscribir
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
                  <p className="text-xs">Nombre: {selectedPayment.student}</p>
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
                  className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 font-black gap-2"
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { title: "T. RECAUDACIÓN ", value: `S/ ${totalRecaudado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-blue-600", bg: "bg-blue-400/10" },
           { title: "PENDIENTES", value: `S/ ${totalPendientes.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, icon: Clock, color: "text-amber-600", bg: "bg-amber-400/10" },
           { title: "MATRÍCULAS MES", value: matriculasMes.toString(), icon: GraduationCap, color: "text-rose-600", bg: "bg-rose-400/10" },
           { title: "NUEVOS ABONOS", value: payments.length > 0 ? "RECIENTE" : "0", icon: Plus, color: "text-emerald-600", bg: "bg-emerald-400/10" },
         ].map((stat) => (
           <Card key={stat.title}>
              <CardContent className="px-4 py-2">
                 <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.title}: </p>
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

      <div className="rounded-2xl shadow-sm bg-card border border-border/50 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/50  px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">Listado de Pagos</h2>
          <div className="flex items-center gap-4 flex-1 max-w-xl justify-end">
            <div className="flex items-center gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-xl bg-background border-border/50 focus:ring-primary/20 font-medium text-sm px-4 border"
              >
                <option value="">Todos</option>
                <option value="PAGADO">Pagados</option>
                <option value="PENDIENTE">Pendientes</option>
                <option value="ANULADO">Anulados</option>
              </select>
            </div>  
            <div className="relative w-full md:w-80 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Buscar pagos, alumnos..." 
                  className="pl-10 h-10 rounded-xl bg-background border-border/50 focus:ring-primary/20 font-medium text-sm"
                />
            </div>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-border/50 hover:bg-transparent">
              <TableHead className="py-4 px-6 font-bold text-xs uppercase tracking-wider">ID</TableHead>
              <TableHead className="font-bold text-xs">Estudiante / Curso</TableHead>
              <TableHead className="font-bold text-center">Monto</TableHead>
              <TableHead className="font-bold text-center">Estado</TableHead>
              <TableHead className="font-bold text-center">Fecha</TableHead>
              <TableHead className="font-bold text-center">Método</TableHead>
              <TableHead className="text-right font-bold pr-8 text-xs">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center font-bold text-muted-foreground animate-pulse">
                  Cargando transacciones bancarias...
                </TableCell>
              </TableRow>
            ) : filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center opacity-30">
                      <AlertCircle className="h-12 w-12 mb-2" />
                      <p className="font-bold">No hay abonos registrados todavía</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : currentPayments.map((p: any) => (
              <TableRow key={p.idPago} className="border-b border-border hover:bg-muted/70 transition-colors group">
                <TableCell className="px-6 py-4">
                  <span className="font-mono text-sm font-bold text-muted-foreground">#{p.idPago}</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col max-w-[240px]">
                    <span className="text-sm font-black text-foreground leading-none truncate">
                      {p.student}
                    </span>
                    <span className="text-xs font-bold text-chart-3 mt-1 leading-none truncate">
                      {p.course}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-sm text-muted-foreground uppercase tracking-tighter">{p.amount}</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge className={cn(
                    "text-[10px] font-black rounded-full px-3 py-1 border-0 shadow-sm",
                    p.status === "PAGADO" && "bg-emerald-500/10 text-emerald-600",
                    p.status === "PENDIENTE" && "bg-amber-500/10 text-amber-600",
                    p.status === "ANULADO" && "bg-rose-500/10 text-rose-600",
                  )}>
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 items-center gap-2 flex">
                  <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">{p.method}</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-sm text-muted-foreground uppercase tracking-tighter">
                    {new Date(p.date).toLocaleDateString('es-PE')}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"  className="h-10 w-10 rounded-xl p-4 border-1 border-gray-300">
                        <Settings className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl font-medium shadow-xl">

                      {/* PENDIENTE */}
                      {p.status === "PENDIENTE" && (
                        <>
                          <DropdownMenuItem 
                            onClick={() => handleActualizarEstado(p.idPago, "PAGADO")}
                            className="text-emerald-600 font-bold cursor-pointer transition-colors focus:bg-emerald-50 focus:text-emerald-700 py-2.5"
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Marcar como Pagado
                          </DropdownMenuItem>

                          <DropdownMenuItem 
                            onClick={() => handleActualizarEstado(p.idPago, "ANULADO")}
                            className="text-rose-600 font-bold cursor-pointer transition-colors focus:bg-rose-50 focus:text-rose-700 py-2.5"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Rechazar / Anular
                          </DropdownMenuItem>
                        </>
                      )}

                      {/* PAGADO */}
                      {p.status === "PAGADO" && (
                        <>
                          <DropdownMenuItem 
                            onClick={() => verBoleta(p)}
                            className="text-blue-600 font-bold cursor-pointer transition-colors focus:bg-blue-50 focus:text-blue-700 py-2.5"
                          >
                            <Receipt className="mr-2 h-4 w-4" />
                            Ver Boleta
                          </DropdownMenuItem>

                          <DropdownMenuItem 
                            onClick={() => handleActualizarEstado(p.idPago, "ANULADO")}
                            className="text-rose-600 font-bold cursor-pointer transition-colors focus:bg-rose-50 focus:text-rose-700 py-2.5"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Rechazar / Anular
                          </DropdownMenuItem>
                        </>
                      )}

                      {/* ANULADO */}
                      {p.status === "ANULADO" && (
                        <div className="px-3 py-2 text-xs text-muted-foreground italic text-center w-36">
                          No hay acciones disponibles
                        </div>
                      )}

                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Controles de Paginación */}
        {!isLoading && filteredPayments.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-6 border-t border-border/30">
            <div className="text-sm text-muted-foreground font-medium">
              Mostrando{" "}
              <span className="font-bold text-foreground">{indexOfFirstItem + 1}</span>
              {" "}–{" "}
              <span className="font-bold text-foreground">{Math.min(indexOfLastItem, filteredPayments.length)}</span>
              {" "}de{" "}
              <span className="font-bold text-foreground">{filteredPayments.length}</span>
              {" "}pagos
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
