"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { 
  Plus, Search, MoreVertical, BookOpen, LayoutGrid,
  Edit, Trash
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

interface Curso {
  idCurso?: number
  titulo: string
  imgCurso: string
  descripcion: string
  precio: number
  estCurso: boolean
  idDocente: number
  docenteNombre: string
  catNombre: string
  catColor: string
  precioCurso: number
}

export default function CoursesPage() {

  const [courses, setCourses] = useState<Curso[]>([])
  const [search, setSearch] = useState("")
  const [categoria, setCategoria] = useState("all")

  const [formData, setFormData] = useState<Curso>({
    titulo: "",
    descripcion: "",
    precio: 0,
    estCurso: true,
    idDocente: 0,
    docenteNombre: "",
    catNombre: "",
    imgCurso: "",
    catColor: "",
    precioCurso: 0,
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/cursos")
      const data = await res.json()
      setCourses(data)
    } catch {
      toast.error("Error al cargar cursos")
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:8081/api/cursos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          precio: Number(formData.precio)
        })
      })

      if (res.ok) {
        toast.success("Curso registrado 🔥")
        fetchCourses()
      }
    } catch {
      toast.error("Error al guardar")
    }
  }

  const openEditDialog = (course: Curso) => {
    setFormData(course)
  }

  const toggleStatus = (course: Curso) => {
    console.log(course)
  }

  const filteredCourses = courses.filter(c =>
    c.titulo.toLowerCase().includes(search.toLowerCase()) &&
    (categoria === "all" || c.catNombre === categoria)
  )

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary"/>
          Gestión de Cursos
        </h1>
        <p className="text-muted-foreground">
          Diseña, edita y publica cursos académicos
        </p>
      </div>
      {/* TOOLBAR SUPERIOR */}
      <Tabs defaultValue="listado" className="space-y-4">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          {/* IZQUIERDA: TABS */}
          <TabsList className="bg-slate-100 p-1 rounded-xl h-12">
            <TabsTrigger value="listado" className="px-6 font-bold">
              Listado
            </TabsTrigger>
            <TabsTrigger value="nuevo" className="px-6 font-bold">
              Nuevo Curso
            </TabsTrigger>
          </TabsList>

          {/* DERECHA: BUSCADOR + SELECT */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
              <Input
                placeholder="Buscar cursos..."
                className="pl-10 h-12 rounded-xl"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="h-12 rounded-xl border px-4 bg-white"
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              <option value="Programación">Programación</option>
              <option value="Diseño">Diseño</option>
              <option value="Marketing">Marketing</option>
            </select>

          </div>

        </div>

        <TabsContent value="listado">

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 pb-20">
            {filteredCourses.map((course) => (
              <Card
                key={course.idCurso}
                className="p-0 border-0 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group rounded-3xl bg-card ring-1 ring-slate-100"
              >
                {/* Imagen */}
                <div className="relative h-35 overflow-hidden rounded-t-3xl">
                  <img
                    src={
                      course.imgCurso
                        ? `/cursos${course.imgCurso}`
                        : "/images/course-finance.jpg"
                    }
                    alt={course.titulo}
                    className="w-full h-full object-cover"
                  />

                  {/* Estado */}
                  <div className="absolute top-3 left-4">
                    <Badge
                      className={`rounded-full px-4 py-1 text-[10px] font-bold ${
                        course.estCurso
                          ? "bg-emerald-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {course.estCurso ? "ACTIVO" : "INACTIVO"}
                    </Badge>
                  </div>

                  <div className="absolute top-3 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="h-8 w-8 p-0 rounded-xl bg-background/10 transition-all"
                        >
                          <MoreVertical className="h-4 w-4 text-white" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end"
                        className="bg-background/90 backdrop-blur-md border border-border/50 shadow-xl rounded-2xl p-2 min-w-[160px]"
                      >
                        <DropdownMenuItem 
                          onClick={() => openEditDialog(course)}
                          className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition"
                        >
                          <Edit className="h-4 w-4" />
                          Editar
                        </DropdownMenuItem>

                        <DropdownMenuItem 
                          onClick={() => toggleStatus(course)}
                          className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition"
                        >
                          <Trash className="h-4 w-4" />
                          {course.estCurso ? "Desactivar" : "Reactivar"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Header */}
                <CardHeader className="py-0 px-6 pb-2">
                  <div className="flex gap-2 mb-2">
                    <Badge>ID: {course.idCurso}</Badge>
                    <Badge
                      style={{ backgroundColor: course.catColor }}
                      className="text-white"
                    >
                      CAT: {course.catNombre}
                    </Badge>
                  </div>

                  <CardTitle className="text-lg font-bold">
                    {course.titulo}
                  </CardTitle>

                  <CardDescription className="line-clamp-3">
                    {course.descripcion}
                  </CardDescription>
                </CardHeader>

                {/* Contenido */}
                <CardContent className="px-6 py-0">
                  <p className="text-sm text-slate-500">
                    <span className="font-bold">Docente: </span>{course.docenteNombre}
                  </p>
                </CardContent>

                {/* Footer */}
                <CardFooter className="px-6 pb-4 flex justify-between items-center">
                  <div className="text-xl font-bold text-green-600">
                    <span>S/ {Number(course.precioCurso).toFixed(2)}</span>
                  </div>

                  <Button
                    size="sm"
                    className="bg-slate-900 text-white rounded-xl"
                  >
                    GESTIONAR 
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

        </TabsContent>

        <TabsContent value="nuevo">

          <Card className="p-6 rounded-3xl">
            <CardHeader>
              <CardTitle>Nuevo Curso</CardTitle>
              <CardDescription>Registrar información</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

                <Input name="titulo" placeholder="Título" onChange={handleChange}/>
                <Input name="descripcion" placeholder="Descripción" onChange={handleChange}/>
                <Input name="precio" type="number" step="0.01" placeholder="Precio" onChange={handleChange}/>
                <Input type="file" name="imgCurso" placeholder="Imagen URL" onChange={handleChange}/>
                <Input name="idDocente" type="number" placeholder="ID Docente" onChange={handleChange}/>
                <Input name="docenteNombre" placeholder="Nombre Docente" onChange={handleChange}/>
                <Input name="catNombre" placeholder="Categoría" onChange={handleChange}/>

                <div className="col-span-2 flex justify-end">
                  <Button type="submit" className="px-10">
                    Guardar Curso
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>

        </TabsContent>

      </Tabs>
    </div>
  )
}