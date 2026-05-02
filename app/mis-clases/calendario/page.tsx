"use client"

import { useState } from "react"
import { 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  BookOpen,
  GraduationCap,
  Bell,
  CheckCircle2,
  Circle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock data for classes/events
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Matemáticas Avanzadas",
    type: "clase",
    start: "08:00",
    end: "10:00",
    room: "Aula 204",
    instructor: "Dr. Ricardo Pérez",
    color: "bg-blue-500",
    day: 15,
  },
  {
    id: 2,
    title: "Examen de Física II",
    type: "examen",
    start: "11:00",
    end: "13:00",
    room: "Laboratorio B",
    instructor: "Ing. Maria Luz",
    color: "bg-rose-500",
    day: 15,
  },
  {
    id: 3,
    title: "Programación Web",
    type: "clase",
    start: "15:00",
    end: "17:00",
    room: "Centro de Cómputo",
    instructor: "Lic. Carlos Ruiz",
    color: "bg-emerald-500",
    day: 16,
  },
  {
    id: 4,
    title: "Entrega de Proyecto Final",
    type: "tarea",
    start: "23:59",
    end: "23:59",
    room: "Plataforma Virtual",
    instructor: "Todo el equipo",
    color: "bg-purple-500",
    day: 20,
  },
  {
    id: 5,
    title: "Tutoría de Cálculo",
    type: "tutoria",
    start: "10:00",
    end: "11:00",
    room: "Sala Zoom 1",
    instructor: "Lic. Ana Gómez",
    color: "bg-amber-500",
    day: 18,
  }
]

