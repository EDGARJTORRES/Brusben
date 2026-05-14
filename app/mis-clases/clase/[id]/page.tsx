"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  PlayCircle, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Play,
  File,
  Download,
  Link as LinkIcon,
  Video,
  Menu,
  X,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Archivo {
  idArchivo: number
  titulo: string
  tipoArchivo: "VIDEO" | "PDF" | "DOC" | "LINK"
  urlArchivo: string
}

interface Material {
  idMaterial: number
  titulo: string
  tipoMaterial: string
  urlMaterial?: string
  archivos: Archivo[]
  completado?: boolean
}

interface Modulo {
  idModulo: number
  nombre: string
  materiales: Material[]
}

interface Curso {
  idCurso: number
  titulo: string
  descripcion: string
  docenteNombre: string
  imgCurso: string
}

export default function ClasePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const idCurso = params.id

  const [curso, setCurso] = useState<Curso | null>(null)
  const [modulos, setModulos] = useState<Modulo[]>([])
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (idCurso) {
      fetchData()
    }
  }, [idCurso])

  const fetchData = async () => {
    setLoading(true)
    try {
      const cursoRes = await fetch(`http://localhost:8081/api/cursos/${idCurso}`)
      if (!cursoRes.ok) throw new Error("Error al cargar curso")
      const cursoData = await cursoRes.json()
      setCurso(cursoData)

      const modRes = await fetch(`http://localhost:8081/api/cursos-materiales/${idCurso}/modulos`)
      if (!modRes.ok) throw new Error("Error al cargar módulos")
      const modulosData = await modRes.json()

      const modulosWithArchivos = await Promise.all(
        (Array.isArray(modulosData) ? modulosData : []).map(async (modulo: any) => {
          const materialesWithArchivos = await Promise.all(
            (modulo.materiales || []).map(async (material: any) => {
              try {
                const archivosRes = await fetch(`http://localhost:8081/api/cursos-materiales/materiales/${material.idMaterial}/archivos`)
                if (archivosRes.ok) {
                  const archivosData = await archivosRes.json()
                  return {
                    ...material,
                    archivos: archivosData.success ? archivosData.archivos || [] : []
                  }
                }
              } catch (error) {
                console.error(`Error loading archivos for material ${material.idMaterial}:`, error)
              }
              return { ...material, archivos: [] }
            })
          )
          return { ...modulo, materiales: materialesWithArchivos }
        })
      )

      setModulos(modulosWithArchivos)

      if (modulosWithArchivos.length > 0 && modulosWithArchivos[0].materiales?.length > 0) {
        setSelectedMaterial(modulosWithArchivos[0].materiales[0])
      }

    } catch (error) {
      console.error(error)
      toast.error("Error al cargar la clase")
    } finally {
      setLoading(false)
    }
  }

  const currentVideo = useMemo(() => {
    if (!selectedMaterial) return null
    const videoArchivo = selectedMaterial.archivos.find(a => a.tipoArchivo === "VIDEO")
    if (videoArchivo) return videoArchivo
    if (selectedMaterial.tipoMaterial === "VIDEO" && selectedMaterial.urlMaterial) {
      return { urlArchivo: selectedMaterial.urlMaterial, titulo: selectedMaterial.titulo, tipoArchivo: "VIDEO" }
    }
    return null
  }, [selectedMaterial])

  const resources = useMemo(() => {
    if (!selectedMaterial) return []
    return selectedMaterial.archivos.filter(a => a.tipoArchivo !== "VIDEO")
  }, [selectedMaterial])

  const getEmbedUrl = (url: string) => {
    if (!url) return ""
    if (url.includes("youtube.com/watch?v=")) return url.replace("watch?v=", "embed/")
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "youtube.com/embed/")
    if (url.includes("vimeo.com/")) {
      const id = url.split("/").pop()
      return `https://player.vimeo.com/video/${id}`
    }
    return url
  }

  const getFileUrl = (url: string) => {
    if (!url) return ""
    if (url.startsWith("http")) return url
    const cleanPath = url.startsWith("/") ? url.substring(1) : url
    return `http://localhost:8081/${cleanPath}`
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-bold animate-pulse text-sm">Preparando tu clase...</p>
        </div>
      </div>
    )
  }

  if (!curso) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-black mb-2">Clase no encontrada</h2>
        <p className="text-muted-foreground mb-8 text-sm">El curso no está disponible.</p>
        <Button onClick={() => router.push("/mis-clases/cursos")} className="rounded-2xl">
          Volver a mis cursos
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* SECCIÓN SUPERIOR: VIDEO Y CURRÍCULO */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* PLAYER AREA */}
        <div className="xl:col-span-2 space-y-6">
          <div className="w-full bg-black aspect-video relative rounded-[0.5rem] overflow-hidden shadow-2xl ring-1 ring-border/50">
            {currentVideo ? (
              currentVideo.urlArchivo.includes("youtube.com") || currentVideo.urlArchivo.includes("vimeo.com") ? (
                <iframe
                  src={getEmbedUrl(currentVideo.urlArchivo)}
                  className="w-full h-full"
                  allowFullScreen
                  title={currentVideo.titulo}
                />
              ) : (
                <video
                  key={currentVideo.urlArchivo}
                  controls
                  className="w-full h-full object-contain"
                  poster={getFileUrl(curso.imgCurso)}
                >
                  <source src={getFileUrl(currentVideo.urlArchivo)} type="video/mp4" />
                </video>
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/10">
                <Video className="h-16 w-16 mb-4 opacity-10" />
                <p className="text-lg font-black opacity-60">Sin video disponible</p>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 px-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/10 text-primary border-0 rounded-full px-3 py-0.5 font-black text-[10px] tracking-widest uppercase">
                  Clase en vivo
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                  <Clock className="h-3.5 w-3.5" />
                  <span>45 mins</span>
                </div>
              </div>
              <h1 className="text-2xl lg:text-3xl font-black text-foreground tracking-tight leading-tight">
                {selectedMaterial?.titulo || "Selecciona una clase"}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-2xl h-11 px-6 border-border bg-card hover:bg-muted font-black text-xs">
                Anterior
              </Button>
              <Button className="rounded-2xl h-11 px-6 bg-primary text-white font-black shadow-xl shadow-primary/20 text-xs gap-2">
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* CURRICULUM AREA */}
        <div className="bg-card rounded-[2rem] border border-border/60 shadow-sm overflow-hidden flex flex-col h-full max-h-[600px] xl:max-h-[unset]">
          <div className="p-6 border-b border-border/60 bg-muted/20">
            <h3 className="font-black text-sm flex items-center gap-2 uppercase tracking-widest">
              <BookOpen className="h-4 w-4 text-primary" />
              Contenido del Curso
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <Accordion type="multiple" defaultValue={modulos.map(m => m.idModulo.toString())} className="space-y-3">
              {modulos.map((modulo, mIdx) => (
                <AccordionItem key={modulo.idModulo} value={modulo.idModulo.toString()} className="border-none">
                  <AccordionTrigger className="hover:no-underline py-2 px-3 rounded-xl hover:bg-muted/50 transition-all group">
                    <div className="flex items-center gap-3 text-left">
                      <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center shrink-0 font-black text-[10px] text-muted-foreground group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-all">
                        {mIdx + 1}
                      </div>
                      <span className="text-xs font-black text-foreground/80 group-hover:text-foreground transition-colors uppercase tracking-tight">{modulo.nombre}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-0 pl-4 space-y-1">
                    {modulo.materiales?.map((material) => (
                      <button
                        key={material.idMaterial}
                        onClick={() => setSelectedMaterial(material)}
                        className={cn(
                          "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 group text-left",
                          selectedMaterial?.idMaterial === material.idMaterial 
                            ? "bg-primary/5 text-primary" 
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <div className={cn(
                          "h-5 w-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-all",
                          selectedMaterial?.idMaterial === material.idMaterial 
                            ? "border-primary bg-primary text-white" 
                            : "border-muted-foreground/30 group-hover:border-primary/50"
                        )}>
                          {material.completado ? <CheckCircle2 className="h-3 w-3" /> : <Play className="h-2 w-2 ml-0.5" />}
                        </div>
                        <p className="text-xs font-bold truncate flex-1">{material.titulo}</p>
                      </button>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

      </div>

      {/* SECCIÓN INFERIOR: DESCRIPCIÓN Y RECURSOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-black">Información de la Clase</h3>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed font-medium">
              Aprende a dominar los conceptos clave presentados en este módulo. 
              Esta clase está diseñada para brindarte herramientas prácticas y teóricas 
              que podrás aplicar inmediatamente en tus proyectos.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center shadow-inner">
              <Download className="h-5 w-5 text-emerald-500" />
            </div>
            <h3 className="text-xl font-black">Materiales</h3>
          </div>
          
          <div className="space-y-3">
            {resources.length > 0 ? (
              resources.map((res) => (
                <a 
                  key={res.idArchivo}
                  href={getFileUrl(res.urlArchivo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-card hover:bg-muted border border-border transition-all group"
                >
                  <div className="h-11 w-11 rounded-xl bg-background flex items-center justify-center shrink-0 border border-border shadow-sm group-hover:scale-105 transition-transform">
                    {res.tipoArchivo === "PDF" && <File className="h-5 w-5 text-rose-500" />}
                    {res.tipoArchivo === "DOC" && <FileText className="h-5 w-5 text-blue-500" />}
                    {res.tipoArchivo === "LINK" && <LinkIcon className="h-5 w-5 text-emerald-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-black text-foreground truncate group-hover:text-primary transition-colors uppercase tracking-tight">
                      {res.titulo}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                      {res.tipoArchivo} • DESCARGAR
                    </p>
                  </div>
                  <Download className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                </a>
              ))
            ) : (
              <div className="p-10 text-center rounded-[2rem] border-2 border-dashed border-border bg-muted/5">
                <FileText className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Sin recursos adicionales</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.3);
        }
      `}</style>
    </div>
  )
}
