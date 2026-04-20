"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, X, Check, Tag, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import "material-symbols/outlined.css";
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

interface Categoria {
  catId: number
  catNombre: string
  catDescripcion?: string
  catColor?: string
  catEstado: "A" | "I"
}



export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    catNombre: "",
    catDescripcion: "",
    catColor: "#3b82f6",
  })

  // Cargar categorías del backend
  useEffect(() => {
    fetchCategorias()
  }, [])

  const fetchCategorias = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8081/api/categorias", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      })

      if (!response.ok) {
        throw new Error("Error al obtener categorías")
      }

      const data = await response.json()
      setCategorias(data)
    } catch (error) {
      console.error(error)
      toast.error("Error al cargar categorías")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (categoria?: Categoria) => {
    if (categoria) {
      setEditingId(categoria.catId)
      setFormData({
        catNombre: categoria.catNombre,
        catDescripcion: categoria.catDescripcion || "",
        catColor: categoria.catColor?.startsWith("#") ? categoria.catColor : "#3b82f6",
      })
    } else {
      setEditingId(null)
      setFormData({
        catNombre: "",
        catDescripcion: "",
        catColor: "#3b82f6",
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
    setFormData({
      catNombre: "",
      catDescripcion: "",
      catColor: "#3b82f6",
    })
  }

  const handleSave = async () => {
    if (!formData.catNombre.trim()) {
      toast.error("El nombre de la categoría es requerido")
      return
    }

    try {
      setSaving(true)

      if (editingId) {
        // Actualizar
        const response = await fetch(`http://localhost:8081/api/categorias/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            catNombre: formData.catNombre,
            catDescripcion: formData.catDescripcion,
            catColor: formData.catColor,
            catEstado: categorias.find(c => c.catId === editingId)?.catEstado || "A",
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Error al actualizar categoría")
        }

        toast.success("Categoría actualizada exitosamente")
        fetchCategorias()
      } else {
        // Crear
        const response = await fetch("http://localhost:8081/api/categorias", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            catNombre: formData.catNombre,
            catDescripcion: formData.catDescripcion,
            catColor: formData.catColor,
            catEstado: "A",
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Error al crear categoría")
        }

        toast.success("Categoría creada exitosamente")
        fetchCategorias()
      }

      handleCloseModal()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Error al guardar categoría")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8081/api/categorias/${id}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
      })

      if (!response.ok) {
        throw new Error("Error al eliminar categoría")
      }

      toast.success("Categoría eliminada correctamente")
      fetchCategorias()
    } catch (error) {
      console.error(error)
      toast.error("Error al eliminar categoría")
    }
  }

  const toggleEstado = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8081/api/categorias/${id}/toggle-estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
      })

      if (!response.ok) {
        throw new Error("Error al cambiar estado")
      }

      toast.success("Estado actualizado")
      fetchCategorias()
    } catch (error) {
      console.error(error)
      toast.error("Error al cambiar estado")
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
             
            Gestión de Categorías
          </h1>
          <p className="text-muted-foreground font-medium">
            Administra las categorías disponibles para los cursos
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          disabled={loading}
          className="h-12 px-6 rounded-2xl bg-primary text-white font-bold gap-2 hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          Nueva Categoría
        </Button>
      </div>

      {/* Buscador y Controles Adicionales */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-2">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o descripción..."
            className="pl-12 h-12 rounded-2xl border-muted-foreground/20 bg-card focus-visible:ring-primary shadow-sm"
          />
        </div>
      </div>

      {/* Categorías Grid */}
      {loading ? (
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 text-muted-foreground/50 mb-4 animate-spin" />
            <p className="text-muted-foreground font-medium">Cargando categorías...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {categorias
              .filter((c) => 
                c.catNombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                (c.catDescripcion?.toLowerCase() || "").includes(searchQuery.toLowerCase())
              )
              .map((categoria) => (
              <div 
                key={categoria.catId} 
                className="group flex flex-col md:flex-row md:items-center justify-between gap-4 py-3 px-4 rounded-xl bg-card border hover:border-primary/20 hover:shadow-sm hover:bg-muted/30 transition-all duration-300"
              >
                {/* Info Izquierda */}
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: `${categoria.catColor?.startsWith("#") ? categoria.catColor : "#3b82f6"}15`,
                      color: categoria.catColor?.startsWith("#") ? categoria.catColor : "#3b82f6",
                      borderColor: `${categoria.catColor?.startsWith("#") ? categoria.catColor : "#3b82f6"}30`
                    }}
                  >
                    <Tag className="h-4 w-4" />
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground tracking-tight">{categoria.catNombre}</h3>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full px-2 py-0 text-[10px] uppercase font-bold border",
                          categoria.catEstado === "A" 
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                            : "bg-red-500/10 text-red-600 border-red-500/20"
                        )}
                      >
                        {categoria.catEstado === "A" ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    {categoria.catDescripcion && (
                      <p className="text-xs text-muted-foreground line-clamp-1 max-w-xl pr-4">
                        {categoria.catDescripcion}
                      </p>
                    )}
                  </div>
                </div>

                {/* Acciones Derecha */}
                <div className="flex items-center gap-1">
                   <Button
                    onClick={() => handleOpenModal(categoria)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                    title="Editar"
                  >
                    <Edit2 className="h-4 w-4 text-foreground/70" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-rose-500/10 hover:text-rose-700 text-muted-foreground"
                        title="Eliminar Categoría"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-black">¿Eliminar Categoría?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Estás a punto de borrar <b>"{categoria.catNombre}"</b>. Esto podría afectar a los cursos asociados.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(categoria.catId)} className="rounded-xl bg-rose-600 font-bold">Eliminar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-8 w-8 rounded-lg",
                          categoria.catEstado === "A" 
                            ? "hover:bg-orange-500/10 hover:text-orange-700 text-muted-foreground" 
                            : "hover:bg-emerald-500/10 hover:text-emerald-700 text-muted-foreground"
                        )}
                        title={categoria.catEstado === "A" ? "Desactivar" : "Activar"}
                      >
                        {categoria.catEstado === "A" ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-black">
                          {categoria.catEstado === "A" ? "Desactivar Categoría" : "Activar Categoría"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          ¿Seguro que deseas {categoria.catEstado === "A" ? "desactivar" : "activar"} la categoría <b>"{categoria.catNombre}"</b>?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl font-bold">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => toggleEstado(categoria.catId)} className="rounded-xl bg-primary font-black">Continuar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>

          {categorias.length > 0 && categorias.filter(c => c.catNombre.toLowerCase().includes(searchQuery.toLowerCase()) || (c.catDescripcion?.toLowerCase() || "").includes(searchQuery.toLowerCase())).length === 0 && (
            <Card className="border-0 shadow-sm rounded-2xl bg-card">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground font-medium">No se encontraron resultados</p>
                <p className="text-sm text-muted-foreground mb-4">
                  No hay categorías que coincidan con tu búsqueda actual "{searchQuery}"
                </p>
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                  className="rounded-lg gap-2"
                >
                  <X className="h-4 w-4" />
                  Limpiar Búsqueda
                </Button>
              </CardContent>
            </Card>
          )}

          {categorias.length === 0 && !loading && (
            <Card className="border-0 shadow-sm rounded-2xl bg-card">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Tag className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground font-medium">No hay categorías creadas</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Crea la primera categoría para organizar tus cursos
                </p>
                <Button
                  onClick={() => handleOpenModal()}
                  className="rounded-lg gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Crear Categoría
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Dialog open={showModal} onOpenChange={(open) => { if(!open) handleCloseModal() }}>
        <DialogContent className="sm:max-w-md rounded-2xl p-0 gap-0 border-0 shadow-xl overflow-hidden focus:outline-none">
          <DialogHeader className="flex flex-row items-center justify-between border-b p-6 bg-gradient-to-r from-primary to-blue-600 py-4 px-8 text-white relative overflow-hidden">
            <DialogTitle className="text-xl">
              {editingId ? "Editar Categoría" : "Nueva Categoría"}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-5">
            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase text-muted-foreground tracking-wider">
                Nombre
              </label>
              <Input
                value={formData.catNombre}
                onChange={(e) =>
                  setFormData({ ...formData, catNombre: e.target.value })
                }
                placeholder="Ej: Programación"
                className="rounded-lg h-11"
                disabled={saving}
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase text-muted-foreground tracking-wider">
                Descripción
              </label>
              <Textarea
                value={formData.catDescripcion}
                onChange={(e) =>
                  setFormData({ ...formData, catDescripcion: e.target.value })
                }
                placeholder="Describe la categoría..."
                className="rounded-lg min-h-[100px] resize-none"
                disabled={saving}
              />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase text-muted-foreground tracking-wider">
                Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={formData.catColor?.startsWith("#") ? formData.catColor : "#3b82f6"}
                  onChange={(e) =>
                    setFormData({ ...formData, catColor: e.target.value })
                  }
                  disabled={saving}
                  className="w-16 h-12 p-1 cursor-pointer rounded-xl bg-background border ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                  title="Elegir color"
                />
                <span className="text-sm text-muted-foreground flex-1">
                  Haz clic para elegir un color personalizado. Este color representará gráfica y visualmente a la categoría.
                </span>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4 border-t mt-6">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-xl h-11 bg-primary gap-2 font-bold"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingId ? "Actualizar" : "Crear"}
              </Button>
              <Button
                onClick={handleCloseModal}
                variant="outline"
                className="flex-1 rounded-xl h-11 font-bold"
                disabled={saving}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
