import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCookie } from "@/lib/csrf"
import { Loader2, ShieldCheck, ArrowLeft, AlertCircle, CheckCircle2, Zap } from "lucide-react"

export default function VerifyOTP() {
    const [isLoading, setIsLoading] = useState(false)
    const [csrfToken, setCsrfToken] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    useEffect(() => {
        const token = getCookie("csrftoken")
        if (token) setCsrfToken(token)

        // Try to get email from DOM if available
        const emailEl = document.getElementById("verification-email")
        if (emailEl) setEmail(emailEl.innerText)

        // Parse server messages
        const messagesEl = document.getElementById("server-messages")
        if (messagesEl && messagesEl.textContent) {
            try {
                const messages = JSON.parse(messagesEl.textContent)
                messages.forEach((msg: any) => {
                    if (msg.level.includes("error") || msg.level.includes("warning")) {
                        setError(msg.message)
                    } else if (msg.level.includes("success")) {
                        setSuccess(msg.message)
                    }
                })
            } catch (e) {
                console.error("Failed to parse messages", e)
            }
        }
    }, [])

    const handleSubmit = () => {
        setIsLoading(true)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] text-slate-900 font-sans selection:bg-teal-500/30 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-grid opacity-[0.05] pointer-events-none"></div>

            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10 px-6">

                {/* Header Badge */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white border border-slate-200 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">SECURE CHECKPOINT</span>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl p-8 relative overflow-hidden group">
                    {/* Top Accents */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500"></div>

                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-teal-900/5 transform group-hover:scale-105 transition-transform duration-500">
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Verify Identity</h2>
                        <p className="text-slate-500 text-sm">
                            Enter the 6-digit access code sent to <br />
                            <span className="font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded ml-1">{email || "your email"}</span>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle className="h-4 w-4 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 rounded-lg bg-emerald-50 text-emerald-600 text-sm border border-emerald-100 flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                            <CheckCircle2 className="h-4 w-4 mt-0.5" />
                            <p>{success}</p>
                        </div>
                    )}

                    <form method="POST" action="/accounts/verify-otp/" onSubmit={handleSubmit} className="space-y-6">
                        <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />

                        <div className="space-y-2">
                            <Label htmlFor="otp" className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider text-center block">
                                Authentication_Code
                            </Label>
                            <div className="relative group">
                                <div className="absolute transition-all duration-300 opacity-20 group-focus-within:opacity-100 -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg blur opacity-30 group-hover:opacity-100"></div>
                                <Input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    placeholder="0 0 0 0 0 0"
                                    className="relative bg-white text-center text-3xl tracking-[0.5em] font-mono h-16 border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 placeholder:text-slate-200 text-slate-900 rounded-xl"
                                    maxLength={6}
                                    pattern="\d{6}"
                                    autoComplete="one-time-code"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-teal-900/10 hover:shadow-teal-500/20 transition-all duration-300 group relative overflow-hidden" disabled={isLoading}>
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    CONFIRM ACCESS <Zap className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-4 text-center text-sm">
                        <p className="text-slate-500">
                            No code received?{" "}
                            <a href="/accounts/register/" className="text-teal-600 font-bold hover:underline hover:text-teal-700">
                                Resend_Packet
                            </a>
                        </p>
                        <a href="/accounts/register/" className="flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors text-xs font-mono uppercase tracking-wider group">
                            <ArrowLeft className="mr-1 h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                            Return to Initialization
                        </a>
                    </div>
                </div>

                <p className="text-center text-[10px] text-slate-300 font-mono mt-8 uppercase tracking-widest">
                    Secured by HealthTrack+ Sentinel
                </p>
            </div>
        </div>
    )
}
