"use client"

import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Database,
  Search,
  ChevronRight,
  LogOut,
  Mail,
  Lock,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { TotpSetup } from "@/components/TotpSetup"
import { useAuth } from "@/lib/auth-context"

export default function ConfiguracionPage() {
  const { user } = useAuth()


  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-0">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">

          <h4 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            Configuración
          </h4>
          <p className="text-muted-foreground font-medium">
            Personaliza el ingreso al Sistema .
          </p>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-1 lg:items-start">

        {/* ================= PERFIL ================= */}
        <div className="space-y-5">

          {/* ================= SEGURIDAD ================= */}

          <div className="flex items-center gap-4 text-emerald-600 bg-emerald-50 p-4 rounded-3xl border border-emerald-100">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Privacidad y Seguridad
              </h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Control de accesos y tokens
              </p>
            </div>
          </div>

          <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden p-8 space-y-8">

            {/* 🔥 2FA REAL (SIN CAMBIAR DISEÑO) */}
            <div className="space-y-4 border-b border-slate-50 pb-6">
              <div>
                <h4 className="text-base font-bold text-bg-card">
                  Autenticación de dos pasos
                </h4>
                <p className="text-sm text-slate-400 font-medium">
                  Añade una capa extra de seguridad con Google Authenticator.
                </p>
              </div>

              {user && (
                <TotpSetup
                  idUsuario={user.id}
                  totpActivo={user.totpActivo ?? false}
                />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}