"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Users, BookOpen, ChevronDown } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function MatriculasPage() {

  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [openCursoId, setOpenCursoId] = useState<number | null>(null)

  useEffect(() => {
    fetchMatriculas()
  }, [])

  const fetchMatriculas = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/matriculas")
      const json = await res.json()
      setData(json)
    } catch {
      toast.error("Error al cargar matrículas")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCurso = (id: number) => {
    setOpenCursoId(prev => (prev === id ? null : id))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          Matrículas
        </h1>
        <p className="text-muted-foreground text-sm font-medium mt-1">
          Visualiza los cursos con sus estudiantes inscritos.
        </p>
      </div>

      {/* LISTADO */}
      <div className="grid gap-6">

        {isLoading ? (
          <div className="h-32 bg-card animate-pulse rounded-3xl border" />
        ) : data.length === 0 ? (
          <div className="text-center py-20 opacity-40 font-bold">
            No hay matrículas registradas
          </div>
        ) : (
          data.map((curso: any) => (
            <Card key={curso.idCurso} className="rounded-[32px] shadow-xl border overflow-hidden">

              {/* HEADER CURSO */}
              <div 
                className="flex items-center justify-between px-6 py-4 border-b cursor-pointer hover:bg-muted/30"
                onClick={() => toggleCurso(curso.idCurso)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">{curso.titulo}</h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      {curso.estudiantes?.length || 0} estudiantes
                    </p>
                  </div>
                </div>

                <ChevronDown className={`transition-transform ${openCursoId === curso.idCurso ? "rotate-180" : ""}`} />
              </div>

              {/* CONTENIDO */}
              {openCursoId === curso.idCurso && (
                <CardContent className="p-6 bg-muted/10">
                  
                  {curso.estudiantes?.length > 0 ? (
                    <div className="grid gap-3">

                      {curso.estudiantes.map((est: any) => (
                        <div 
                          key={est.idUsuario}
                          className="flex items-center justify-between p-4 bg-background rounded-2xl border"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                              <Users className="h-5 w-5" />
                            </div>

                            <div>
                              <p className="font-bold text-sm">{est.nombre}</p>
                              <p className="text-[10px] text-muted-foreground uppercase">
                                Estudiante
                              </p>
                            </div>
                          </div>

                          <Badge variant="outline" className="font-bold">
                            Activo
                          </Badge>
                        </div>
                      ))}

                    </div>
                  ) : (
                    <div className="text-center py-6 text-xs text-muted-foreground font-bold">
                      Este curso aún no tiene estudiantes
                    </div>
                  )}

                </CardContent>
              )}

            </Card>
          ))
        )}

      </div>
    </div>
  )
}