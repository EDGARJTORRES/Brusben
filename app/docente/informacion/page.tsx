"use client"

import React, { useState, useEffect } from "react"
import {
  Building2,
  GraduationCap,
  Award,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Briefcase,
  MapPin,
  Calendar,
  Star,
  Paperclip,
  FileText,
  ExternalLink,
  UploadCloud,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

interface InfoLaboral {
  idInfoLaboral?: number
  idDocente: number
  cargo: string
  institucion: string
  ubicacion: string
  fechaInicio: string
  fechaFin?: string
  trabajoActual: boolean
  descripcion?: string
  documentoUrl?: string
}

interface Titulo {
  idTitulo?: number
  idDocente: number
  titulo: string
  institucion: string
  anio: number
  nivel: string   // BACHILLER | LICENCIATURA | MAESTRIA | DOCTORADO | CERTIFICACION | OTRO
  descripcion?: string
  documentoUrl?: string
}

interface Premio {
  idPremio?: number
  idDocente: number
  nombre: string
  institucion: string
  anio: number
  descripcion?: string
  documentoUrl?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NIVELES_TITULO = [
  { value: "BACHILLER",     label: "Bachiller" },
  { value: "LICENCIATURA",  label: "Licenciatura" },
  { value: "MAESTRIA",      label: "Maestría" },
  { value: "DOCTORADO",     label: "Doctorado" },
  { value: "CERTIFICACION", label: "Certificación" },
  { value: "OTRO",          label: "Otro" },
]

const NIVEL_COLORS: Record<string, string> = {
  BACHILLER:     "bg-blue-100 text-blue-700 border-blue-200",
  LICENCIATURA:  "bg-indigo-100 text-indigo-700 border-indigo-200",
  MAESTRIA:      "bg-purple-100 text-purple-700 border-purple-200",
  DOCTORADO:     "bg-rose-100 text-rose-700 border-rose-200",
  CERTIFICACION: "bg-emerald-100 text-emerald-700 border-emerald-200",
  OTRO:          "bg-slate-100 text-slate-700 border-slate-200",
}

const API = "http://localhost:8081/api"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function authHeaders() {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function yearRange(from = 1970) {
  const current = new Date().getFullYear()
  const years: number[] = []
  for (let y = current; y >= from; y--) years.push(y)
  return years
}

async function uploadDocumento(file: File): Promise<string | null> {
  const token = localStorage.getItem("token")
  const fd = new FormData()
  fd.append("file", file)
  try {
    const res = await fetch(`${API}/docentes/upload-documento`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: fd,
    })
    if (res.ok) {
      const data = await res.json()
      return data.url as string
    }
    return null
  } catch {
    return null
  }
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InformacionPage() {
  const { user } = useAuth()

  // data
  const [laboral, setLaboral]   = useState<InfoLaboral[]>([])
  const [titulos, setTitulos]   = useState<Titulo[]>([])
  const [premios, setPremios]   = useState<Premio[]>([])
  const [loading, setLoading]   = useState(true)

  // active tab
  const [tab, setTab] = useState<"laboral" | "titulos" | "premios">("laboral")

  // dialogs
  const [laboralDialog, setLaboralDialog] = useState(false)
  const [tituloDialog,  setTituloDialog]  = useState(false)
  const [premioDialog,  setPremioDialog]  = useState(false)

  // editing items
  const [editLaboral, setEditLaboral] = useState<InfoLaboral | null>(null)
  const [editTitulo,  setEditTitulo]  = useState<Titulo | null>(null)
  const [editPremio,  setEditPremio]  = useState<Premio | null>(null)

  // ── forms ──
  const emptyLaboral = (): InfoLaboral => ({
    idDocente: user?.id ?? 0,
    cargo: "", institucion: "", ubicacion: "",
    fechaInicio: "", fechaFin: "", trabajoActual: false, descripcion: "",
  })
  const emptyTitulo = (): Titulo => ({
    idDocente: user?.id ?? 0,
    titulo: "", institucion: "", anio: new Date().getFullYear(),
    nivel: "BACHILLER", descripcion: "",
  })
  const emptyPremio = (): Premio => ({
    idDocente: user?.id ?? 0,
    nombre: "", institucion: "", anio: new Date().getFullYear(), descripcion: "",
  })

  const [formLaboral, setFormLaboral] = useState<InfoLaboral>(emptyLaboral())
  const [formTitulo,  setFormTitulo]  = useState<Titulo>(emptyTitulo())
  const [formPremio,  setFormPremio]  = useState<Premio>(emptyPremio())

  // ── file upload state ──
  const [fileLaboral, setFileLaboral] = useState<File | null>(null)
  const [fileTitulo,  setFileTitulo]  = useState<File | null>(null)
  const [filePremio,  setFilePremio]  = useState<File | null>(null)
  const [uploading,   setUploading]   = useState(false)

  // ── fetch ──
  useEffect(() => {
    if (user?.id) fetchAll()
  }, [user])

  async function fetchAll() {
    setLoading(true)
    try {
      const [lRes, tRes, pRes] = await Promise.all([
        fetch(`${API}/docentes/${user!.id}/info-laboral`,  { headers: authHeaders() }),
        fetch(`${API}/docentes/${user!.id}/titulos`,       { headers: authHeaders() }),
        fetch(`${API}/docentes/${user!.id}/premios`,       { headers: authHeaders() }),
      ])
      if (lRes.ok) setLaboral(await lRes.json())
      if (tRes.ok) setTitulos(await tRes.json())
      if (pRes.ok) setPremios(await pRes.json())
    } catch {
      toast.error("Error al cargar la información")
    } finally {
      setLoading(false)
    }
  }

  // ── CRUD laboral ──
  async function saveLaboral(e: React.FormEvent) {
    e.preventDefault()
    if (!formLaboral.cargo || !formLaboral.institucion || !formLaboral.fechaInicio) {
      toast.warning("Completa los campos obligatorios")
      return
    }
    const isEdit = !!editLaboral?.idInfoLaboral
    const url    = isEdit
      ? `${API}/docentes/info-laboral/${editLaboral!.idInfoLaboral}`
      : `${API}/docentes/info-laboral`
    try {
      setUploading(true)
      let documentoUrl = formLaboral.documentoUrl
      if (fileLaboral) {
        const uploaded = await uploadDocumento(fileLaboral)
        if (uploaded) documentoUrl = uploaded
        else toast.warning("No se pudo subir el documento, se guardará sin él")
      }
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: authHeaders(),
        body: JSON.stringify({ ...formLaboral, documentoUrl, idDocente: user!.id }),
      })
      if (res.ok) {
        toast.success(isEdit ? "Experiencia actualizada" : "Experiencia agregada")
        setLaboralDialog(false)
        setFileLaboral(null)
        fetchAll()
      } else {
        toast.error("Error al guardar")
      }
    } catch { toast.error("Error de conexión") }
    finally { setUploading(false) }
  }

  async function deleteLaboral(id: number) {
    try {
      const res = await fetch(`${API}/docentes/info-laboral/${id}`, {
        method: "DELETE", headers: authHeaders(),
      })
      if (res.ok) { toast.success("Eliminado"); fetchAll() }
      else toast.error("Error al eliminar")
    } catch { toast.error("Error de conexión") }
  }

  // ── CRUD titulos ──
  async function saveTitulo(e: React.FormEvent) {
    e.preventDefault()
    if (!formTitulo.titulo || !formTitulo.institucion) {
      toast.warning("Completa los campos obligatorios")
      return
    }
    const isEdit = !!editTitulo?.idTitulo
    const url    = isEdit
      ? `${API}/docentes/titulos/${editTitulo!.idTitulo}`
      : `${API}/docentes/titulos`
    try {
      setUploading(true)
      let documentoUrl = formTitulo.documentoUrl
      if (fileTitulo) {
        const uploaded = await uploadDocumento(fileTitulo)
        if (uploaded) documentoUrl = uploaded
        else toast.warning("No se pudo subir el documento, se guardará sin él")
      }
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: authHeaders(),
        body: JSON.stringify({ ...formTitulo, documentoUrl, idDocente: user!.id }),
      })
      if (res.ok) {
        toast.success(isEdit ? "Título actualizado" : "Título agregado")
        setTituloDialog(false)
        setFileTitulo(null)
        fetchAll()
      } else {
        toast.error("Error al guardar")
      }
    } catch { toast.error("Error de conexión") }
    finally { setUploading(false) }
  }

  async function deleteTitulo(id: number) {
    try {
      const res = await fetch(`${API}/docentes/titulos/${id}`, {
        method: "DELETE", headers: authHeaders(),
      })
      if (res.ok) { toast.success("Eliminado"); fetchAll() }
      else toast.error("Error al eliminar")
    } catch { toast.error("Error de conexión") }
  }

  // ── CRUD premios ──
  async function savePremio(e: React.FormEvent) {
    e.preventDefault()
    if (!formPremio.nombre || !formPremio.institucion) {
      toast.warning("Completa los campos obligatorios")
      return
    }
    const isEdit = !!editPremio?.idPremio
    const url    = isEdit
      ? `${API}/docentes/premios/${editPremio!.idPremio}`
      : `${API}/docentes/premios`
    try {
      setUploading(true)
      let documentoUrl = formPremio.documentoUrl
      if (filePremio) {
        const uploaded = await uploadDocumento(filePremio)
        if (uploaded) documentoUrl = uploaded
        else toast.warning("No se pudo subir el documento, se guardará sin él")
      }
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: authHeaders(),
        body: JSON.stringify({ ...formPremio, documentoUrl, idDocente: user!.id }),
      })
      if (res.ok) {
        toast.success(isEdit ? "Premio actualizado" : "Premio agregado")
        setPremioDialog(false)
        setFilePremio(null)
        fetchAll()
      } else {
        toast.error("Error al guardar")
      }
    } catch { toast.error("Error de conexión") }
    finally { setUploading(false) }
  }

  async function deletePremio(id: number) {
    try {
      const res = await fetch(`${API}/docentes/premios/${id}`, {
        method: "DELETE", headers: authHeaders(),
      })
      if (res.ok) { toast.success("Eliminado"); fetchAll() }
      else toast.error("Error al eliminar")
    } catch { toast.error("Error de conexión") }
  }

  // ── open dialogs ──
  function openLaboralNew() {
    setEditLaboral(null)
    setFormLaboral(emptyLaboral())
    setFileLaboral(null)
    setLaboralDialog(true)
  }
  function openLaboralEdit(item: InfoLaboral) {
    setEditLaboral(item)
    setFormLaboral({ ...item })
    setFileLaboral(null)
    setLaboralDialog(true)
  }
  function openTituloNew() {
    setEditTitulo(null)
    setFormTitulo(emptyTitulo())
    setFileTitulo(null)
    setTituloDialog(true)
  }
  function openTituloEdit(item: Titulo) {
    setEditTitulo(item)
    setFormTitulo({ ...item })
    setFileTitulo(null)
    setTituloDialog(true)
  }
  function openPremioNew() {
    setEditPremio(null)
    setFormPremio(emptyPremio())
    setFilePremio(null)
    setPremioDialog(true)
  }
  function openPremioEdit(item: Premio) {
    setEditPremio(item)
    setFormPremio({ ...item })
    setFilePremio(null)
    setPremioDialog(true)
  }

  // ── skeleton ──
  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-2xl bg-primary/20 animate-pulse" />
          <div className="space-y-2">
            <div className="h-7 w-56 bg-primary/20 rounded-lg animate-pulse" />
            <div className="h-4 w-40 bg-primary/10 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // ── tabs config ──
  const tabs = [
    { key: "laboral",  label: "Experiencia Laboral", icon: Briefcase,     count: laboral.length },
    { key: "titulos",  label: "Títulos y Estudios",  icon: GraduationCap, count: titulos.length },
    { key: "premios",  label: "Premios y Logros",    icon: Award,         count: premios.length },
  ] as const

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-3">
            <Building2 className="h-6 w-6 text-primary" />
            Mi Información Profesional
          </h4>
          <p className="text-muted-foreground text-sm">
            Gestiona tu experiencia laboral, títulos académicos y reconocimientos
          </p>
        </div>

        {/* summary badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl px-4 py-2">
            <Briefcase className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700 dark:text-blue-400">{laboral.length} experiencias</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl px-4 py-2">
            <GraduationCap className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-bold text-purple-700 dark:text-purple-400">{titulos.length} títulos</span>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl px-4 py-2">
            <Award className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{premios.length} premios</span>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 border-b border-border pb-0 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-xl transition-all whitespace-nowrap border-b-2",
              tab === t.key
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            <span className={cn(
              "text-[10px] font-black px-1.5 py-0.5 rounded-full",
              tab === t.key ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            )}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: EXPERIENCIA LABORAL
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === "laboral" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openLaboralNew} className="rounded-xl h-10 px-5 font-bold gap-2">
              <Plus className="h-4 w-4" /> Agregar Experiencia
            </Button>
          </div>

          {laboral.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="Sin experiencia laboral"
              description="Agrega tu historial de trabajo para que los estudiantes conozcan tu trayectoria."
              onAdd={openLaboralNew}
              label="Agregar Experiencia"
            />
          ) : (
            <div className="space-y-4">
              {laboral.map(item => (
                <Card key={item.idInfoLaboral} className="border border-border/60 shadow-sm rounded-2xl hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-black text-foreground text-lg leading-tight">{item.cargo}</h3>
                            {item.trabajoActual && (
                              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 border text-[10px] font-black">
                                Actual
                              </Badge>
                            )}
                          </div>
                          <p className="text-primary font-bold mt-0.5">{item.institucion}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                            {item.ubicacion && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" /> {item.ubicacion}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {item.fechaInicio} — {item.trabajoActual ? "Presente" : (item.fechaFin || "—")}
                            </span>
                          </div>
                          {item.descripcion && (
                            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{item.descripcion}</p>
                          )}
                          {item.documentoUrl && (
                            <a
                              href={item.documentoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-primary hover:underline"
                            >
                              <Paperclip className="h-3.5 w-3.5" /> Ver documento adjunto
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      <ItemActions
                        onEdit={() => openLaboralEdit(item)}
                        onDelete={() => deleteLaboral(item.idInfoLaboral!)}
                        label={item.cargo}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: TÍTULOS
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === "titulos" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openTituloNew} className="rounded-xl h-10 px-5 font-bold gap-2">
              <Plus className="h-4 w-4" /> Agregar Título
            </Button>
          </div>

          {titulos.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="Sin títulos registrados"
              description="Agrega tus estudios y certificaciones para mostrar tu formación académica."
              onAdd={openTituloNew}
              label="Agregar Título"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {titulos.map(item => (
                <Card key={item.idTitulo} className="border border-border/60 shadow-sm rounded-2xl hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="h-12 w-12 rounded-2xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge className={cn("border text-[10px] font-black mb-2", NIVEL_COLORS[item.nivel] ?? NIVEL_COLORS.OTRO)}>
                            {NIVELES_TITULO.find(n => n.value === item.nivel)?.label ?? item.nivel}
                          </Badge>
                          <h3 className="font-black text-foreground leading-tight">{item.titulo}</h3>
                          <p className="text-primary font-bold text-sm mt-0.5">{item.institucion}</p>
                          <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" /> {item.anio}
                          </div>
                          {item.descripcion && (
                            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.descripcion}</p>
                          )}
                          {item.documentoUrl && (
                            <a
                              href={item.documentoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-primary hover:underline"
                            >
                              <Paperclip className="h-3.5 w-3.5" /> Ver documento adjunto
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      <ItemActions
                        onEdit={() => openTituloEdit(item)}
                        onDelete={() => deleteTitulo(item.idTitulo!)}
                        label={item.titulo}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: PREMIOS
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === "premios" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openPremioNew} className="rounded-xl h-10 px-5 font-bold gap-2">
              <Plus className="h-4 w-4" /> Agregar Premio
            </Button>
          </div>

          {premios.length === 0 ? (
            <EmptyState
              icon={Award}
              title="Sin premios registrados"
              description="Agrega tus reconocimientos y logros para destacar tu trayectoria."
              onAdd={openPremioNew}
              label="Agregar Premio"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {premios.map(item => (
                <Card key={item.idPremio} className="border border-border/60 shadow-sm rounded-2xl hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="h-12 w-12 rounded-2xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                          <Star className="h-6 w-6 text-amber-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-foreground leading-tight">{item.nombre}</h3>
                          <p className="text-primary font-bold text-sm mt-0.5">{item.institucion}</p>
                          <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" /> {item.anio}
                          </div>
                          {item.descripcion && (
                            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.descripcion}</p>
                          )}
                          {item.documentoUrl && (
                            <a
                              href={item.documentoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-primary hover:underline"
                            >
                              <Paperclip className="h-3.5 w-3.5" /> Ver documento adjunto
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      <ItemActions
                        onEdit={() => openPremioEdit(item)}
                        onDelete={() => deletePremio(item.idPremio!)}
                        label={item.nombre}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          DIALOG: EXPERIENCIA LABORAL
      ══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={laboralDialog} onOpenChange={setLaboralDialog}>
        <DialogContent className="sm:max-w-[960px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
          <form onSubmit={saveLaboral} className="bg-card flex flex-col max-h-[90vh]">

            {/* Header fijo */}
            <div className="px-8 py-5 border-b border-border/50 flex-shrink-0">
              <DialogTitle className="text-xl font-black flex items-center gap-3 text-foreground">
                <Briefcase className="h-5 w-5 text-primary" />
                {editLaboral ? "Editar Experiencia" : "Nueva Experiencia Laboral"}
              </DialogTitle>
            </div>

            {/* Cuerpo scrollable — 2 columnas principales */}
            <div className="overflow-y-auto flex-1 px-8 py-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-0 items-start">

                {/* ── Columna izquierda: campos de datos ── */}
                <div className="space-y-4">
                  <FormField label="Cargo / Puesto *">
                    <Input
                      placeholder="Ej. Docente de Matemáticas"
                      value={formLaboral.cargo}
                      onChange={e => setFormLaboral({ ...formLaboral, cargo: e.target.value })}
                      className="h-11 rounded-xl"
                      required
                    />
                  </FormField>

                  <FormField label="Institución / Empresa *">
                    <Input
                      placeholder="Ej. Universidad Nacional"
                      value={formLaboral.institucion}
                      onChange={e => setFormLaboral({ ...formLaboral, institucion: e.target.value })}
                      className="h-11 rounded-xl"
                      required
                    />
                  </FormField>

                  <FormField label="Ubicación">
                    <Input
                      placeholder="Ej. Chiclayo, Perú"
                      value={formLaboral.ubicacion}
                      onChange={e => setFormLaboral({ ...formLaboral, ubicacion: e.target.value })}
                      className="h-11 rounded-xl"
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Fecha de Inicio *">
                      <Input
                        type="month"
                        value={formLaboral.fechaInicio}
                        onChange={e => setFormLaboral({ ...formLaboral, fechaInicio: e.target.value })}
                        className="h-11 rounded-xl"
                        required
                      />
                    </FormField>

                    <FormField label="Fecha de Fin">
                      <Input
                        type="month"
                        value={formLaboral.fechaFin ?? ""}
                        onChange={e => setFormLaboral({ ...formLaboral, fechaFin: e.target.value })}
                        className="h-11 rounded-xl"
                        disabled={formLaboral.trabajoActual}
                      />
                    </FormField>
                  </div>                </div>

                {/* ── Columna derecha: checkbox + descripción + documento ── */}
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer select-none pt-7">
                    <input
                      type="checkbox"
                      checked={formLaboral.trabajoActual}
                      onChange={e => setFormLaboral({ ...formLaboral, trabajoActual: e.target.checked, fechaFin: e.target.checked ? "" : formLaboral.fechaFin })}
                      className="h-4 w-4 rounded accent-primary"
                    />
                    <span className="text-sm font-bold text-foreground">Trabajo actualmente aquí</span>
                  </label>

                  <FormField label="Descripción">
                    <Textarea
                      placeholder="Describe brevemente tus responsabilidades y logros..."
                      value={formLaboral.descripcion ?? ""}
                      onChange={e => setFormLaboral({ ...formLaboral, descripcion: e.target.value })}
                      className="rounded-xl resize-none"
                      rows={4}
                    />
                  </FormField>

                  <FileUpload
                    file={fileLaboral}
                    existingUrl={formLaboral.documentoUrl}
                    onFileChange={setFileLaboral}
                    onClearExisting={() => setFormLaboral({ ...formLaboral, documentoUrl: undefined })}
                  />
                </div>

              </div>
            </div>

            {/* Footer fijo */}
            <div className="flex gap-3 px-8 py-5 border-t border-border/50 flex-shrink-0 ">
              <Button type="button" variant="ghost" onClick={() => setLaboralDialog(false)} className="h-11 px-6 font-bold rounded-xl border">
                <X className="h-4 w-4 mr-1" /> Cancelar
              </Button>
              <Button type="submit" disabled={uploading} className="h-11 px-6 font-bold rounded-xl gap-2">
                {uploading
                  ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  : <Save className="h-4 w-4" />}
                {editLaboral ? "Guardar Cambios" : "Agregar Experiencia"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════════════
          DIALOG: TÍTULO
      ══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={tituloDialog} onOpenChange={setTituloDialog}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
          <form onSubmit={saveTitulo} className="bg-card">
            <div className="px-8 py-5 border-b border-border/50">
              <DialogTitle className="text-xl font-black flex items-center gap-3 text-foreground">
                <GraduationCap className="h-5 w-5 text-primary" />
                {editTitulo ? "Editar Título" : "Nuevo Título / Estudio"}
              </DialogTitle>
            </div>
            <div className="p-8 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Nivel Académico *">
                  <Select
                    value={formTitulo.nivel}
                    onValueChange={v => setFormTitulo({ ...formTitulo, nivel: v })}
                  >
                    <SelectTrigger className="h-11 rounded-xl w-65">
                      <SelectValue placeholder="Selecciona el nivel" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {NIVELES_TITULO.map(n => (
                        <SelectItem key={n.value} value={n.value} className="font-bold py-2.5">
                          {n.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Año de Obtención *">
                  <Select
                    value={formTitulo.anio.toString()}
                    onValueChange={v => setFormTitulo({ ...formTitulo, anio: parseInt(v) })}
                  >
                    <SelectTrigger className="h-11 rounded-xl w-65">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl max-h-56">
                      {yearRange().map(y => (
                        <SelectItem key={y} value={y.toString()} className="font-bold">{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Título / Nombre del Estudio *">
                  <Input
                    placeholder="Ej. Ingeniería de Sistemas"
                    value={formTitulo.titulo}
                    onChange={e => setFormTitulo({ ...formTitulo, titulo: e.target.value })}
                    className="h-11 rounded-xl"
                    required
                  />
                </FormField>
                <FormField label="Institución *">
                  <Input
                    placeholder="Ej. UNPRG"
                    value={formTitulo.institucion}
                    onChange={e => setFormTitulo({ ...formTitulo, institucion: e.target.value })}
                    className="h-11 rounded-xl"
                    required
                  />
                </FormField>
              </div>
              <FormField label="Descripción">
                <Textarea
                  placeholder="Información adicional sobre el título o estudio..."
                  value={formTitulo.descripcion ?? ""}
                  onChange={e => setFormTitulo({ ...formTitulo, descripcion: e.target.value })}
                  className="rounded-xl resize-none"
                  rows={3}
                />
              </FormField>
              <FileUpload
                file={fileTitulo}
                existingUrl={formTitulo.documentoUrl}
                onFileChange={setFileTitulo}
                onClearExisting={() => setFormTitulo({ ...formTitulo, documentoUrl: undefined })}
              />
            </div>
            <div className="flex gap-3 px-8 pb-8">
              <Button type="button" variant="ghost" onClick={() => setTituloDialog(false)} className="h-11 px-6 font-bold rounded-xl border">
                <X className="h-4 w-4 mr-1" /> Cancelar
              </Button>
              <Button type="submit" disabled={uploading} className="h-11 px-6 font-bold rounded-xl gap-2">
                {uploading ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Save className="h-4 w-4" />}
                {editTitulo ? "Guardar Cambios" : "Agregar Titulo"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════════════
          DIALOG: PREMIO
      ══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={premioDialog} onOpenChange={setPremioDialog}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
          <form onSubmit={savePremio} className="bg-card">
            <div className="px-8 py-5 border-b border-border/50">
              <DialogTitle className="text-xl font-black flex items-center gap-3 text-foreground">
                <Award className="h-5 w-5 text-primary" />
                {editPremio ? "Editar Premio" : "Nuevo Premio / Reconocimiento"}
              </DialogTitle>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Nombre del Premio *">
                  <Input
                    placeholder="Ej. Mejor Docente del Año"
                    value={formPremio.nombre}
                    onChange={e => setFormPremio({ ...formPremio, nombre: e.target.value })}
                    className="h-11 rounded-xl"
                    required
                  />
                </FormField>
                <FormField label="Año *">
                  <Select
                    value={formPremio.anio.toString()}
                    onValueChange={v => setFormPremio({ ...formPremio, anio: parseInt(v) })}
                  >
                    <SelectTrigger className="h-14 rounded-xl w-65 ">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl max-h-56">
                      {yearRange().map(y => (
                        <SelectItem key={y} value={y.toString()} className="font-bold">{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
              <FormField label="Institución Otorgante *">
                  <Input
                    placeholder="Ej. Ministerio de Educación"
                    value={formPremio.institucion}
                    onChange={e => setFormPremio({ ...formPremio, institucion: e.target.value })}
                    className="h-11 rounded-xl"
                    required
                  />
              </FormField>
              <FormField label="Descripción">
                <Textarea
                  placeholder="Describe el contexto o importancia de este reconocimiento..."
                  value={formPremio.descripcion ?? ""}
                  onChange={e => setFormPremio({ ...formPremio, descripcion: e.target.value })}
                  className="rounded-xl resize-none"
                  rows={3}
                />
              </FormField>
              <FileUpload
                file={filePremio}
                existingUrl={formPremio.documentoUrl}
                onFileChange={setFilePremio}
                onClearExisting={() => setFormPremio({ ...formPremio, documentoUrl: undefined })}
              />
            </div>
            <div className="flex gap-3 px-8 pb-8">
              <Button type="button" variant="ghost" onClick={() => setPremioDialog(false)} className="h-11 px-6 font-bold rounded-xl border">
                <X className="h-4 w-4 mr-1" /> Cancelar
              </Button>
              <Button type="submit" disabled={uploading} className="h-11 px-6 font-bold rounded-xl gap-2">
                {uploading ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Save className="h-4 w-4" />}
                {editPremio ? "Guardar Cambios" : "Agregar Premio"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FileUpload({
  file,
  existingUrl,
  onFileChange,
  onClearExisting,
}: {
  file: File | null
  existingUrl?: string
  onFileChange: (f: File | null) => void
  onClearExisting: () => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = React.useState(false)

  const ACCEPTED = ".pdf,.doc,.docx,.jpg,.jpeg,.png"
  const MAX_MB   = 10

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const f = files[0]
    if (f.size > MAX_MB * 1024 * 1024) {
      toast.error(`El archivo no debe superar ${MAX_MB} MB`)
      return
    }
    onFileChange(f)
  }

  // If there's already a selected new file, show it
  if (file) {
    return (
      <div className="space-y-2">
        <label className="text-xs font-black uppercase text-muted-foreground tracking-widest pl-1">
          Documento Adjunto
        </label>
        <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/30 bg-primary/5">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            type="button"
            onClick={() => onFileChange(null)}
            className="h-7 w-7 rounded-lg hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  // If there's an existing saved URL
  if (existingUrl) {
    return (
      <div className="space-y-2">
        <label className="text-xs font-black uppercase text-muted-foreground tracking-widest pl-1">
          Documento Adjunto
        </label>
        <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/20">
          <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Paperclip className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">Documento guardado</p>
            <a
              href={existingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
            >
              Ver archivo <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="h-7 px-2 rounded-lg text-xs font-bold hover:bg-blue-100 hover:text-blue-600 flex items-center gap-1 transition-colors"
            >
              <UploadCloud className="h-3.5 w-3.5" /> Reemplazar
            </button>
            <button
              type="button"
              onClick={onClearExisting}
              className="h-7 w-7 rounded-lg hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <input ref={inputRef} type="file" accept={ACCEPTED} className="hidden" onChange={e => handleFiles(e.target.files)} />
      </div>
    )
  }

  // Default: drop zone
  return (
    <div className="space-y-2">
      <label className="text-xs font-black uppercase text-muted-foreground tracking-widest pl-1">
        Documento Adjunto <span className="normal-case font-medium text-muted-foreground/70">(opcional)</span>
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed cursor-pointer transition-all",
          dragOver
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/50 hover:bg-muted/40"
        )}
      >
        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
          <UploadCloud className={cn("h-5 w-5 transition-colors", dragOver ? "text-primary" : "text-muted-foreground")} />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-foreground">
            Arrastra un archivo o <span className="text-primary">haz clic para seleccionar</span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">PDF, Word, JPG, PNG — máx. {MAX_MB} MB</p>
        </div>
      </div>
      <input ref={inputRef} type="file" accept={ACCEPTED} className="hidden" onChange={e => handleFiles(e.target.files)} />
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black uppercase text-muted-foreground tracking-widest pl-1">
        {label}
      </label>
      {children}
    </div>
  )
}

function EmptyState({
  icon: Icon, title, description, onAdd, label,
}: {
  icon: React.ElementType
  title: string
  description: string
  onAdd: () => void
  label: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center mb-6">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-8">{description}</p>
      <Button onClick={onAdd} className="rounded-xl h-11 px-6 font-bold gap-2">
        <Plus className="h-4 w-4" /> {label}
      </Button>
    </div>
  )
}

function ItemActions({
  onEdit, onDelete, label,
}: {
  onEdit: () => void
  onDelete: () => void
  label: string
}) {
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
        className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-xl">Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Seguro que deseas eliminar <b>{label}</b>? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl font-bold">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="rounded-xl font-black bg-rose-600 hover:bg-rose-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
