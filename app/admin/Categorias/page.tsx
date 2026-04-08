"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, X, Check, Tag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

interface Categoria {
  catId: number
  catNombre: string
  catDescripcion?: string
  catColor?: string
  catEstado: "A" | "I"
}

const COLORES = [
  { name: "Rojo", value: "bg-red-500/10 text-red-600 border-red-200" },
  { name: "Azul", value: "bg-blue-500/10 text-blue-600 border-blue-200" },
  { name: "Verde", value: "bg-emerald-500/10 text-emerald-600 border-emerald-200" },
  { name: "Morado", value: "bg-purple-500/10 text-purple-600 border-purple-200" },
  { name: "Naranja", value: "bg-orange-500/10 text-orange-600 border-orange-200" },
  { name: "Rosa", value: "bg-pink-500/10 text-pink-600 border-pink-200" },
]

export default function CategoriasPage() {
  const { token } = useAuth()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    catNombre: "",
    catDescripcion: "",
    catColor: COLORES[0].value,
  })

  // Cargar categorías del backend
  useEffect(() => {
    fetchCategorias()
  }, [])

  const fetchCategorias = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8080/api/categorias", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
        catColor: categoria.catColor || COLORES[0].value,
      })
    } else {
      setEditingId(null)
      setFormData({
        catNombre: "",
        catDescripcion: "",
        catColor: COLORES[0].value,
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
      catColor: COLORES[0].value,
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
        const response = await fetch(`http://localhost:8080/api/categorias/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
        const response = await fetch("http://localhost:8080/api/categorias", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
    if (!confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/categorias/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
      const response = await fetch(`http://localhost:8080/api/categorias/${id}/toggle-estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
            <Tag className="h-8 w-8 text-primary" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorias.map((categoria) => (
              <Card key={categoria.catId} className="border-0 shadow-sm rounded-2xl hover:shadow-lg transition-all overflow-hidden">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Encabezado */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h3 className="text-lg font-bold text-foreground">{categoria.catNombre}</h3>
                        <Badge
                          variant={categoria.catEstado === "A" ? "default" : "secondary"}
                          className="rounded-full"
                        >
                          {categoria.catEstado === "A" ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <div
                        className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center border",
                          categoria.catColor || COLORES[0].value
                        )}
                      >
                        <Tag className="h-6 w-6" />
                      </div>
                    </div>

                    {/* Descripción */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {categoria.catDescripcion || "Sin descripción"}
                    </p>

                    {/* Acciones */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => handleOpenModal(categoria)}
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-lg gap-2"
                      >
                        <Edit2 className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        onClick={() => toggleEstado(categoria.catId)}
                        variant={categoria.catEstado === "A" ? "default" : "secondary"}
                        size="sm"
                        className="flex-1 rounded-lg gap-2"
                      >
                        <Check className="h-4 w-4" />
                        {categoria.catEstado === "A" ? "Desactivar" : "Activar"}
                      </Button>
                      <Button
                        onClick={() => handleDelete(categoria.catId)}
                        variant="destructive"
                        size="sm"
                        className="rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {categorias.length === 0 && (
            <Card className="border-0 shadow-sm rounded-2xl">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between border-b p-6">
              <CardTitle>
                {editingId ? "Editar Categoría" : "Nueva Categoría"}
              </CardTitle>
              <button
                onClick={handleCloseModal}
                disabled={saving}
                className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Nombre */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase text-muted-foreground">
                  Nombre
                </label>
                <Input
                  value={formData.catNombre}
                  onChange={(e) =>
                    setFormData({ ...formData, catNombre: e.target.value })
                  }
                  placeholder="Ej: Programación"
                  className="rounded-lg h-10"
                  disabled={saving}
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase text-muted-foreground">
                  Descripción
                </label>
                <Textarea
                  value={formData.catDescripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, catDescripcion: e.target.value })
                  }
                  placeholder="Describe la categoría..."
                  className="rounded-lg min-h-24 resize-none"
                  disabled={saving}
                />
              </div>

              {/* Color */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase text-muted-foreground">
                  Color
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {COLORES.map((color) => (
                    <button
                      key={color.value}
                      onClick={() =>
                        setFormData({ ...formData, catColor: color.value })
                      }
                      disabled={saving}
                      className={cn(
                        "h-10 rounded-lg border-2 transition-all disabled:opacity-50",
                        formData.catColor === color.value
                          ? "border-primary scale-105"
                          : "border-transparent opacity-60 hover:opacity-100",
                        color.value
                      )}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 rounded-lg bg-primary gap-2"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? "Actualizar" : "Crear"}
                </Button>
                <Button
                  onClick={handleCloseModal}
                  variant="outline"
                  className="flex-1 rounded-lg"
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
