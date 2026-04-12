"use client"

import { useState } from "react"
import { 
  Search, HelpCircle, PlayCircle, FileText, PhoneCall, 
  MessageSquare, Mail, ChevronRight, ExternalLink,
  BookOpen, CreditCard, User, ShieldCheck, Zap,
  GraduationCap, Calendar, Download
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export default function StudentAyudaPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    {
      title: "Guía del Estudiante",
      description: "Aprende a navegar por tus cursos y materiales de estudio.",
      icon: GraduationCap,
      color: "bg-emerald-500",
      link: "#guides"
    },
    {
      title: "Pagos y Cuotas",
      description: "Información sobre métodos de pago y estados de cuenta.",
      icon: CreditCard,
      color: "bg-blue-500",
      link: "#payments"
    },
    {
      title: "Certificaciones",
      description: "Cómo solicitar y descargar tus certificados de finalización.",
      icon: ShieldCheck,
      color: "bg-amber-500",
      link: "#certificates"
    },
    {
      title: "Asistencia Técnica",
      description: "¿Problemas con la plataforma? Estamos para ayudarte.",
      icon: MessageSquare,
      color: "bg-rose-500",
      link: "#support"
    }
  ]

  const faqs = [
    {
      question: "¿Cómo ingreso a mis clases grabadas?",
      answer: "Para ver tus clases, ve al módulo 'Cursos' en el menú lateral, selecciona el curso activo y haz clic en el botón 'Ver Contenido'. Allí encontrarás todas las sesiones ordenadas por fecha."
    },
    {
      question: "¿Dónde descargo mis recibos de pago?",
      answer: "Dentro de 'Mis Pagos', encontrarás el historial de todas tus transacciones. Junto a cada pago aprobado hay un botón de 'Descargar Recibo' en formato PDF."
    },
    {
      question: "¿Qué pasa si falto a una clase en vivo?",
      answer: "No te preocupes. Todas las sesiones en vivo se graban y se suben a la plataforma en un plazo máximo de 24 horas después de finalizada la clase."
    },
    {
      question: "¿Cómo puedo actualizar mi foto de perfil?",
      answer: "Haz clic en tu nombre en la barra superior o ve directamente al módulo 'Perfil'. Allí encontrarás la opción 'Actualizar Avatar' para subir una nueva imagen."
    }
  ]

  return (
    <div className="space-y-10 pb-20">
      {/* HERO SECTION - STUDENT THEME */}
      <div className="relative overflow-hidden rounded-[40px] bg-slate-900 p-12 text-white shadow-2xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl opacity-50" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm shadow-sm">
            Centro de Ayuda Estudiantil
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            ¿En qué podemos <span className="text-primary italic">apoyarte</span> hoy?
          </h1>
          <p className="text-lg text-slate-400 font-medium">
            Encuentra guías rápidas y soporte directo para que tu experiencia de aprendizaje sea impecable.
          </p>
        </div>
      </div>

      {/* CATEGORIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        {categories.map((cat, idx) => (
          <Card key={idx} className="group cursor-pointer border-none shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-[32px] overflow-hidden bg-card ring-1 ring-slate-100">
            <CardHeader className="pb-4">
              <div className={`${cat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-inherit transition-transform group-hover:scale-110`}>
                <cat.icon className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl font-bold">{cat.title}</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {cat.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="p-0 h-auto font-bold text-primary group-hover:gap-3 transition-all">
                Ver Guía <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* FAQs SECTION */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <HelpCircle className="h-6 w-6 text-emerald-500" />
              Dudas de Estudiantes
            </h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem 
                key={idx} 
                value={`item-${idx}`} 
                className="border-none bg-white rounded-3xl px-6 shadow-sm ring-1 ring-slate-100 data-[state=open]:ring-emerald-500/20 transition-all"
              >
                <AccordionTrigger className="hover:no-underline py-5 font-bold text-left text-slate-700 data-[state=open]:text-emerald-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-slate-500 leading-relaxed font-medium">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* DOWNLOAD CENTER */}
          <div className="bg-emerald-50/50 rounded-[32px] p-8 border border-dashed border-emerald-200">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <Download className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-1 text-center md:text-left">
                <h4 className="font-bold text-lg text-emerald-900">Centro de Descargas</h4>
                <p className="text-sm text-emerald-700/70">Encuentra sílabos, formatos de tareas y recursos adicionales para tus clases.</p>
              </div>
              <Button className="md:ml-auto rounded-xl font-bold px-6 bg-emerald-600 hover:bg-emerald-700">Explorar Archivos</Button>
            </div>
          </div>
        </div>

        {/* SIDEBAR HELP */}
        <div className="space-y-8">
          {/* UPCOMING EVENTS */}
          <Card className="rounded-[32px] border-none shadow-sm ring-1 ring-slate-100 overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 pb-4 border-b">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-500" />
                Datos de Interés
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {[
                { title: "Calendario de feriados del ciclo", icon: Calendar },
                { title: "Reglamento del estudiante 2024", icon: FileText },
                { title: "Manual de uso de Zoom/Meet", icon: PlayCircle },
                { title: "Nuestras sedes y horarios", icon: BookOpen },
              ].map((article, i) => (
                <div key={i} className="group flex items-center gap-4 cursor-pointer">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-all">
                    <article.icon className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors flex-1">
                    {article.title}
                  </span>
                  <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* WHATSAPP SUPPORT */}
          <Card className="rounded-[32px] border-none bg-emerald-900 text-white shadow-2xl overflow-hidden relative">
             <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-400/20 rounded-full -mr-16 -mt-16 blur-2xl" />
             <CardHeader className="relative">
               <CardTitle className="text-xl font-black">Soporte WhatsApp</CardTitle>
               <CardDescription className="text-emerald-300/60 font-medium">Asistencia rápida para consultas urgentes.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4 relative">
               <Button className="w-full justify-start gap-4 h-14 rounded-2xl bg-white/10 hover:bg-white/20 border-none text-white font-bold transition-all" asChild>
                 <a href="#">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg">
                        <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    Chat con un Asesor
                 </a>
               </Button>
               <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Conectado en vivo</span>
               </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
