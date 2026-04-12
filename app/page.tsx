"use client"

import { useTheme } from "next-themes"
import React from "react"
import Image from "next/image"
import { LoginForm } from "@/components/login-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { GraduationCap, BookOpen, Users } from "lucide-react"

export default function LoginPage() {
  const { resolvedTheme } = useTheme()

  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/images/professionals-training.jpg"
          alt="Profesionales capacitándose en Brusben"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/20 shadow-inner" />
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {/* Columna 1: Logo */}
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>

            {/* Columna 2: Título + subtítulo */}
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight">Brusben</span>
              <p className="text-primary-foreground/80 text-sm">Aula Virtual</p>
            </div>
          </div>
        </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight text-white drop-shadow-sm mb-6">
                Capacitación profesional <br />
                <span className="text-white">para el éxito de tu equipo</span>
              </h2>
              <p className="mt-4 text-md text-primary-foreground/80 leading-relaxed max-w-md">
                Accede a cursos especializados, certificaciones y recursos diseñados para potenciar tus habilidades profesionales.
              </p>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">+50</p>
                  <p className="text-xs text-primary-foreground/70">Cursos</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">+1,200</p>
                  <p className="text-xs text-primary-foreground/70">Alumnos</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-primary-foreground/60">
            © 2026 Brusben. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-sidebar">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground">Brusben</span>
              <p className="text-xs text-muted-foreground">Aula Virtual</p>
            </div>
          </div>

          <div className="absolute top-4 right-4 lg:top-8 lg:right-8">
            <ThemeToggle />
          </div>

          <div className="text-center lg:text-left">
            <Image
              src={
                resolvedTheme === "dark"
                  ? "/images/logo_brusben_dark.png"
                  : "/images/logo_brusben_light.png"
              }
              alt="Logo Brusben"
              width={200}
              height={200}
              className="mx-auto lg:mx-0"
              priority
            />
            <h2 className="text-3xl font-bold text-foreground mt-4">
              Iniciar Sesión
            </h2>
            <p className="mt-2 text-muted-foreground">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />

        </div>
      </div>
    </div>
  )
}
