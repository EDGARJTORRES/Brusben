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

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function ConfiguracionPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Configuración
          </h1>
          <p className="text-slate-500 font-medium">Personaliza el entorno y controla la seguridad de la academia.</p>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
         {/* General Section */}
         <div className="space-y-8">
            <div className="flex items-center gap-4 text-primary bg-primary/5 p-4 rounded-3xl border border-primary/10">
               <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white">
                  <User className="h-6 w-6" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-900">Perfil del Administrador</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Información de cuenta principal</p>
               </div>
            </div>

            <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden p-8">
               <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                     <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Nombre Completo</Label>
                     <Input defaultValue="Admin Brusben" className="h-14 rounded-2xl border-slate-100 font-medium group" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Correo Electrónico</Label>
                     <Input defaultValue="admin@brusben.edu" type="email" className="h-14 rounded-2xl border-slate-100 font-medium" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Contraseña Actual</Label>
                     <div className="relative group">
                       <Input type="password" value="********" className="h-14 rounded-2xl border-slate-100 font-medium pr-12" />
                       <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary" />
                     </div>
                  </div>
                  <Button className="w-full h-14 rounded-2xl bg-slate-900 font-bold hover:bg-slate-800 transition-all">
                     Guardar Cambios
                  </Button>
               </div>
            </Card>

            <div className="flex items-center gap-4 text-emerald-600 bg-emerald-50 p-4 rounded-3xl border border-emerald-100">
               <div className="h-12 w-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
                  <Shield className="h-6 w-6" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-900">Privacidad y Seguridad</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Control de accesos y tokens</p>
               </div>
            </div>

            <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden p-8 space-y-8">
               <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                  <div className="space-y-1">
                     <h4 className="text-base font-bold text-slate-900">Autenticación de dos pasos</h4>
                     <p className="text-sm text-slate-400 font-medium">Añade una capa extra de seguridad.</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-emerald-500" />
               </div>
               <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                  <div className="space-y-1">
                     <h4 className="text-base font-bold text-slate-900">Registro de Actividad</h4>
                     <p className="text-sm text-slate-400 font-medium">Guardar historial de logins y acciones.</p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
               </div>
            </Card>
         </div>

         {/* Appearance & Platform Section */}
         <div className="space-y-8">
            <div className="flex items-center gap-4 text-orange-600 bg-orange-50 p-4 rounded-3xl border border-orange-100">
               <div className="h-12 w-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white">
                  <Palette className="h-6 w-6" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-900">Personalización de Plataforma</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Colores y logotipos institucionales</p>
               </div>
            </div>

            <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden p-8 space-y-8">
               <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Color Primario Institucional</Label>
                  <div className="flex items-center gap-4">
                     {["bg-blue-600", "bg-rose-600", "bg-emerald-600", "bg-slate-900", "bg-indigo-600"].map((color) => (
                        <div key={color} className={`${color} h-10 w-10 rounded-full cursor-pointer ring-offset-2 hover:ring-2 ring-primary transition-all`} />
                     ))}
                  </div>
               </div>

               <div className="space-y-4 pt-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Logo de la Academia</Label>
                  <div className="h-32 w-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:bg-slate-100 transition-all overflow-hidden">
                     <Globe className="h-8 w-8 text-slate-300 group-hover:scale-110 transition-transform" />
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subir nuevo archivo</span>
                  </div>
               </div>

               <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-100 font-bold hover:shadow-lg hover:shadow-slate-100 transition-all">
                  Restablecer Predeterminados
               </Button>
            </Card>

            <div className="flex items-center gap-4 text-slate-600 bg-slate-50 p-4 rounded-3xl border border-slate-100">
               <div className="h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center text-white">
                  <Database className="h-6 w-6" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-900">Mantenimiento y Datos</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Respaldos y bases de datos</p>
               </div>
            </div>

            <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden p-8 space-y-4">
               <p className="text-sm text-slate-400 font-medium">Última copia de seguridad: <span className="font-bold text-slate-900">Hoy, 09:12 AM</span></p>
               <Button className="w-full h-14 rounded-2xl bg-primary font-bold hover:bg-primary/90 transition-all gap-2 group">
                  Descargar Backup Completo
                   <ChevronRight className="h-5 w-5 opacity-50 group-hover:translate-x-1 transition-transform" />
               </Button>
            </Card>
         </div>
      </div>
    </div>
  )
}
