"use client";

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowRight, KeyRound, Sparkles, Eye, EyeOff, CheckCircle2, Lock, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { getApiUrl } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function ResetPassword() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [sessionReady, setSessionReady] = useState(false)
    const [resetCode, setResetCode] = useState("")
    const [resetEmail, setResetEmail] = useState("")

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const otp = params.get('otp')
        const email = params.get('email')

        if (!otp || !email) {
            setError("Invalid or expired reset link. Please request a new one.")
            return
        }

        setResetCode(otp)
        setResetEmail(email)
        setSessionReady(true)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch(getApiUrl("/accounts/api/reset-password/"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: resetEmail,
                    otp: resetCode,
                    new_password: password
                })
            })

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || "Failed to reset password")
            }

            setSuccess(true)
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to reset password. The link may have expired.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFDFF] text-slate-700 font-sans relative overflow-hidden">
            {/* Background Aesthetics */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#f0f9ff_0%,transparent_100%)] opacity-50"></div>
            
            <div className="w-full max-w-lg px-8 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[3rem] shadow-skeuo-floating border border-slate-50 p-12 text-center space-y-10"
                >
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="mx-auto w-24 h-24 rounded-3xl bg-white shadow-skeuo-md flex items-center justify-center mb-6 border-2 border-white">
                            <Lock className="h-10 w-10 text-teal-600" />
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Sparkles className="h-5 w-5 text-teal-500" />
                            <span className="text-xl font-black text-slate-800 tracking-tighter uppercase">HealthTrack+ Elite</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight">Set Security Key</h2>
                        <p className="text-slate-400 font-bold text-lg mt-2 leading-relaxed">
                            {success 
                                ? "Identity restored. Synchronizing your profile." 
                                : "Define a new cryptographic entry key for your account."}
                        </p>
                    </div>

                    {success ? (
                        <div className="space-y-8">
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="p-8 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 flex flex-col items-center gap-4 text-center"
                            >
                                <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-slate-800 font-black text-xl mb-1">Key Synchronized</p>
                                    <p className="text-slate-500 font-medium">Redirecting to login portal...</p>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8 text-left">
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-5 rounded-3xl bg-red-50 text-red-600 border border-red-100 flex items-start gap-4"
                                >
                                    <AlertCircle className="h-6 w-6 mt-0.5 shrink-0" />
                                    <p className="text-base font-bold leading-tight">{error}</p>
                                </motion.div>
                            )}

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="password" className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">New Security Key</Label>
                                    <div className="relative group">
                                        <div className={cn("absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300", password ? "text-teal-600" : "text-slate-300")}>
                                            <KeyRound className="h-6 w-6" />
                                        </div>
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-16 pl-14 pr-14 bg-slate-50/50 border-transparent rounded-2xl focus:bg-white focus:ring-[6px] focus:ring-slate-100 focus:border-slate-200 transition-all text-lg font-medium shadow-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="confirm" className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Confirm Key</Label>
                                    <div className="relative group">
                                        <div className={cn("absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300", confirmPassword === password && password ? "text-teal-600" : "text-slate-300")}>
                                            <KeyRound className="h-6 w-6" />
                                        </div>
                                        <Input
                                            id="confirm"
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="h-16 pl-14 pr-6 bg-slate-50/50 border-transparent rounded-2xl focus:bg-white focus:ring-[6px] focus:ring-slate-100 focus:border-slate-200 transition-all text-lg font-medium shadow-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-18 bg-teal-600 text-white font-black text-xl rounded-[2rem] shadow-2xl shadow-teal-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 group"
                                disabled={isLoading || !sessionReady || !password || !confirmPassword}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                                ) : (
                                    <span className="flex items-center justify-center gap-3">
                                        Finalize Reset <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    )}

                    <div className="pt-6 border-t border-slate-50 text-center">
                        <Link
                            href="/login"
                            className="text-xs font-black uppercase tracking-widest text-slate-300 hover:text-teal-600 transition-colors"
                        >
                            Return to Entry Portal
                        </Link>
                    </div>
                </motion.div>

                <div className="mt-12 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 opacity-60">
                        Institutional Recovery System • 256-BIT ENCRYPTED
                    </p>
                </div>
            </div>
        </div>
    )
}
