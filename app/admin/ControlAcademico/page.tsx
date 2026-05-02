"use client"

import {
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  Search,
  Filter,
  Download,
  MoreVertical,
  Activity,
  Award,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const academicStats = [
  { label: "ASISTENCIA MEDIA", value: "92%", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "PUNTUACIÓN PROMEDIO", value: "16.8", icon: Award, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "CURSOS ACTIVOS", value: "32", icon: BookOpen, color: "text-rose-600", bg: "bg-rose-50" },
  { label: "GRADUADOS MES", value: "54", icon: GraduationCap, color: "text-primary", bg: "bg-primary/5" },
]

const coursePerformance = [
  { name: "Marketing Digital", students: 120, completion: 85, avgGrade: 17.2 },
  { name: "Excel Avanzado", students: 85, completion: 92, avgGrade: 18.5 },
  { name: "Gestión de Proyectos", students: 45, completion: 74, avgGrade: 15.4 },
  { name: "UX/UI Design", students: 62, completion: 88, avgGrade: 16.9 },
]

export default function ControlAcademicoPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Control Académico
          </h1>
          <p className="text-slate-500 font-medium">Monitorea el progreso de los estudiantes y el rendimiento de los cursos.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="h-12 rounded-2xl font-bold border-slate-200 px-6 gap-2">
             <Download className="h-5 w-5 text-slate-400" />
             Reporte Académico
           </Button>
        </div>
      </div>

       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {academicStats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm rounded-3xl overflow-hidden p-6 relative group hover:shadow-md transition-all">
             <div className="flex flex-col gap-4">
                <div className={`${stat.bg} ${stat.color} h-12 w-12 rounded-2xl flex items-center justify-center ring-1 ring-${stat.color.split('-')[1]}/10`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase leading-none">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
                </div>
             </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
         <Card className="border-0 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
               <CardTitle className="text-xl font-bold">Rendimiento por Curso</CardTitle>
               <CardDescription>Progreso de finalización y promedios por categoría.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
               <div className="space-y-8">
                  {coursePerformance.map((course) => (
                    <div key={course.name} className="space-y-3 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                       <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-0.5">
                             <span className="text-sm font-black text-slate-800">{course.name}</span>
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{course.students} Estudiantes</span>
                          </div>
                          <div className="text-right">
                             <span className="text-sm font-black text-primary">{course.avgGrade}</span>
                             <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest leading-none">NOTA PROMEDIO</span>
                          </div>
                       </div>
                       <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                             <span>Progreso de Finalización</span>
                             <span>{course.completion}%</span>
                          </div>
                          <Progress value={course.completion} className="h-2 bg-slate-100" />
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <Card className="border-0 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
               <div>
                  <CardTitle className="text-xl font-bold">Estudiantes en Riesgo</CardTitle>
                  <CardDescription>Estudiantes con inactividad mayor a 15 días.</CardDescription>
               </div>
               <Badge className="bg-rose-50 text-rose-600 border-0 rounded-full h-8 px-4 font-black text-[10px] uppercase">
                  ATENCIÓN REQUERIDA
               </Badge>
            </CardHeader>
            <CardContent className="p-0">
               <Table>
                 <TableBody>
                   {[
                     { name: "Lucía Fernández", course: "Marketing Digital", days: 18, color: "rose" },
                     { name: "Roberto Gomez", course: "Gestión de Proyectos", days: 16, color: "orange" },
                     { name: "Sonia Ruiz", course: "Python Masterclass", days: 15, color: "rose" },
                   ].map((st) => (
                     <TableRow key={st.name} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 group transition-colors">
                        <TableCell className="px-8 py-5">
                           <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-white group-hover:text-primary transition-all">
                                {st.name[0]}
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-sm font-black text-slate-800">{st.name}</span>
                                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{st.course}</span>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell className="px-8 py-5 text-right flex flex-col justify-center items-end h-full">
                           <span className={`text-sm font-black text-${st.color}-600`}>{st.days} Días</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DE INACTIVIDAD</span>
                        </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
               <div className="p-8 bg-slate-50/20 border-t border-slate-50 flex justify-center">
                  <Button variant="ghost" className="text-slate-400 hover:text-primary font-bold text-sm">Ver todos los Alumnos</Button>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  )
}
