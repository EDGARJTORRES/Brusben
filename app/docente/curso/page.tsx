"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { logSystemAction } from "@/lib/logging"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { 
  Plus, Search, MoreVertical, BookOpen, LayoutGrid,
  Edit, Trash, ChevronLeft, ChevronRight, FileText,
  GripVertical, Paperclip, MessageSquare, PlusCircle, Trash2,
  Video, Link as LinkIcon, File, ArrowLeft,X,Pencil
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

interface Curso {
  idCurso?: number
  titulo: string
  imgCurso: string
  descripcion: string
  estCurso: any // Puede venir como string "A"/"I" o booleano
  idDocente: number
  docenteNombre: string
  catId?: number
  catNombre: string
  catColor: string
  precioCurso: number
  precio?: number // Opcional por compatibilidad
}

export default function CoursesPage() {
  const { user } = useAuth()

  const [courses, setCourses] = useState<Curso[]>([])
  const [docentes, setDocentes] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  
  const [search, setSearch] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState("all")
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("listado")

  const [formData, setFormData] = useState<Curso>({
    titulo: "",
    descripcion: "",
    idDocente: 0,
    docenteNombre: "",
    catNombre: "",
    imgCurso: "",
    catColor: "",
    precioCurso: 0,
    estCurso: true,
    catId: 0
  })

  // --- CONTENT MANAGEMENT STATES ---
  const [selectedCourseContent, setSelectedCourseContent] = useState<Curso | null>(null)
  const [contentModules, setContentModules] = useState<any[]>([])
  const [contentForos, setContentForos] = useState<any[]>([])
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [newModuleName, setNewModuleName] = useState("")
  const [newForo, setNewForo] = useState({ titulo: "", temaDiscusion: "", descripcion: "" })
  const [isEditingForo, setIsEditingForo] = useState(false)
  const [currentForoId, setCurrentForoId] = useState<number | null>(null)
  const [contentTab, setContentTab] = useState("curricula")
  const [openModuloId, setOpenModuloId] = useState<number | null>(null)

  // --- APORTES STATE ---
  const [aportes, setAportes] = useState<any[]>([])
  const [isAportesOpen, setIsAportesOpen] = useState(false)
  const [activeForoId, setActiveForoId] = useState<number | null>(null)
  const [newAporte, setNewAporte] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  useEffect(() => {
    fetchCourses()
    fetchDocentes()
    fetchCategorias()
  }, [user?.id])

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search, categoriaFilter])

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/cursos")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCourses(data)
    } catch {
      toast.error("Error al cargar cursos")
    }
  }

  const fetchDocentes = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/cursos/docentes")
      const data = await res.json()
      setDocentes(data)
    } catch (e) {
      console.error("Error fetching docentes", e)
    }
  }

  const fetchCategorias = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/categorias")
      const data = await res.json()
      setCategorias(data)
    } catch (e) {
      console.error("Error fetching categorias", e)
    }
  }
  const toggleModulo = (id: number) => {
    setOpenModuloId(prev => (prev === id ? null : id))
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
  const openMaterial = (url: string) => {
    if (url.startsWith("http")) {
      window.open(url, "_blank")
    } else {
      window.open(`/${url}`, "_blank")
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formDataUpload = new FormData()
    formDataUpload.append("file", file)

    try {
      const res = await fetch("http://localhost:8081/api/cursos/upload", {
        method: "POST",
        body: formDataUpload
      })
      const data = await res.json()
      if (data.path) {
        setFormData(prev => ({ ...prev, imgCurso: data.path }))
        toast.success("Imagen subida correctamente")
      }
    } catch (error) {
      toast.error("Error al subir imagen")
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const body = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      imgCurso: formData.imgCurso,
      precioCurso: Number(formData.precioCurso),
      catId: Number(formData.catId),
      idDocente: Number(formData.idDocente),
      estCurso: formData.estCurso === true || formData.estCurso === "A" ? "A" : "I"
    }

    try {
      const url = isEditing 
        ? `http://localhost:8081/api/cursos/${formData.idCurso}`
        : "http://localhost:8081/api/cursos"
      
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

      if (res.ok) {
        // Log the action
        if (isEditing) {
          await logSystemAction('CURSO_ACTUALIZADO', [formData.titulo], user?.id)
        } else {
          await logSystemAction('CURSO_CREADO', [formData.titulo], user?.id)
        }
        
        toast.success(isEditing ? "Curso actualizado" : "Curso registrado")
        resetForm()
        fetchCourses()
        setActiveTab("listado")
      } else {
        const error = await res.json()
        toast.error(error.error || "Error al guardar")
      }
    } catch {
      toast.error("Error al conectar con el servidor")
    }
  }

  const resetForm = () => {
    setFormData({
      titulo: "",
      descripcion: "",
      idDocente: 0,
      docenteNombre: "",
      catNombre: "",
      imgCurso: "",
      catColor: "",
      precioCurso: 0,
      estCurso: true,
      catId: 0
    })
    setIsEditing(false)
  }

  const openEditDialog = (course: Curso) => {
    setFormData({
      ...course,
      catId: course.catId || categorias.find(c => c.catNombre === course.catNombre)?.catId,
      estCurso: course.estCurso === "A" || course.estCurso === true
    })
    setIsEditing(true)
    setActiveTab("nuevo")
  }

  const toggleStatus = async (course: any) => {
    try {
      const res = await fetch(`http://localhost:8081/api/cursos/${course.idCurso}/toggle-estado`, {
        method: "PUT"
      })
      if (res.ok) {
        toast.success("Estado actualizado")
        fetchCourses()
      }
    } catch {
      toast.error("Error al cambiar estado")
    }
  }

  const deleteCurso = async (id: number) => {
    try {
      // Find course title for logging
      const courseToDelete = courses.find(c => c.idCurso === id)
      
      const res = await fetch(`http://localhost:8081/api/cursos/${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        // Log the action
        if (courseToDelete) {
          await logSystemAction('CURSO_ELIMINADO', [courseToDelete.titulo], user?.id)
        }
        
        toast.success("Curso eliminado")
        fetchCourses()
      }
    } catch {
      toast.error("Error al eliminar")
    }
  }

  const filteredCourses = (courses || []).filter(c =>
    (c.titulo || "").toLowerCase().includes(search.toLowerCase()) &&
    (categoriaFilter === "all" || c.catNombre === categoriaFilter) &&
    c.idDocente === user?.id
  )

  const getImageUrl = (img?: string) => {
    if (!img || img === "") return "/images/course-finance.jpg"
    if (img.startsWith("http") || img.startsWith("data:")) return img
    let cleanPath = img.replace(/^public\//, "").replace(/^\/public\//, "")
    const fileName = cleanPath.replace(/^\//, "").replace(/^cursos\//, "")
    return `/cursos/${fileName}`
  }

  // Paginación
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // --- CONTENT FETCHING ---
  const [viewMode, setViewMode] = useState<"list" | "content">("list")

  const openContentManager = async (course: Curso) => {
    setSelectedCourseContent(course)
    setViewMode("content")
    setContentTab("curricula") // Forzar pestaña por defecto
    setIsLoadingContent(true)
    try {
      const [modRes, foroRes] = await Promise.all([
        fetch(`http://localhost:8081/api/cursos-materiales/${course.idCurso}/modulos`),
        fetch(`http://localhost:8081/api/cursos-contenido/${course.idCurso}/foros`)
      ])
      
      // Validar respuestas y asegurar que sean arrays
      const modulosData = await modRes.json()
      const forosData = await foroRes.json()
      
      // Load archivos for each material
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
              return {
                ...material,
                archivos: []
              }
            })
          )
          return {
            ...modulo,
            materiales: materialesWithArchivos
          }
        })
      )
      
      setContentModules(modulosWithArchivos)
      setContentForos(Array.isArray(forosData) ? forosData : [])
    } catch (error) {
      console.error("Error al cargar contenido:", error)
      toast.error("Error al cargar contenido")
      setContentModules([]) // Asegurar que sea un array vacío en caso de error
      setContentForos([])
    } finally {
      setIsLoadingContent(false)
    }
  }

  const addModule = async () => {
    if (!newModuleName.trim()) return
    try {
      const res = await fetch(`http://localhost:8081/api/cursos-materiales/${selectedCourseContent?.idCurso}/modulos`, {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ nombre: newModuleName })
      })
      if (res.ok) {
        setNewModuleName("")
        openContentManager(selectedCourseContent!)
        toast.success("Módulo añadido")
      }
    } catch {
      toast.error("Error al añadir módulo")
    }
  }

  const deleteModulo = async (id: number) => {
     try {
       await fetch(`http://localhost:8081/api/cursos-materiales/modulos/${id}`, { method: "DELETE" })
       openContentManager(selectedCourseContent!)
       toast.success("Módulo eliminado")
     } catch { toast.error("Error al eliminar") }
  }

  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false)
  const [materialModuloId, setMaterialModuloId]         = useState<number | null>(null)
  const [editingMaterialId, setEditingMaterialId]       = useState<number | null>(null)
  const [selectedClaseId, setSelectedClaseId]           = useState<number | null>(null) 
  const [materialForm, setMaterialForm] = useState({
    titulo: "",
    tipoMaterial: "VIDEO",   // VIDEO | PDF | DOC | LINK
    urlMaterial: "",         // para LINK / YouTube
    file: null as File | null,
    videoMode: "file" as "file" | "link"
  })
  const [isUploadingMaterial, setIsUploadingMaterial] = useState(false)
  
  // Nuevo estado para manejar archivos dentro de una clase
  const [isArchivoDialogOpen, setIsArchivoDialogOpen] = useState(false)
  const [archivoForm, setArchivoForm] = useState({
    titulo: "",
    tipoArchivo: "PDF",     // PDF | DOC | LINK
    urlArchivo: "",         // para LINK
    file: null as File | null
  })
  const [isUploadingArchivo, setIsUploadingArchivo] = useState(false)
  const [currentArchivos, setCurrentArchivos] = useState<any[]>([])


  // Function to load files for a specific material
  const loadArchivosForMaterial = async (idMaterial: number) => {
    console.log("=== CARGANDO ARCHIVOS PARA MATERIAL ===");
    console.log("idMaterial:", idMaterial);
    
    try {
      const url = `http://localhost:8081/api/cursos-materiales/materiales/${idMaterial}/archivos`;
      console.log("URL:", url);
      
      const res = await fetch(url);
      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Response data:", data);
        
        if (data.success) {
          console.log("Archivos cargados:", data.archivos);
          return data.archivos || [];
        } else {
          console.log("Error en respuesta:", data.error);
        }
      } else {
        const errorText = await res.text();
        console.log("Error response text:", errorText);
      }
      
      return [];
    } catch (error) {
      console.error("=== ERROR AL CARGAR ARCHIVOS ===");
      console.error("Error:", error);
      return [];
    }
  }

  // Function to check file limits within a class
  const checkArchivoLimits = (claseId: number, tipoArchivo: string) => {
    // Buscar la clase en todos los módulos
    let claseEncontrada = null
    for (const modulo of contentModules) {
      if (modulo.materiales) {
        claseEncontrada = modulo.materiales.find((m: any) => m.idMaterial === claseId)
        if (claseEncontrada) break
      }
    }
    
    if (!claseEncontrada?.archivos) return { canAdd: true }
    
    const archivos = claseEncontrada.archivos
    const videoCount = archivos.filter((a: any) => a.tipoArchivo === 'VIDEO').length
    
    if (tipoArchivo === 'VIDEO' && videoCount >= 1) {
      return { 
        canAdd: false, 
        message: 'Esta clase ya tiene un video. Solo se permite 1 video por clase.' 
      }
    }
    
    return { canAdd: true }
  }

  // Funciones para manejar archivos dentro de una clase
  const openAddArchivo = async (idMaterial: number) => {
    setSelectedClaseId(idMaterial)
    setIsArchivoDialogOpen(true)
    
    // Load archivos for this material
    const archivos = await loadArchivosForMaterial(idMaterial)
    setCurrentArchivos(archivos)
    
    // Update the class structure with the loaded archivos
    setContentModules(prevModules => 
      prevModules.map((modulo: any) => ({
        ...modulo,
        materiales: (modulo.materiales || []).map((material: any) => 
          material.idMaterial === idMaterial 
            ? { ...material, archivos: archivos }
            : material
        )
      }))
    )
    
    // Reset form
    setArchivoForm({
      titulo: "",
      tipoArchivo: "PDF",
      urlArchivo: "",
      file: null
    })
  }

  const submitArchivo = async () => {
    if (!archivoForm.titulo.trim()) {
      toast.warning("El título es obligatorio")
      return
    }

    if (!selectedClaseId) {
      toast.error("No se ha seleccionado una clase")
      return
    }

    // Validar límites
    const limitCheck = checkArchivoLimits(selectedClaseId, archivoForm.tipoArchivo)
    if (!limitCheck.canAdd) {
      toast.error(limitCheck.message)
      return
    }

    setIsUploadingArchivo(true)
    try {
      const formData = new FormData()
      formData.append("titulo", archivoForm.titulo)
      formData.append("tipoArchivo", archivoForm.tipoArchivo)
      
      if (archivoForm.tipoArchivo === "LINK") {
        formData.append("urlArchivo", archivoForm.urlArchivo)
      } else if (archivoForm.file) {
        formData.append("file", archivoForm.file)
      }

      const url = `http://localhost:8081/api/cursos-materiales/materiales/${selectedClaseId}/archivos/upload`;
      console.log("=== SUBIENDO ARCHIVO ===");
      console.log("URL:", url);
      console.log("selectedClaseId:", selectedClaseId);
      console.log("archivoForm:", archivoForm);
      console.log("formData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }

      const res = await fetch(url, {
        method: "POST",
        body: formData
      });

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);

      if (res!.ok) {
        toast.success("Archivo añadido a la clase")
        setIsArchivoDialogOpen(false)
        openContentManager(selectedCourseContent!)
      } else {
        const err = await res!.json()
        console.log("=== ERROR EN RESPUESTA DEL SERVIDOR ===");
        console.log("Error response:", err);
        toast.error(err.error || "Error al guardar archivo")
      }
    } catch (error) {
      console.log("=== ERROR DE CONEXIÓN ===");
      console.log("Error:", error);
      toast.error("Error de conexión")
    } finally {
      setIsUploadingArchivo(false)
    }
  }

  const deleteArchivo = async (idArchivo: number) => {
    try {
      await fetch(`http://localhost:8081/api/cursos-materiales/archivos/${idArchivo}`, { method: "DELETE" })
      openContentManager(selectedCourseContent!)
      toast.success("Archivo eliminado")
    } catch { toast.error("Error al eliminar") }
  }

  // Abre el modal en modo CREAR
  const openAddMaterial = (idModulo: number) => {
    const modulo = contentModules.find(m => m.idModulo === idModulo)
    const materialesCount = modulo?.materiales?.length || 0
    
    setMaterialModuloId(idModulo)
    setEditingMaterialId(null)
    setMaterialForm({ titulo: "", tipoMaterial: "VIDEO", urlMaterial: "", file: null, videoMode: "file" })
    setIsMaterialDialogOpen(true)
  }

  // Abre el modal en modo EDITAR
  const openEditMaterial = (mat: any) => {
    setMaterialModuloId(mat.idModulo)
    setEditingMaterialId(mat.idMaterial)
    const isLink = mat.urlMaterial?.startsWith("http")
    setMaterialForm({
      titulo: mat.titulo ?? "",
      tipoMaterial: mat.tipoMaterial ?? "VIDEO",
      urlMaterial: mat.urlMaterial ?? "",
      file: null,
      videoMode: mat.tipoMaterial === "VIDEO" && isLink ? "link" : "file",
    })
    setIsMaterialDialogOpen(true)
  }

  // Envía el material (crear o editar)
  const submitMaterial = async () => {
    if (!materialForm.titulo.trim()) {
      toast.warning("El título es obligatorio")
      return
    }


    setIsUploadingMaterial(true)
    try {
      if (!editingMaterialId && !materialModuloId) {
        toast.error("Error: Módulo no identificado")
        setIsUploadingMaterial(false)
        return
      }

      let res: Response | null = null

      // ── MODO EDICIÓN: solo actualiza título / URL (sin reemplazar archivo) ──
      if (editingMaterialId) {
        res = await fetch(
          `http://localhost:8081/api/cursos-materiales/materiales/${editingMaterialId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              titulo:       materialForm.titulo,
              tipoMaterial: materialForm.tipoMaterial,
              urlMaterial:  materialForm.urlMaterial || undefined,
            }),
          }
        )
      }
      // ── MODO CREAR con archivo físico ────────────────────────────────────
      else if (materialForm.file) {
        const fd = new FormData()
        fd.append("file",         materialForm.file)
        fd.append("titulo",       materialForm.titulo)
        fd.append("tipoMaterial", materialForm.tipoMaterial)

        res = await fetch(
          `http://localhost:8081/api/cursos-materiales/modulos/${materialModuloId}/materiales/upload`,
          { method: "POST", body: fd }
        )
      }
      // ── MODO CREAR con URL externa ────────────────────────────────────────
      else {
        if (!materialForm.urlMaterial.trim()) {
          toast.warning("Ingresa una URL o sube un archivo")
          setIsUploadingMaterial(false)
          return
        }
        res = await fetch(
          `http://localhost:8081/api/cursos-materiales/modulos/${materialModuloId}/materiales`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              titulo:       materialForm.titulo,
              tipoMaterial: materialForm.tipoMaterial,
              urlMaterial:  materialForm.urlMaterial,
            }),
          }
        )
      }

      if (res && res.ok) {
        toast.success(editingMaterialId ? "Material actualizado" : "Material añadido")
        setIsMaterialDialogOpen(false)
        openContentManager(selectedCourseContent!)
      } else if (res) {
        const err = await res.json()
        toast.error(err.error || "Error al guardar")
      }
    } catch (error) {
      console.error("Error in submitMaterial:", error)
      toast.error("Error de conexión")
    } finally {
      setIsUploadingMaterial(false)
    }
  }

  const deleteMaterial = async (id: number) => {
    try {
      await fetch(`http://localhost:8081/api/cursos-materiales/materiales/${id}`, { method: "DELETE" })
      openContentManager(selectedCourseContent!)
      toast.success("Material eliminado")
    } catch { toast.error("Error al eliminar") }
  }

  const addForo = async () => {
    if (!newForo.titulo.trim() || !newForo.temaDiscusion.trim()) {
       toast.warning("Título y Tema son obligatorios")
       return
    }
    try {
      const url = isEditingForo 
        ? `http://localhost:8081/api/cursos-contenido/foros/${currentForoId}`
        : `http://localhost:8081/api/cursos-contenido/${selectedCourseContent?.idCurso}/foros`
      
      const res = await fetch(url, {
        method: isEditingForo ? "PUT" : "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify(newForo)
      })
      if (res.ok) {
        setNewForo({ titulo: "", temaDiscusion: "", descripcion: "" })
        setIsEditingForo(false)
        setCurrentForoId(null)
        openContentManager(selectedCourseContent!)
        toast.success(isEditingForo ? "Foro actualizado" : "Foro creado")
      }
    } catch { toast.error("Error en la operación") }
  }

  const startEditForo = (foro: any) => {
    setNewForo({
      titulo: foro.titulo,
      temaDiscusion: foro.temaDiscusion,
      descripcion: foro.descripcion
    })
    setIsEditingForo(true)
    setCurrentForoId(foro.idForo)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteForo = async (id: number) => {
    try {
      await fetch(`http://localhost:8081/api/cursos-contenido/foros/${id}`, { method: "DELETE" })
      openContentManager(selectedCourseContent!)
      toast.success("Foro desactivado")
    } catch { toast.error("Error al eliminar") }
  }

  const openAportes = async (foro: any) => {
    setActiveForoId(foro.idForo)
    setIsAportesOpen(true)
    fetchAportes(foro.idForo)
  }

  const fetchAportes = async (idForo: number) => {
    try {
      const res = await fetch(`http://localhost:8081/api/cursos-contenido/foros/${idForo}/aportes`)
      if (res.ok) {
         setAportes(await res.json())
      } else {
         setAportes([])
      }
    } catch {
      setAportes([])
    }
  }

  const handleAddAporte = async () => {
    if(!newAporte.trim() || !activeForoId) return
    try {
      // Usaremos idUsuario 1 por defecto al simular que somos el admin
      const res = await fetch(`http://localhost:8081/api/cursos-contenido/foros/${activeForoId}/aportes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: newAporte, usuario: { idUsuario: 1 } })
      })
      if(res.ok) {
        setNewAporte("")
        fetchAportes(activeForoId)
        toast.success("Aporte publicado")
      } else {
        toast.error("Error al publicar")
      }
    } catch {
      toast.error("Error de conexión")
    }
  }
  
  const handleDeleteAporte = async (idAporte: number) => {
     try {
        const res = await fetch(`http://localhost:8081/api/cursos-contenido/aportes/${idAporte}`, { method: "DELETE" })
        if(res.ok && activeForoId) {
           fetchAportes(activeForoId)
           toast.success("Aporte eliminado")
        }
     } catch {
        toast.error("Error al eliminar")
     }
  }

  if (viewMode === "content" && selectedCourseContent) {
    return (
      <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
        
        {/* HEADER DE GESTIÓN */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 px-4 py-2 rounded-2xl  text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full -ml-24 -mb-24 blur-2xl opacity-30" />
           
           <div className="relative z-10 flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-12 w-12 rounded-2xl bg-white/10 hover:bg-white/20 hover:text-white transition-all border border-white/10"
                onClick={() => { setViewMode("list"); setSelectedCourseContent(null); }}
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </Button>
              <div>
                <div className="flex items-center gap-1 mb-1">
                   <Badge className="bg-primary text-white border-0 font-bold uppercase tracking-widest text-[10px] px-3">Gestión de Contenido</Badge>
                   <span className="text-slate-400 text-xs font-bold ring-1 ring-slate-700 px-2 py-0.5 rounded-full">ID: {selectedCourseContent.idCurso}</span>
                </div>
                <h3 className="text-xl md:text-xl font-black tracking-tight">{selectedCourseContent.titulo}</h3>
              </div>
           </div>

           <div className="relative z-10 hidden lg:flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="h-11 w-11 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                 <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="pr-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-primary">Docente</p>
                 <p className="font-bold text-sm">{selectedCourseContent.docenteNombre}</p>
              </div>
           </div>
        </div>

        <Tabs value={contentTab} onValueChange={setContentTab} className="w-full">
           <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-card/50 p-1.5 rounded-2xl h-14 border border-border shadow-inner">
                <TabsTrigger value="curricula" className="px-8 font-black data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all">
                  Plan de Estudios
                </TabsTrigger>
                <TabsTrigger value="foros" className="px-8 font-black data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all">
                  Foros Académicos
                </TabsTrigger>
                 <TabsTrigger value="evaluaciones" className="px-8 font-black data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all">
                  Evaluaciones
                </TabsTrigger>
              </TabsList>
           </div>

           <TabsContent value="curricula" className="space-y-10 mt-0 animate-in slide-in-from-bottom-4 duration-500">
              
              <div className="grid lg:grid-cols-12 gap-10">
                {/* Lado Derecho: Acciones y Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                  <Card className="border-0 shadow-2xl rounded-[32px] overflow-hidden bg-slate-900 text-white p-8 relative">
                      <div className="absolute top-0 right-0 p-6 opacity-10">
                        <PlusCircle className="h-12 w-12" />
                      </div>
                      <h4 className="text-xl font-black mb-6 relative z-10 underline decoration-primary decoration-4 underline-offset-8">Nuevo Módulo</h4>
                      <div className="space-y-4 relative z-10">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Nombre del Módulo</p>
                        <Input 
                          placeholder="Ej: Fundamentos Avanzados" 
                          className="bg-white/10 border-white/10 text-white placeholder:text-slate-500 h-14 rounded-2xl focus:ring-primary"
                          value={newModuleName}
                          onChange={(e) => setNewModuleName(e.target.value)}
                        />
                        <Button className="w-full h-14 rounded-2xl font-black text-lg  group" onClick={addModule}>
                          Añadir Módulo
                          <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                  </Card>

                  <div className="bg-primary/5 rounded-[32px] p-8 border border-primary/10">
                      <h4 className="font-bold text-primary mb-4 flex items-center gap-2 uppercase tracking-tight text-sm">
                        <BookOpen className="h-4 w-4" /> Tips del Administrador
                      </h4>
                      <ul className="space-y-4">
                        <li className="flex gap-3 text-xs font-medium text-slate-600 leading-relaxed">
                            <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">1</div>
                            Organiza por orden lógico para mejorar la experiencia del estudiante.
                        </li>
                        <li className="flex gap-3 text-xs font-medium text-slate-600 leading-relaxed">
                            <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">2</div>
                            Combina videos y lecturas (PDF) para un aprendizaje interactivo.
                        </li>
                      </ul>
                  </div>
                </div>
                {/* Lado Izquierdo: Lista de Módulos (Scrollable) */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between mb-2 pl-2">
                      <h3 className="text-xl font-black text-foreground flex items-center gap-3">
                        <LayoutGrid className="h-5 w-5 text-primary" />
                        Módulos Estructurados
                      </h3>
                      <Badge variant="outline" className="font-bold">{contentModules.length} Módulos</Badge>
                  </div>

                  {isLoadingContent ? (
                    <div className="grid gap-6">
                        {[1,2].map(i => <div key={i} className="h-32 bg-card animate-pulse rounded-[32px] border" />)}
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {contentModules.map((modulo: any) => (
                          <Card key={modulo.idModulo} className="border-border/40 shadow-xl   overflow-hidden group  transition-all">
                            <div 
                                  className="bg-card px-4 pb-2 flex items-center justify-between border-b border-border/40 cursor-pointer"
                                  onClick={() => toggleModulo(modulo.idModulo)}
                                >
                                <div className="flex items-center gap-4">
                                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center cursor-grab active:cursor-grabbing text-muted-foreground group-hover:text-primary transition-colors">
                                      <GripVertical className="h-5 w-5" />
                                  </div>
                                  <h4 className="text-lg font-black text-foreground">{modulo.nombre}</h4>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm" className="rounded-xl border-primary/20 hover:bg-primary/5 text-primary h-10 px-4 font-bold gap-2" onClick={() => openAddMaterial(modulo.idModulo)}>
                                      <PlusCircle className="h-4 w-4" /> Clase
                                  </Button>
                                  {modulo.materiales && modulo.materiales.length > 0 && (
                                    <Badge variant="secondary" className="text-xs font-bold">
                                      {modulo.materiales.length} {modulo.materiales.length === 1 ? 'material' : 'materiales'}
                                    </Badge>
                                  )}
                                </div>

                                  <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-rose-500 hover:bg-rose-50 rounded-xl">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-2xl font-black">Eliminar Módulo</AlertDialogTitle>
                                            <AlertDialogDescription className="text-slate-500 font-medium">
                                              ¿Seguro que deseas eliminar <b>"{modulo.nombre}"</b>? Se borrarán todos los materiales contenidos en él.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="rounded-2xl font-bold">Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteModulo(modulo.idModulo)} className="rounded-2xl font-black bg-rose-500 hover:bg-rose-600">Eliminar Módulo</AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                  </AlertDialog>

                                </div>
                            </div>
                            {openModuloId === modulo.idModulo && (
                              <CardContent className="p-6 bg-muted/10">
                                {modulo.materiales?.length > 0 ? (
                                  <div className="grid gap-4">
                                    {modulo.materiales.map((clase: any) => (
                                      <div key={clase.idMaterial} className="bg-background rounded-2xl border border-border/40 overflow-hidden">
                                        {/* Header de la clase */}
                                        <div className="flex items-center justify-between p-4 bg-muted/30 border-b border-border/40">
                                          <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                                                clase.tipoMaterial === 'VIDEO' ? 'bg-blue-500/10 text-blue-600' : 
                                                clase.tipoMaterial === 'PDF' ? 'bg-red-500/10 text-red-600' :
                                                clase.tipoMaterial === 'DOC' ? 'bg-amber-500/10 text-amber-600' :
                                                'bg-purple-500/10 text-purple-600'
                                              }`}>
                                              {clase.tipoMaterial === 'VIDEO' ? <Video className="h-5 w-5" /> : 
                                               clase.tipoMaterial === 'PDF' ? <File className="h-5 w-5" /> :
                                               clase.tipoMaterial === 'DOC' ? <FileText className="h-5 w-5" /> :
                                               <LinkIcon className="h-5 w-5" />}
                                            </div>
                                            <div>
                                              <p className="font-bold text-sm text-foreground">{clase.titulo}</p>
                                              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                                                {clase.tipoMaterial} • {clase.archivos?.length || 0} archivos
                                              </p>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" className="rounded-xl border-primary/20 hover:bg-primary/5 text-primary h-8 px-3 font-bold gap-1 text-xs" onClick={() => openAddArchivo(clase.idMaterial)}>
                                              <PlusCircle className="h-3 w-3" /> Agregar Archivo
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-chart-3 hover:bg-chart-3/10 rounded-lg"
                                              onClick={() => openEditMaterial({ ...clase, idModulo: modulo.idModulo })}>
                                              <Pencil className="h-4 w-4" />
                                            </Button>
                                            
                                            <AlertDialog>
                                              <AlertDialogTrigger asChild>
                                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-300 hover:text-rose-600 rounded-lg">
                                                    <Trash2 className="h-4 w-4" />
                                                  </Button>
                                              </AlertDialogTrigger>
                                              <AlertDialogContent className="rounded-3xl">
                                                  <AlertDialogHeader>
                                                    <AlertDialogTitle className="font-black">Eliminar Clase</AlertDialogTitle>
                                                    <AlertDialogDescription>¿Deseas eliminar la clase <b>{clase.titulo}</b> y todos sus archivos?</AlertDialogDescription>
                                                  </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                                    <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteMaterial(clase.idMaterial)} className="rounded-xl bg-destructive font-bold">Eliminar</AlertDialogAction>
                                                  </AlertDialogFooter>
                                              </AlertDialogContent>
                                            </AlertDialog>
                                          </div>
                                        </div>
                                        
                                        {/* Archivos dentro de la clase */}
                                        <div className="p-4">
                                          {clase.archivos && clase.archivos.length > 0 ? (
                                            <div className="grid gap-2">
                                              {clase.archivos.map((archivo: any) => (
                                                <div key={archivo.idArchivo} className="flex items-center justify-between p-3 bg-muted/20 rounded-xl border border-border/30 group/archivo">
                                                  <div className="flex items-center gap-3">
                                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                                                      archivo.tipoArchivo === 'VIDEO' ? 'bg-blue-500/10 text-blue-600' : 
                                                      archivo.tipoArchivo === 'PDF' ? 'bg-red-500/10 text-red-600' :
                                                      archivo.tipoArchivo === 'DOC' ? 'bg-amber-500/10 text-amber-600' :
                                                      'bg-purple-500/10 text-purple-600'
                                                    }`}>
                                                      {archivo.tipoArchivo === 'VIDEO' ? <Video className="h-4 w-4" /> : 
                                                       archivo.tipoArchivo === 'PDF' ? <File className="h-4 w-4" /> :
                                                       archivo.tipoArchivo === 'DOC' ? <FileText className="h-4 w-4" /> :
                                                       <LinkIcon className="h-4 w-4" />}
                                                    </div>
                                                    <div>
                                                      <p className="font-medium text-xs text-foreground">{archivo.titulo}</p>
                                                      <p className="text-[9px] text-muted-foreground uppercase">{archivo.tipoArchivo}</p>
                                                    </div>
                                                  </div>
                                                  <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary rounded-lg" onClick={() => openMaterial(archivo.urlArchivo.startsWith('http') ? archivo.urlArchivo : `http://localhost:3000${archivo.urlArchivo}`)}>
                                                      <LinkIcon className="h-3 w-3" />
                                                    </Button>
                                                    <AlertDialog>
                                                      <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-rose-300 hover:text-rose-600 rounded-lg opacity-0 group-hover/archivo:opacity-100 transition-opacity">
                                                          <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                      </AlertDialogTrigger>
                                                      <AlertDialogContent className="rounded-3xl">
                                                        <AlertDialogHeader>
                                                          <AlertDialogTitle className="font-black">Eliminar Archivo</AlertDialogTitle>
                                                          <AlertDialogDescription>¿Deseas eliminar <b>{archivo.titulo}</b>?</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                          <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                                                          <AlertDialogAction onClick={() => deleteArchivo(archivo.idArchivo)} className="rounded-xl bg-destructive font-bold">Eliminar</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                      </AlertDialogContent>
                                                    </AlertDialog>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <div className="text-center py-4 border-2 border-dashed border-border/30 rounded-xl">
                                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Sin archivos en esta clase</p>
                                              <p className="text-[10px] text-muted-foreground mt-1">Agrega PDFs, documentos o enlaces</p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-6 border-2 border-dashed border-border/50 rounded-2xl bg-background/50">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Aún no hay materiales en este módulo</p>
                                  </div>
                                )}
                            </CardContent>
                            )}
                          </Card>
                      ))}

                      {contentModules.length === 0 && (
                        <div className="bg-card rounded-[40px] p-20 text-center border-2 border-dashed border-border shadow-inner">
                            <div className="h-24 w-24 bg-muted rounded-[32px] flex items-center justify-center mx-auto mb-6">
                              <PlusCircle className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h4 className="text-xl font-bold text-foreground mb-2">Comienza tu currícula</h4>
                            <p className="text-muted-foreground max-w-sm mx-auto">Añade tu primer módulo a la derecha para empezar a organizar el contenido del curso.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>

           </TabsContent>

           <TabsContent value="foros" className="space-y-8 mt-0 animate-in slide-in-from-right-4 duration-500">
              <div className="grid lg:grid-cols-12 gap-10">
                 
                 <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between pl-2">
                       <h3 className="text-xl font-black text-foreground flex items-center gap-3">
                          <MessageSquare className="h-5 w-5 text-primary" />
                          Hilos de Discusión
                       </h3>
                       <Badge className="bg-emerald-500">{contentForos.length} Activos</Badge>
                    </div>

                    <div className="grid gap-6">
                       {contentForos.map((foro: any) => (
                         <Card key={foro.idForo} className="border-border/40  rounded-[32px] p-8 bg-card  transition-all group border ">
                            <div className="flex justify-between items-start mb-4">
                               <div className="space-y-1">
                                  <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{foro.titulo}</h4>
                                  <div className="flex items-center gap-3">
                                     <Badge variant="outline" className="text-primary border-primary/30 text-[9px] uppercase font-black">{foro.temaDiscusion}</Badge>
                                     <span className="text-[10px] text-muted-foreground font-bold">{new Date(foro.fechaCreacion).toLocaleDateString(undefined, { day:'2-digit', month:'long' })}</span>
                                  </div>
                               </div>
                               <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary rounded-xl" onClick={() => startEditForo(foro)}>
                                     <Edit className="h-5 w-5" />
                                  </Button>
                                  
                                  <AlertDialog>
                                     <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-rose-500 rounded-xl">
                                           <Trash2 className="h-5 w-5" />
                                        </Button>
                                     </AlertDialogTrigger>
                                     <AlertDialogContent className="rounded-3xl shadow-2xl border-none">
                                        <AlertDialogHeader>
                                           <AlertDialogTitle className="text-xl font-black">Cerrar Discusión</AlertDialogTitle>
                                           <AlertDialogDescription className="font-medium">
                                              ¿Estás seguro de desactivar el foro <b>"{foro.titulo}"</b>? Ya no será visible para los estudiantes.
                                           </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                           <AlertDialogCancel className="rounded-2xl font-bold">Mantener abierto</AlertDialogCancel>
                                           <AlertDialogAction onClick={() => deleteForo(foro.idForo)} className="rounded-2xl font-black bg-rose-500 hover:bg-rose-600">Desactivar Foro</AlertDialogAction>
                                        </AlertDialogFooter>
                                     </AlertDialogContent>
                                  </AlertDialog>

                               </div>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{foro.descripcion}</p>
                            <div className="flex items-center justify-between pt-6 border-t border-border/40">
                               <div className="flex items-center gap-4">
                                 <div className="flex -space-x-2">
                                    {[1,2,3].map(i => <div key={i} className="h-7 w-7 rounded-full border-2 border-background bg-muted text-[8px] flex items-center justify-center font-bold">U</div>)}
                                 </div>
                                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estudiantes activos</span>
                               </div>
                               <Button variant="outline" size="sm" className="rounded-xl font-bold h-9 bg-card hover:bg-primary/10 hover:text-primary transition-colors text-xs" onClick={() => openAportes(foro)}>
                                  Ver Aportes
                               </Button>
                            </div>
                         </Card>
                       ))}

                       {contentForos.length === 0 && (
                          <div className="text-center py-20 opacity-50 italic">
                             <MessageSquare className="h-20 w-20 mx-auto mb-4" />
                             <p className="font-bold text-sm">Aún no hay discusiones iniciadas en este curso</p>
                          </div>
                       )}
                    </div>
                 </div>

                 <div className="lg:col-span-4">
                    <Card className="bg-card border-border/40  rounded-[40px] p-10 space-y-8 sticky top-24">
                       <div className="space-y-2">
                          <h3 className="text-2xl font-black text-foreground">
                            {isEditingForo ? "Editar Debate" : "Iniciar Debate"}
                          </h3>
                          <p className="text-muted-foreground text-sm font-medium">
                            {isEditingForo ? "Actualiza los detalles de esta discusión académica." : "Crea un espacio para resolver dudas y compartir ideas."}
                          </p>
                       </div>
                       
                       <div className="space-y-5">
                          {isEditingForo && (
                            <Button variant="outline" className="w-full rounded-xl border-dashed h-10 text-xs bg-card border" onClick={() => { setIsEditingForo(false); setNewForo({titulo:"", temaDiscusion:"", descripcion:""}); }}>
                              Cancelar Edición
                            </Button>
                          )}
                          <div className="space-y-2">
                             <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-2">Título de la Discusión</label>
                             <Input 
                               placeholder="Ej. Dudas sobre responsive design" 
                               className="h-14 rounded-2xl bg-muted/30 border-0 focus:ring-primary font-bold" 
                               value={newForo.titulo}
                               onChange={(e) => setNewForo({...newForo, titulo: e.target.value})}
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-2">Tema Clave</label>
                             <Input 
                               placeholder="Ej. Mobile First" 
                               className="h-14 rounded-2xl bg-muted/30 border-0 focus:ring-primary font-bold" 
                               value={newForo.temaDiscusion}
                               onChange={(e) => setNewForo({...newForo, temaDiscusion: e.target.value})}
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-2">Contexto Extra</label>
                             <Textarea 
                               placeholder="Escribe aquí los puntos principales a debatir..." 
                               className="rounded-2xl bg-muted/30 border-0 focus:ring-primary min-h-[120px] font-medium" 
                               value={newForo.descripcion}
                               onChange={(e) => setNewForo({...newForo, descripcion: e.target.value})}
                             />
                          </div>
                          <Button className={`w-full h-15 rounded-2xl font-black text-lg shadow-xl ${isEditingForo ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/10' : 'shadow-primary/10'}`} onClick={addForo}>
                             {isEditingForo ? "Actualizar Foro" : "Publicar Foro"}
                          </Button>
                       </div>
                    </Card>
                 </div>

              </div>
           </TabsContent>
           <TabsContent value="evaluaciones" className="space-y-8 mt-0 animate-in slide-in-from-right-4 duration-500">
              <div className="grid lg:grid-cols-12 gap-10">
              </div>
           </TabsContent>

        </Tabs>

        {/* Modal de Aportes */}
        <Dialog open={isAportesOpen} onOpenChange={setIsAportesOpen}>
          <DialogContent className="sm:max-w-xl bg-card rounded-[32px] p-6 shadow-2xl border border-border/40">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-foreground">Aportes del Foro</DialogTitle>
              <DialogDescription className="text-xs font-medium text-slate-500">Visualiza y gestiona las participaciones en este foro</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 my-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
               {aportes.length === 0 ? (
                 <div className="text-center py-10 opacity-50">
                    <MessageSquare className="h-10 w-10 mx-auto mb-2" />
                    <p className="text-sm font-bold">No hay aportes todavía</p>
                 </div>
               ) : (
                 aportes.map((aporte: any) => (
                   <div key={aporte.idAporte} className="flex gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 group/aporte">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                         {aporte.usuario?.nombre ? aporte.usuario.nombre.charAt(0) : "U"}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start">
                            <div>
                               <p className="font-bold text-sm text-foreground">{aporte.usuario?.nombre || "Usuario Desconocido"}</p>
                               <p className="text-[10px] font-semibold text-muted-foreground uppercase">{new Date(aporte.fechaAporte).toLocaleDateString()}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-rose-400 opacity-0 group-hover/aporte:opacity-100 transition-opacity rounded-md"
                              onClick={() => handleDeleteAporte(aporte.idAporte)}
                            >
                               <Trash2 className="h-3 w-3" />
                            </Button>
                         </div>
                         <p className="mt-2 text-sm text-foreground/80 leading-relaxed font-medium">
                            {aporte.mensaje}
                         </p>
                      </div>
                   </div>
                 ))
               )}
            </div>
            <div className="flex gap-3 pt-4 border-t border-border/50 mt-2">
               <Input 
                 placeholder="Escribe un aporte como administrador..."
                 className="flex-1 h-12 rounded-2xl bg-muted/40 font-medium"
                 value={newAporte}
                 onChange={(e) => setNewAporte(e.target.value)}
                 onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddAporte()
                 }}
               />
               <Button className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shrink-0" onClick={handleAddAporte}>
                  <PlusCircle className="h-5 w-5" />
               </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* ── Modal Añadir Material ───────────────────────────────────────────── */}
        <Dialog open={isMaterialDialogOpen} onOpenChange={(open) => { setIsMaterialDialogOpen(open); if (!open) setEditingMaterialId(null) }}>
          <DialogContent className="sm:max-w-3xl  p-0 border-none shadow-2xl bg-card overflow-hidden">
            <div className="bg-slate-900 px-6 py-4  text-white flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl opacity-50" />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                        <PlusCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <DialogTitle asChild>
                            <h2 className="text-xl font-black tracking-tight">
                                {!!editingMaterialId ? "Editar Recurso Académico" : "Nuevo Recurso Académico"}
                            </h2>
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-xs font-medium">
                            Configura el material de estudio para este módulo
                        </DialogDescription>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full" onClick={() => setIsMaterialDialogOpen(false)}>
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="p-8">
                <div className="grid md:grid-cols-2 gap-5">
                    {/* COLUMNA IZQUIERDA: CONFIGURACIÓN Y TIPO */}
                    <div className="space-y-4">
                        {/* Info de Límites */}
                        {!editingMaterialId && materialModuloId && (
                            <div className="bg-primary/5 rounded-3xl p-5 border border-primary/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform">
                                    <LayoutGrid className="h-12 w-12" />
                                </div>
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-primary mb-3">Estado del Módulo</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {(() => {
                                        const modulo = contentModules.find(m => m.idModulo === materialModuloId)
                                        if (!modulo?.materiales) return null
                                        const videoCount = modulo.materiales.filter((m: any) => m.tipoMaterial === 'VIDEO').length
                                        const otherCount = modulo.materiales.filter((m: any) => m.tipoMaterial !== 'VIDEO').length
                                        
                                        return (
                                            <>
                                                <div className={`p-3 rounded-2xl flex flex-col gap-1 ${videoCount > 0 ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-slate-100'}`}>
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Videos</span>
                                                    <span className={`text-sm font-black ${videoCount > 0 ? 'text-amber-600' : 'text-slate-700'}`}>{videoCount} / 1</span>
                                                </div>
                                                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-1">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Otros</span>
                                                    <span className="text-sm font-black text-emerald-600">{otherCount} / ∞</span>
                                                </div>
                                            </>
                                        )
                                    })()}
                                </div>
                                <p className="text-[9px] text-slate-500 mt-3 font-medium leading-tight">
                                    Recuerda: Solo se permite <b className="text-slate-900">1 video principal</b> por módulo. PDFs y enlaces son ilimitados.
                                </p>
                            </div>
                        )}

                        {/* Selección de Tipo */}
                        <div className="space-y-4">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                Tipo de Recurso
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { key: "VIDEO", icon: <Video className="h-5 w-5" />, label: "Video", color: "blue" },
                                    { key: "PDF", icon: <File className="h-5 w-5" />, label: "PDF", color: "red" },
                                    { key: "DOC", icon: <FileText className="h-5 w-5" />, label: "Documento", color: "amber" },
                                    { key: "LINK", icon: <LinkIcon className="h-5 w-5" />, label: "Enlace", color: "purple" },
                                ].map(({ key, icon, label, color }) => (
                                    <button
                                        key={key}
                                        type="button"
                                        disabled={!!editingMaterialId}
                                        onClick={() => setMaterialForm(p => ({ ...p, tipoMaterial: key, file: null, urlMaterial: "", videoMode: "file" }))}
                                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left group
                                            ${materialForm.tipoMaterial === key
                                                ? `border-primary bg-primary/5 ring-4 ring-primary/5`
                                                : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200 hover:bg-slate-50"}
                                            ${editingMaterialId ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors
                                            ${materialForm.tipoMaterial === key ? 'bg-primary text-white' : 'bg-white text-slate-400 group-hover:text-slate-600 shadow-sm'}`}>
                                            {icon}
                                        </div>
                                        <div>
                                            <p className={`text-xs font-black ${materialForm.tipoMaterial === key ? 'text-primary' : 'text-slate-600'}`}>{label}</p>
                                            <p className="text-[9px] font-medium opacity-60">Seleccionar</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: DATOS Y CONTENIDO */}
                    <div className="space-y-4">
                        {/* Título Input */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                Título del Recurso
                            </label>
                            <Input
                                placeholder="Ej: Fundamentos de Arquitectura"
                                className="h-14 rounded-2xl bg-slate-50 border-0 focus-visible:ring-primary/20 focus-visible:bg-white text-lg px-5 shadow-inner"
                                value={materialForm.titulo}
                                onChange={e => setMaterialForm(p => ({ ...p, titulo: e.target.value }))}
                            />
                        </div>

                        {/* Área de Carga / Input */}
                        <div className="space-y-4 pt-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                {materialForm.tipoMaterial === "LINK" ? "Enlace Externo" : "Contenido del Archivo"}
                            </label>

                            {/* Especial para VIDEO: Subida o Link */}
                            {materialForm.tipoMaterial === "VIDEO" && (
                                <div className="space-y-4">
                                    <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                                        <button
                                            type="button"
                                            onClick={() => setMaterialForm(p => ({ ...p, file: null, urlMaterial: "", videoMode: "file" }))}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                                ${(materialForm as any).videoMode !== "link" ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            <Video className="h-3 w-3" /> Subir MP4
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMaterialForm(p => ({ ...p, file: null, urlMaterial: "", videoMode: "link" }))}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                                ${(materialForm as any).videoMode === "link" ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            <LinkIcon className="h-3 w-3" /> YouTube/Link
                                        </button>
                                    </div>

                                    {materialForm.videoMode !== "link" && !!!editingMaterialId && (
                                        <div className="relative border-2 border-dashed border-slate-200 hover:border-primary/50 rounded-3xl p-8 text-center transition-all bg-slate-50/50 group">
                                            <input
                                                type="file"
                                                accept="video/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                onChange={e => {
                                                    const f = e.target.files?.[0] || null
                                                    setMaterialForm(p => ({ ...p, file: f, urlMaterial: f ? f.name : "" }))
                                                }}
                                            />
                                            {materialForm.file ? (
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                                        <Video className="h-8 w-8 text-primary" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="font-bold text-sm text-slate-900 truncate max-w-[240px]">{materialForm.file.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{(materialForm.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <div className="h-14 w-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                                        <Video className="h-6 w-6 text-slate-400 group-hover:text-primary" />
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-600">Arrastra tu video aquí</p>
                                                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">MP4, WEBM (Max 50MB)</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {(materialForm.videoMode === "link" || !!editingMaterialId) && (
                                        <div className="space-y-3">
                                            <Input
                                                placeholder="https://youtube.com/watch?v=..."
                                                className="h-14 rounded-2xl bg-slate-50 border-0 font-medium px-5 shadow-inner"
                                                value={materialForm.urlMaterial}
                                                onChange={e => setMaterialForm(p => ({ ...p, urlMaterial: e.target.value, file: null }))}
                                                disabled={!!editingMaterialId && materialForm.videoMode !== "link"}
                                            />
                                            {!!editingMaterialId && materialForm.videoMode !== "link" && (
                                                <div className="flex items-center gap-2 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                                                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Archivo de video protegido (Solo lectura)</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Otros Tipos: PDF, DOC, LINK */}
                            {materialForm.tipoMaterial !== "VIDEO" && (
                                <div className="space-y-4">
                                    {materialForm.tipoMaterial === "LINK" ? (
                                        <Input
                                            placeholder="https://ejemplo.com/recurso-extra"
                                            className="h-14 rounded-2xl bg-slate-50 border-0 font-medium px-5 shadow-inner"
                                            value={materialForm.urlMaterial}
                                            onChange={e => setMaterialForm(p => ({ ...p, urlMaterial: e.target.value, file: null }))}
                                        />
                                    ) : (
                                        <div className="space-y-4">
                                            <div className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all bg-slate-50/50 group
                                                ${editingMaterialId ? 'border-slate-100 opacity-60' : 'border-slate-200 hover:border-primary/50'}`}>
                                                {!editingMaterialId && (
                                                    <input
                                                        type="file"
                                                        accept={materialForm.tipoMaterial === "PDF" ? ".pdf" : ".doc,.docx,.ppt,.xls"}
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                        onChange={e => {
                                                            const f = e.target.files?.[0] || null
                                                            setMaterialForm(p => ({ ...p, file: f, urlMaterial: f ? f.name : "" }))
                                                        }}
                                                    />
                                                )}
                                                {materialForm.file || (editingMaterialId && materialForm.urlMaterial) ? (
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center
                                                            ${materialForm.tipoMaterial === 'PDF' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}`}>
                                                            <File className="h-8 w-8" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="font-bold text-sm text-slate-900 truncate max-w-[240px]">
                                                                {materialForm.file ? materialForm.file.name : materialForm.urlMaterial}
                                                            </p>
                                                            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase">
                                                                {materialForm.file ? `${(materialForm.file.size / 1024 / 1024).toFixed(2)} MB` : 'Archivo Guardado'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="h-16 w-16 rounded-3xl bg-white shadow-md border border-slate-100 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                                            <Paperclip className="h-7 w-7 text-slate-400 group-hover:text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-700">Subir {materialForm.tipoMaterial}</p>
                                                            <p className="text-[10px] text-slate-400 mt-1 font-medium tracking-wide">Haz clic o arrastra para cargar</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {editingMaterialId && (
                                                <div className="flex items-center gap-2 p-4 bg-slate-100 rounded-2xl border border-slate-200">
                                                    <div className="h-2 w-2 rounded-full bg-slate-400" />
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">El archivo no se puede cambiar en edición</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* FOOTER ACCIONES */}
                <div className="flex items-center gap-4 pt-8  border-slate-100">
                    <Button
                        variant="ghost"
                        className="h-14 px-8 rounded-2xl bg-card font-bold border text-slate-500 "
                        onClick={() => setIsMaterialDialogOpen(false)}
                        disabled={isUploadingMaterial}
                    >
                        Descartar
                    </Button>
                    <Button
                        className="flex-1 h-14 rounded-2xl font-black text-lg group relative overflow-hidden"
                        onClick={submitMaterial}
                        disabled={isUploadingMaterial}
                    >
                        {isUploadingMaterial ? (
                            <span className="flex items-center gap-3">
                                <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                {editingMaterialId ? "Procesando..." : "Subiendo recurso..."}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                {editingMaterialId ? "Guardar Cambios" : "Confirmar y Añadir"}
                                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </Button>
                </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Modal Agregar Archivo a Clase ─────────────────────────────────── */}
        <Dialog open={isArchivoDialogOpen} onOpenChange={(open) => { setIsArchivoDialogOpen(open); if (!open) setSelectedClaseId(null) }}>
          <DialogContent className="sm:max-w-lg rounded-[32px] p-8 border border-border/40 shadow-2xl bg-card">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">
                Agregar Archivo a la Clase
              </DialogTitle>
              <DialogDescription className="text-xs font-medium text-slate-500">
                Añade recursos complementarios a esta lección
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 mt-4">

              {/* Título */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  Título del archivo
                </label>
                <Input
                  placeholder="Ej. Guía de ejercicios"
                  className="h-12 rounded-2xl bg-muted/30 border-0"
                  value={archivoForm.titulo}
                  onChange={e => setArchivoForm(p => ({ ...p, titulo: e.target.value }))}
                />
              </div>

              {/* Tipo */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  Tipo de archivo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "PDF",   icon: <File  className="h-4 w-4" />,    label: "PDF"      },
                    { key: "DOC",   icon: <FileText className="h-4 w-4" />, label: "Doc"      },
                    { key: "LINK",  icon: <LinkIcon  className="h-4 w-4" />, label: "Link"   },
                  ].map(({ key, icon, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setArchivoForm(p => ({ ...p, tipoArchivo: key, file: null, urlArchivo: "" }))}
                      className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all text-xs font-bold
                        ${archivoForm.tipoArchivo === key
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted/20 text-muted-foreground hover:border-primary/40"}`}
                    >
                      {icon}
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contenido según tipo */}
              {archivoForm.tipoArchivo === "LINK" && (
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                    URL del enlace
                  </label>
                  <Input
                    placeholder="https://ejemplo.com/recurso"
                    className="h-12 rounded-2xl bg-muted/30 border-0 font-medium"
                    value={archivoForm.urlArchivo}
                    onChange={e => setArchivoForm(p => ({ ...p, urlArchivo: e.target.value, file: null }))}
                  />
                </div>
              )}

              {(archivoForm.tipoArchivo === "PDF" || archivoForm.tipoArchivo === "DOC") && (
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                    Subir archivo ({archivoForm.tipoArchivo})
                  </label>
                  <div className="relative border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-6 text-center transition-all group bg-muted/20">
                    <input
                      type="file"
                      accept={archivoForm.tipoArchivo === "PDF" ? ".pdf" : ".doc,.docx,.ppt,.pptx,.xls,.xlsx"}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={e => {
                        const f = e.target.files?.[0] || null
                        setArchivoForm(p => ({ ...p, file: f, urlArchivo: f ? f.name : "" }))
                      }}
                    />
                    {archivoForm.file ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <File className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm text-foreground truncate max-w-[220px]">
                            {archivoForm.file.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {(archivoForm.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); setArchivoForm(p => ({ ...p, file: null, urlArchivo: "" })) }}
                          className="ml-auto text-rose-400 hover:text-rose-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto group-hover:bg-primary/10 transition-colors">
                          <Paperclip className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <p className="text-sm font-bold text-foreground">Arrastra o haz clic para subir</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {archivoForm.tipoArchivo === "PDF" ? "Solo archivos PDF" : "DOC, DOCX, PPT, XLS"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-2xl border  bg-card"
                onClick={() => setIsArchivoDialogOpen(false)}
                disabled={isUploadingArchivo}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 h-12 rounded-2xl font-black shadow-lg"
                onClick={submitArchivo}
                disabled={isUploadingArchivo}
              >
                {isUploadingArchivo ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Subiendo...
                  </span>
                ) : "Agregar Archivo"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h4 className="text-2xl font-black flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary"/>
          Gestión de Cursos
        </h4>
        <p className="text-muted-foreground">
          Diseña, edita y publica cursos académicos
        </p>
      </div>
      
      {/* TOOLBAR SUPERIOR */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

          {/* IZQUIERDA: TABS */}
          <TabsList className="bg-card p-1 rounded-xl h-12 border-1 border-gray-200">
            <TabsTrigger value="listado" className="px-6 font-bold" onClick={resetForm}>
              Listado
            </TabsTrigger>
          </TabsList>

          {/* DERECHA: BUSCADOR + SELECT */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

            <div className="relative w-full sm:w-120 bg-card">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
              <Input
                placeholder="Buscar cursos..."
                className="pl-10 h-12 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="h-12 rounded-xl border px-4 bg-card"
              onChange={(e) => setCategoriaFilter(e.target.value)}
              value={categoriaFilter}
            >
              <option value="all">Todas las categorías</option>
              {categorias
                .filter(cat => cat.catEstado === "A" || cat.catEstado === true)
                .map(cat => (
                  <option key={cat.catId} value={cat.catNombre}>{cat.catNombre}</option>
                ))
              }
            </select>

          </div>

        </div>

        <TabsContent value="listado" className="p-0 border-none outline-none">

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 pb-10">
            {paginatedCourses.map((course: any) => (
              <Card
                key={course.idCurso}
                className="p-0 group rounded-3xl bg-card ring-1 ring-slate-100 h-full flex flex-col justify-between"
              >
                {/* Imagen */}
                <div className="relative h-30 overflow-hidden rounded-t-3xl bg-slate-100">
                  <img
                    src={getImageUrl(course.imgCurso)}
                    alt={course.titulo}
                    className="w-full h-full object-cover"
                  />

                  {/* Estado */}
                  <div className="absolute top-3 left-4">
                    <Badge
                      className={`rounded-full px-4 py-1 text-[10px] font-bold ${
                        course.estCurso === "A" || course.estCurso === true
                          ? "bg-emerald-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {course.estCurso === "A" || course.estCurso === true ? "ACTIVO" : "INACTIVO"}
                    </Badge>
                  </div>

                </div>

                {/* Header */}
                <CardHeader className="py-2 px-6 pb-0">
                  <div className="flex gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px]">ID: {course.idCurso}</Badge>
                    <Badge
                      style={{ backgroundColor: course.catColor }}
                      className="text-white text-[10px] border-0"
                    >
                      {course.catNombre || "S/C"}
                    </Badge>
                  </div>

                  <CardTitle className="text-lg font-bold line-clamp-2">
                    {course.titulo || "Sin título"}
                  </CardTitle>

                  <CardDescription className="line-clamp-2 text-sm min-h-[40px]">
                    {course.descripcion || "Sin descripción"}
                  </CardDescription>
                </CardHeader>


                {/* Footer */}
                <CardFooter className="px-6 pb-6 flex justify-between items-center bg-slate-50/50 rounded-b-3xl mt-2 pt-4">
                  <div>
                  </div>

                  <Button
                    size="icon"
                    className="bg-primary text-white rounded-2xl h-10 w-30 hover:scale-110 transition-transform "
                    onClick={() => openContentManager(course)}
                  >
                    <Plus className="h-5 w-5" /> Contenido
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination UI */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-6 border-t border-border/30 bg-card/50 rounded-b-3xl mb-10">
              <div className="text-sm text-muted-foreground font-medium">
                Mostrando{" "}
                <span className="font-bold text-foreground">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>
                {" "}–{" "}
                <span className="font-bold text-foreground">
                  {Math.min(currentPage * itemsPerPage, filteredCourses.length)}
                </span>
                {" "}de{" "}
                <span className="font-bold text-foreground">{filteredCourses.length}</span>
                {" "}cursos
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

        </TabsContent>
      </Tabs>
    </div>
  )
}