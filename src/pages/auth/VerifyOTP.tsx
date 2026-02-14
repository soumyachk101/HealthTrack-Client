import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCookie } from "@/lib/csrf"
import { Loader2, ShieldCheck, ArrowLeft, AlertCircle, CheckCircle2, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function VerifyOTP() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [csrfToken, setCsrfToken] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [otp, setOtp] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

    useEffect(() => {
        const token = getCookie("csrftoken")
        if (token) setCsrfToken(token)

        // Try to get email from localStorage or previous state
        const storedEmail = localStorage.getItem("verification_email")
        if (storedEmail) setEmail(storedEmail)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setIsLoading(true)

        try {
            const response = await fetch(`${API_URL}/accounts/api/verify-otp/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify({ otp })
            })

            const data = await response.json()

            if (data.success) {
                setSuccess(data.message || "Verified successfully!")
                // Store token if returned
                if (data.token) {
                    localStorage.setItem('token', data.token)
                    if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
                }
                setTimeout(() => {
                    navigate('/dashboard')
                }, 1500)
            } else {
                setError(data.error || "Verification failed. Invalid code.")
            }
        } catch (err) {
            setError("Network error. Please try again.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleResend = async () => {
        setError(null)
        setSuccess(null)
        setIsLoading(true)

        try {
            const response = await fetch(`${API_URL}/accounts/api/resend-otp/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                credentials: 'include'
            })

            const data = await response.json()

            if (data.success) {
                setSuccess(data.message || "A new code has been sent!")
            } else {
                setError(data.error || "Failed to resend code.")
            }
        } catch (err) {
            setError("Network error. Please try again.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
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

                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        <div className="space-y-2">
                            <Label htmlFor="otp" className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider text-center block">
                                Authentication Code
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
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
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
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isLoading}
                                className="text-teal-600 font-bold hover:underline hover:text-teal-700 disabled:opacity-50"
                            >
                                Resend Code
                            </button>
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors text-xs font-mono uppercase tracking-wider group"
                        >
                            <ArrowLeft className="mr-1 h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                            Return to Login
                        </button>
                    </div>
                </div>

                <p className="text-center text-[10px] text-slate-300 font-mono mt-8 uppercase tracking-widest">
                    Secured by HealthTrack+ Sentinel
                </p>
            </div>
        </div>
    )
}
