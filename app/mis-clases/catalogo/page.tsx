"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Search, 
  BookOpen, 
  Clock,
  Star,
  Users,
  ShoppingCart,
  ChevronRight,
  Filter,
  ArrowRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const availableCourses = [
  {
    id: "CAT-001",
    title: "Excel Avanzado para Finanzas",
    description: "Domina macros, tablas dinámicas y modelos financieros complejos.",
    category: "Finanzas",
    price: 120,
    duration: "40 horas",
    students: "+1,500",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1543286386-713bcd549118?q=80&w=400&h=250&auto=format&fit=crop",
  },
  {
    id: "CAT-002",
    title: "Full Stack Web Development",
    description: "Aprende React, Node.js, y bases de datos desde cero a profesional.",
    category: "Tecnología",
    price: 250,
    duration: "120 horas",
    students: "+3,200",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400&h=250&auto=format&fit=crop",
  },
  {
    id: "CAT-003",
    title: "Diseño UX/UI Premium",
    description: "Crea experiencias digitales centradas en el usuario con Figma.",
    category: "Diseño",
    price: 180,
    duration: "60 horas",
    students: "+800",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=400&h=250&auto=format&fit=crop",
  },
  {
    id: "CAT-004",
    title: "Ciberseguridad Empresarial",
    description: "Protege activos digitales y gestiona riesgos de seguridad.",
    category: "Seguridad",
    price: 200,
    duration: "45 horas",
    students: "+600",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&h=250&auto=format&fit=crop",
  },
]

export default function CatalogPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")

  const filteredCourses = availableCourses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleBuy = (courseId: string) => {
    // Redirigir a la página de pago con el ID del curso
    router.push(`/pago?courseId=${courseId}`)
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between items-start">
        <div className="space-y-1">
          <Badge className="bg-primary/10 text-primary border-0 font-bold px-3 mb-2">CATÁLOGO 2026</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Explorar Cursos</h1>
          <p className="text-muted-foreground font-medium">Invierte en tu futuro con nuestras certificaciones de alto impacto.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="¿Qué quieres aprender hoy?..." 
              className="pl-12 h-12 w-full bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-primary transition-all rounded-xl shadow-sm text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl flex-shrink-0">
            <Filter className="h-5 w-5 text-slate-500" />
          </Button>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 pb-20">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden border-0 shadow-sm hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300 group rounded-[32px] bg-white ring-1 ring-slate-100 flex flex-col">
            <div className="relative h-60 overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4">
                <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-slate-800">{course.rating}</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                 <Badge className="bg-white/20 backdrop-blur-md text-white border-0 font-bold text-[10px] mb-2">
                   {course.category.toUpperCase()}
                 </Badge>
              </div>
            </div>

            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black tracking-tight text-slate-900 group-hover:text-primary transition-colors">
                {course.title}
              </CardTitle>
              <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2 mt-2">
                {course.description}
              </p>
            </CardHeader>

            <CardContent className="px-8 flex-1">
              <div className="flex items-center gap-6 py-4 border-y border-slate-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                   <Users className="h-4 w-4 text-slate-400" />
                   <span className="text-xs font-bold text-slate-600">{course.students}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-8 pt-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Inversión</span>
                  <span className="text-2xl font-black text-slate-900 leading-none">S/ {course.price}</span>
                </div>
                <Button 
                  className="rounded-2xl h-14 px-8 font-black bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all gap-2 group/btn"
                  onClick={() => handleBuy(course.id)}
                >
                  Inscribirse
                  <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}

        {filteredCourses.length === 0 && (
          <div className="col-span-full py-20 text-center">
             <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-slate-300" />
             </div>
             <h3 className="text-xl font-bold text-slate-800">No se encontraron cursos</h3>
             <p className="text-slate-500 mt-1">Prueba con otras palabras clave o categorías.</p>
          </div>
        )}
      </div>
    </div>
  )
}
