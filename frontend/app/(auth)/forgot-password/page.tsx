"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowRight, ArrowLeft, Mail, Sparkles, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { getApiUrl } from "@/lib/api"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [email, setEmail] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            const response = await fetch(getApiUrl("/accounts/api/forgot-password/"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            const data = await response.json()
            if (!data.success) throw new Error(data.error || "Failed to send reset email")
            setSuccess(true)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to send reset email. Please try again.")
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
                            <KeyRound className="h-10 w-10 text-teal-600" />
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Sparkles className="h-5 w-5 text-teal-500" />
                            <span className="text-xl font-black text-slate-800 tracking-tighter uppercase">HealthTrack+ Elite</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight">Recovery Protocol</h2>
                        <p className="text-slate-400 font-bold text-lg mt-2 leading-relaxed">
                            {success 
                                ? "Check your secure inbox for the restoration link." 
                                : "Enter your email to initiate the security reset."}
                        </p>
                    </div>

                    {!success ? (
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

                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Registered Email</Label>
                                <div className="relative group">
                                    <div className={cn("absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300", email ? "text-teal-600" : "text-slate-300")}>
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-16 pl-14 pr-6 bg-slate-50/50 border-transparent rounded-2xl focus:bg-white focus:ring-[6px] focus:ring-slate-100 focus:border-slate-200 transition-all text-lg font-medium shadow-none"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-18 bg-teal-600 text-white font-black text-xl rounded-[2rem] shadow-2xl shadow-teal-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 group"
                                disabled={isLoading || !email}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                                ) : (
                                    <span className="flex items-center justify-center gap-3">
                                        Authorize Reset <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    ) : (
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
                                    <p className="text-slate-800 font-black text-xl mb-1">Restoration Link Sent</p>
                                    <p className="text-slate-500 font-medium">Verify your email: <span className="font-bold text-teal-600">{email}</span></p>
                                </div>
                            </motion.div>
                            
                            <button
                                onClick={() => { setSuccess(false); setEmail(""); }}
                                className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 hover:text-teal-600 transition-colors"
                            >
                                Request New Protocol
                            </button>
                        </div>
                    )}

                    <div className="pt-6 border-t border-slate-50">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-3 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-teal-600 transition-colors group"
                        >
                            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                            Back to Secure Login
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
