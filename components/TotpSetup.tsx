"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldCheck, ShieldOff } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import Image from "next/image"

interface Props {
  idUsuario: number
  totpActivo: boolean
  onUpdate?: () => void
}

export function TotpSetup({ idUsuario, totpActivo, onUpdate }: Props) {
  const [step, setStep] = useState<"idle" | "qr" | "verify">("idle")
  const [qrUri, setQrUri] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const startSetup = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`http://localhost:8081/api/auth/2fa/setup/${idUsuario}`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setQrUri(data.qrDataUri)
      setStep("qr")
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyAndActivate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (code.length !== 6) { setError("El código debe tener 6 dígitos."); return }
    setIsLoading(true)
    try {
      const res = await fetch(`http://localhost:8081/api/auth/2fa/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUsuario, code })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      toast.success("¡2FA activado! Tu cuenta ahora está protegida.")
      setStep("idle")
      onUpdate?.()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  const disable2FA = async () => {
    if (!confirm("¿Seguro que deseas desactivar la autenticación de dos factores?")) return
    setIsLoading(true)
    try {
      const res = await fetch(`http://localhost:8081/api/auth/2fa/disable/${idUsuario}`, { method: "POST" })
      if (!res.ok) throw new Error("Error al desactivar")
      toast.success("2FA desactivado.")
      onUpdate?.()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (totpActivo) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="font-semibold text-emerald-800 dark:text-emerald-300">2FA Activado</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">Tu cuenta está protegida con Google Authenticator.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={disable2FA} disabled={isLoading}
          className="text-red-600 border-red-300 hover:bg-red-50">
          <ShieldOff className="w-4 h-4 mr-1" /> Desactivar
        </Button>
      </div>
    )
  }

  if (step === "idle") {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg">
        
        <div className="flex items-center gap-3">
          {totpActivo ? (
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          ) : (
            <ShieldOff className="w-5 h-5 text-muted-foreground" />
          )}

          <div>
            <p className="font-semibold">Autenticación de dos factores</p>
            <p className="text-xs text-muted-foreground">
              {totpActivo
                ? "Tu cuenta está protegida con Google Authenticator."
                : "Agrega una capa extra de seguridad con Google Authenticator."}
            </p>
          </div>
        </div>

        <Switch
          checked={totpActivo}
          onCheckedChange={(checked) => {
            if (checked) {
              startSetup()   // activar
            } else {
              disable2FA()   // desactivar
            }
          }}
          disabled={isLoading}
        />
      </div>
    )
  }

  if (step === "qr") {
    return (
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-bold text-lg">Escanea este QR con Google Authenticator</h3>
        <div className="flex justify-center">
          <Image src={qrUri} alt="QR 2FA" width={200} height={200} unoptimized />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Luego ingresa el código de 6 dígitos que te muestra la app.
        </p>
        <Button className="w-full" onClick={() => setStep("verify")}>Ya lo escaneé →</Button>
        <button onClick={() => setStep("idle")} className="w-full text-sm text-muted-foreground hover:text-primary">Cancelar</button>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-bold text-lg">Ingresa el código de verificación</h3>
      <form onSubmit={verifyAndActivate} className="space-y-4">
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        <div className="space-y-2">
          <Label>Código de Google Authenticator</Label>
          <Input placeholder="000000" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="h-12 font-mono text-center text-2xl tracking-[0.5em]" maxLength={6} autoFocus />
        </div>
        <Button disabled={isLoading} className="w-full h-12">{isLoading ? "Verificando..." : "Activar 2FA"}</Button>
        <button type="button" onClick={() => setStep("qr")} className="w-full text-sm text-muted-foreground hover:text-primary">← Volver al QR</button>
      </form>
    </div>
  )
}