"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Circle,
  FileText,
  Download,
  MessageSquare,
  Clock,
  ChevronRight,
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

const courseModules = [
  {
    id: "module-1",
    title: "Módulo 1: Introducción al Marketing Digital",
    lessons: [
      { id: 1, title: "Bienvenida al curso", duration: "5 min", completed: true },
      { id: 2, title: "¿Qué es el Marketing Digital?", duration: "12 min", completed: true },
      { id: 3, title: "Tendencias actuales", duration: "15 min", completed: true },
      { id: 4, title: "Quiz: Conceptos básicos", duration: "10 min", completed: true },
    ],
  },
  {
    id: "module-2",
    title: "Módulo 2: Estrategia de Contenidos",
    lessons: [
      { id: 5, title: "Planificación de contenidos", duration: "18 min", completed: true },
      { id: 6, title: "Tipos de contenido", duration: "14 min", completed: true },
      { id: 7, title: "Calendario editorial", duration: "20 min", completed: false, current: true },
      { id: 8, title: "Herramientas de gestión", duration: "16 min", completed: false },
    ],
  },
  {
    id: "module-3",
    title: "Módulo 3: Redes Sociales",
    lessons: [
      { id: 9, title: "Ecosistema de redes sociales", duration: "12 min", completed: false },
      { id: 10, title: "Facebook & Instagram Ads", duration: "25 min", completed: false },
      { id: 11, title: "LinkedIn para empresas", duration: "18 min", completed: false },
      { id: 12, title: "TikTok Marketing", duration: "15 min", completed: false },
    ],
  },
  {
    id: "module-4",
    title: "Módulo 4: Analítica y Métricas",
    lessons: [
      { id: 13, title: "Google Analytics 4", duration: "22 min", completed: false },
      { id: 14, title: "KPIs principales", duration: "16 min", completed: false },
      { id: 15, title: "Reportes y dashboards", duration: "20 min", completed: false },
      { id: 16, title: "Proyecto final", duration: "30 min", completed: false },
    ],
  },
]

const materials = [
  { id: 1, name: "Guía de Marketing Digital 2024.pdf", size: "2.4 MB" },
  { id: 2, name: "Plantilla Calendario Editorial.xlsx", size: "156 KB" },
  { id: 3, name: "Checklist Estrategia de Contenidos.pdf", size: "320 KB" },
]

const forumPosts = [
  {
    id: 1,
    author: "María García",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    message: "¿Alguien me puede explicar mejor la diferencia entre alcance orgánico y pagado?",
    time: "hace 2 horas",
    replies: 3,
  },
  {
    id: 2,
    author: "Carlos López",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    message: "Excelente clase! La parte de planificación me ayudó mucho con mi proyecto.",
    time: "hace 5 horas",
    replies: 1,
  },
]

export default function ClasePage() {
  const [currentLesson, setCurrentLesson] = useState(7)
  const totalLessons = courseModules.reduce((acc, m) => acc + m.lessons.length, 0)
  const completedLessons = courseModules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0
  )
  const progress = Math.round((completedLessons / totalLessons) * 100)

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/mis-clases">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-sm font-semibold text-foreground line-clamp-1">
                Diplomado en Marketing Digital
              </h1>
              <p className="text-xs text-muted-foreground">
                Módulo 2: Estrategia de Contenidos
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{progress}% completado</p>
              <p className="text-xs text-muted-foreground">
                {completedLessons} de {totalLessons} lecciones
              </p>
            </div>
            <Progress value={progress} className="w-32 h-2" />
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 lg:max-w-[calc(100%-380px)]">
          {/* Video Player */}
          <div className="relative aspect-video bg-foreground">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Button
                  size="lg"
                  className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90"
                >
                  <Play className="h-8 w-8 ml-1" />
                </Button>
                <p className="text-primary-foreground mt-4 text-lg font-medium">
                  Calendario editorial
                </p>
                <p className="text-primary-foreground/70 text-sm flex items-center justify-center gap-1 mt-1">
                  <Clock className="h-4 w-4" />
                  20 minutos
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Content */}
          <div className="p-4 lg:p-6">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start h-auto p-1 bg-muted/50">
                <TabsTrigger value="description" className="flex-1 sm:flex-none">
                  Descripción
                </TabsTrigger>
                <TabsTrigger value="materials" className="flex-1 sm:flex-none">
                  Materiales PDF
                </TabsTrigger>
                <TabsTrigger value="forum" className="flex-1 sm:flex-none">
                  Foro
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Calendario editorial</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      En esta lección aprenderás a crear y gestionar un calendario editorial
                      efectivo para tu estrategia de contenidos. Cubriremos las mejores
                      prácticas para planificar, organizar y programar tu contenido de manera
                      consistente.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Lo que aprenderás:</h4>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Estructura de un calendario editorial profesional</li>
                        <li>Frecuencia de publicación por plataforma</li>
                        <li>Herramientas de automatización</li>
                        <li>Métricas de seguimiento</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="materials" className="mt-4">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Materiales de descarga</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {materials.map((material) => (
                        <div
                          key={material.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {material.name}
                              </p>
                              <p className="text-xs text-muted-foreground">{material.size}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="forum" className="mt-4">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Discusión de la clase</CardTitle>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Nueva pregunta
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {forumPosts.map((post) => (
                        <div
                          key={post.id}
                          className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={post.avatar} />
                              <AvatarFallback>
                                {post.author.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-foreground">
                                  {post.author}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {post.time}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{post.message}</p>
                              <Button variant="link" className="h-auto p-0 mt-2 text-primary">
                                {post.replies} respuestas
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar - Course Content */}
        <aside className="lg:w-[380px] border-t lg:border-t-0 lg:border-l border-border bg-background">
          <div className="sticky top-16">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Contenido del curso</h2>
              <p className="text-sm text-muted-foreground">
                {completedLessons} de {totalLessons} completadas
              </p>
            </div>

            <ScrollArea className="h-[calc(100vh-180px)]">
              <Accordion
                type="multiple"
                defaultValue={["module-2"]}
                className="px-2 py-2"
              >
                {courseModules.map((module) => (
                  <AccordionItem
                    key={module.id}
                    value={module.id}
                    className="border-0 mb-1"
                  >
                    <AccordionTrigger className="hover:no-underline px-3 py-3 rounded-lg hover:bg-muted/50 data-[state=open]:bg-muted/50">
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-foreground">
                          {module.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {module.lessons.filter((l) => l.completed).length} /{" "}
                          {module.lessons.length} completadas
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                      <div className="space-y-1 pl-2">
                        {module.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => setCurrentLesson(lesson.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                              lesson.current
                                ? "bg-primary/10 border border-primary/20"
                                : "hover:bg-muted/50"
                            }`}
                          >
                            {lesson.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                            ) : lesson.current ? (
                              <Play className="h-5 w-5 text-primary shrink-0" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm truncate ${
                                  lesson.current
                                    ? "font-medium text-primary"
                                    : lesson.completed
                                    ? "text-muted-foreground"
                                    : "text-foreground"
                                }`}
                              >
                                {lesson.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {lesson.duration}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </div>
        </aside>
      </div>
    </div>
  )
}
