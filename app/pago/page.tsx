"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Clock,
  Users,
  Award,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function PagoPage() {
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [name, setName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      // Handle success
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/mis-clases">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Brusben</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Pago Seguro</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 lg:px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_420px] gap-8">
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="relative aspect-[16/9] lg:aspect-[21/9]">
                <Image
                  src="/images/course-marketing.jpg"
                  alt="Diplomado en Marketing Digital"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-primary-foreground/80 text-sm mb-1">Diplomado</p>
                  <h2 className="text-2xl font-bold text-white">Marketing Digital</h2>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <Clock className="h-5 w-5 mx-auto text-primary mb-1" />
                    <p className="text-sm font-medium text-foreground">40 horas</p>
                    <p className="text-xs text-muted-foreground">Duración</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <Users className="h-5 w-5 mx-auto text-primary mb-1" />
                    <p className="text-sm font-medium text-foreground">+1,200</p>
                    <p className="text-xs text-muted-foreground">Estudiantes</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <Award className="h-5 w-5 mx-auto text-primary mb-1" />
                    <p className="text-sm font-medium text-foreground">Certificado</p>
                    <p className="text-xs text-muted-foreground">Incluido</p>
                  </div>
                </div>

                <h3 className="font-semibold text-foreground mb-3">
                  Lo que incluye este diplomado:
                </h3>
                <ul className="space-y-2">
                  {[
                    "24 lecciones en video de alta calidad",
                    "Materiales descargables y plantillas",
                    "Acceso de por vida al contenido",
                    "Certificado digital verificable",
                    "Soporte y comunidad exclusiva",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="order-1 lg:order-2">
            <Card className="border-0 shadow-sm sticky top-24">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Información de pago
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                {/* Price Summary */}
                <div className="mb-6 p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Diplomado en Marketing Digital</span>
                    <span className="text-sm text-foreground">S/ 180.00</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-emerald-600">Descuento (17%)</span>
                    <span className="text-sm text-emerald-600">-S/ 30.00</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Total a pagar</span>
                    <span className="text-2xl font-bold text-primary">S/ 150.00</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre en la tarjeta</Label>
                    <Input
                      id="name"
                      placeholder="Juan Pérez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card">Número de tarjeta</Label>
                    <div className="relative">
                      <Input
                        id="card"
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        className="h-12 pl-12"
                      />
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Vencimiento</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/AA"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        maxLength={4}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base bg-primary hover:bg-primary/90"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Procesando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Pagar S/ 150.00
                      </span>
                    )}
                  </Button>
                </form>

                {/* Security badges */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-xs">
                      <ShieldCheck className="h-4 w-4" />
                      <span>SSL Seguro</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Lock className="h-4 w-4" />
                      <span>Datos encriptados</span>
                    </div>
                  </div>
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    Tu información está protegida con encriptación de 256 bits
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