const DAYS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 10)) // Abril 2026
  const [selectedDay, setSelectedDay] = useState(15)

  const monthName = MONTHS[currentDate.getMonth()]
  const year = currentDate.getFullYear()

  // Get days in month (mocked for simplicity of current view)
  const daysInMonth = 30
  const firstDayOfMonth = 2 // Miércoles
  
  const generateDays = () => {
    const days = []
    // Add empty slots for the beginning of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, current: false })
    }
    // Add real days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, current: true })
    }
    return days
  }

  const calendarDays = generateDays()
  const eventsForSelectedDay = MOCK_EVENTS.filter(e => e.day === selectedDay)

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Module */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <CalendarIcon className="h-8 w-8 text-primary" />
            Agenda Académica
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Gestiona tus horarios y actividades próximas</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="rounded-xl font-bold bg-white border-slate-200">
             Hoy
           </Button>
           <div className="flex bg-white rounded-xl border border-slate-200 p-1">
             <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
               <ChevronLeft className="h-4 w-4" />
             </Button>
             <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
               <ChevronRight className="h-4 w-4" />
             </Button>
           </div>
           <Button className="rounded-xl font-bold gap-2">
             <Bell className="h-4 w-4" />
             Notificarme
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Calendar Grid Container */}
        <Card className="xl:col-span-8 border-none shadow-2xl shadow-slate-200/50 bg-white/70 backdrop-blur-xl overflow-hidden rounded-[2.5rem]">
          <CardHeader className="bg-white/50 border-b border-slate-100 p-8">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
                     {monthName} <span className="text-primary">{year}</span>
                   </h2>
                   <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
                     <span className="flex items-center gap-1.5"><Circle className="h-3 w-3 fill-blue-500 text-blue-500" /> Clases</span>
                     <span className="flex items-center gap-1.5"><Circle className="h-3 w-3 fill-rose-500 text-rose-500" /> Exámenes</span>
                     <span className="flex items-center gap-1.5"><Circle className="h-3 w-3 fill-purple-500 text-purple-500" /> Tareas</span>
                   </div>
                </div>
                <div className="hidden sm:flex gap-1.5 p-1 bg-slate-100 rounded-2xl">
                   <Button variant="ghost" className="h-10 px-6 rounded-xl font-bold bg-white shadow-sm text-primary">Mes</Button>
                   <Button variant="ghost" className="h-10 px-6 rounded-xl font-bold text-slate-500">Semana</Button>
                   <Button variant="ghost" className="h-10 px-6 rounded-xl font-bold text-slate-500">Día</Button>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-0">
             <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
               {DAYS.map(day => (
                 <div key={day} className="py-4 text-center text-xs font-black uppercase tracking-widest text-slate-400">
                   {day}
                 </div>
               ))}
             </div>
             <div className="grid grid-cols-7 grid-rows-5 h-[600px]">
               {calendarDays.map((date, idx) => {
                 const hasEvent = MOCK_EVENTS.some(e => e.day === date.day)
                 const isSelected = selectedDay === date.day
                 
                 return (
                   <div 
                    key={idx} 
                    onClick={() => date.day && setSelectedDay(date.day)}
                    className={cn(
                      "relative border-r border-b border-slate-100 p-4 transition-all duration-300 cursor-pointer group hover:bg-slate-50/80",
                      !date.current && "bg-slate-50/30",
                      isSelected && "bg-primary/5 ring-1 ring-inset ring-primary/20"
                    )}
                   >
                     {date.day && (
                       <>
                         <span className={cn(
                           "absolute top-4 left-4 h-8 w-8 rounded-full flex items-center justify-center font-black text-sm transition-all",
                           isSelected ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30" : "text-slate-600 group-hover:text-primary group-hover:bg-primary/10",
                           date.day === 10 && !isSelected ? "bg-slate-900 text-white" : ""
                         )}>
                           {date.day}
                         </span>
                         
                         <div className="mt-8 space-y-1.5">
                            {MOCK_EVENTS.filter(e => e.day === date.day).slice(0, 2).map(event => (
                              <div 
                                key={event.id}
                                className={cn(
                                  "text-[10px] font-bold px-2 py-1 rounded-lg truncate text-white shadow-sm",
                                  event.color
                                )}
                              >
                                {event.title}
                              </div>
                            ))}
                            {MOCK_EVENTS.filter(e => e.day === date.day).length > 2 && (
                               <div className="text-[10px] font-black text-slate-400 pl-2">
                                 + {MOCK_EVENTS.filter(e => e.day === date.day).length - 2} más
                               </div>
                            )}
                         </div>
                       </>
                     )}
                   </div>
                 )
               })}
             </div>
          </CardContent>
        </Card>

        {/* Sidebar: Details for selected day */}
        <div className="xl:col-span-4 space-y-8">
           <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden rounded-[2rem]">
              <CardHeader className="border-b border-white/10 p-6">
                 <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                          <Clock className="h-5 w-5 text-primary" />
                       </div>
                       <span className="text-xl font-black">Actividades Hoy</span>
                    </div>
                    <Badge variant="outline" className="border-white/20 text-white font-black rounded-lg">
                       {selectedDay} de Abril
                    </Badge>
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 {eventsForSelectedDay.length > 0 ? (
                    eventsForSelectedDay.map(event => (
                      <div key={event.id} className="group relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:rounded-full before:opacity-50">
                        <div className="flex items-start justify-between mb-2">
                           <div>
                              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{event.start} - {event.end}</p>
                              <h3 className="text-lg font-bold leading-tight">{event.title}</h3>
                           </div>
                           <Badge className={cn("rounded-lg capitalize", event.color)}>
                              {event.type}
                           </Badge>
                        </div>
                        <div className="flex flex-col gap-2 text-sm text-slate-300 font-medium">
                           <div className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 text-primary" />
                              {event.room}
                           </div>
                           <div className="flex items-center gap-2">

                           </div>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full mt-4 bg-white/5 hover:bg-white/10 text-xs font-bold rounded-xl border-white/5 border transition-all h-9">
                           Ver Material de Clase
                        </Button>
                      </div>
                    ))
                 ) : (
                    <div className="text-center py-12 space-y-4">
                       <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                       </div>
                       <div>
                          <p className="font-bold text-lg">Día libre</p>
                          <p className="text-sm text-slate-400">No tienes actividades programadas para este día.</p>
                       </div>
                    </div>
                 )}
              </CardContent>
           </Card>

           <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="p-6 pb-2">
                 <CardTitle className="text-xl font-black text-slate-900 flex items-center justify-between">
                    Notas Rápidas
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                       <MoreVertical className="h-4 w-4" />
                    </Button>
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                 <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-2">
                    <p className="text-xs font-black text-amber-600 uppercase tracking-wider">Recordatorio</p>
                    <p className="text-sm font-bold text-amber-900 leading-snug">Estudiar para el examen de Física del día 15.</p>
                 </div>
                 <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-2">
                    <p className="text-xs font-black text-blue-600 uppercase tracking-wider">Pendiente</p>
                    <p className="text-sm font-bold text-blue-900 leading-snug">Subir el informe de laboratorio antes del viernes.</p>
                 </div>
                 <Button className="w-full h-12 rounded-2xl font-black bg-slate-900 hover:bg-slate-800 text-white shadow-lg">
                    Nueva Nota
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
