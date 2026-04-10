"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Por favor, completa todos los campos requeridos.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Correo electrónico o contraseña incorrectos.")
      }

      const userData = {
        id: data.idUsuario ?? "",
        email: data.email || email,
        nombre: data.nombre || "Usuario",
        rol: data.nombreRol || "Sin rol",
        avatar: data.avatar || undefined,
      }

      sessionStorage.setItem("user", JSON.stringify(userData))

      if (data.token) {
        localStorage.setItem("token", data.token)
      }

      setUser(userData)


      setTimeout(() => {
        const rol = (data.nombreRol || "").toLowerCase()

        if (rol === "admin" || rol === "administrador") {
          window.location.href = "/admin"
        } else if (rol === "docente") {
          window.location.href = "/docente"
        } else if (rol === "estudiante") {
          window.location.href = "/mis-clases/"
        } else {
          window.location.href = "/"
        }
      }, 1000)
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servidor.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert
          variant={error.includes("exitoso") ? "default" : "destructive"}
          className={
            error.includes("exitoso")
              ? "border-emerald-500 text-emerald-600 bg-emerald-50"
              : ""
          }
        >
          {!error.includes("exitoso") && <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          Correo electrónico
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error) setError(null)
            }}
            className="pl-10 h-12 bg-secondary/50 border-border focus:border-primary focus:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-foreground">
          Contraseña
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (error) setError(null)
            }}
            className="pl-10 pr-10 h-12 bg-secondary/50 border-border focus:border-primary focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-muted-foreground">Recordarme</span>
        </label>
        <a
          href="#"
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-primary text-primary-foreground font-semibold text-base transition-all duration-200"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Ingresando...
          </span>
        ) : (
          "Ingresar"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{" "}
        <a
          href="#"
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Contacta con administración
        </a>
      </p>
    </form>
  )
}
