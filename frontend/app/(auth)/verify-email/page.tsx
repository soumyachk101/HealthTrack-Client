"use client";

import { useState, useEffect, Suspense, useCallback } from "react"
import { Sparkles, CheckCircle2, ArrowRight, AlertCircle, RefreshCw } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { getApiUrl } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function VerifyEmailContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
    const [error, setError] = useState<string | null>(null)

    const handleCallback = useCallback(async () => {
        try {
            const otp = searchParams.get('otp')
            const emailParam = searchParams.get('email')

            if (!otp || !emailParam) {
                setStatus('error')
                setError("Invalid verification link. Please request a new one.")
                return
            }

            const response = await fetch(getApiUrl("/accounts/api/verify-otp/"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: emailParam,
                    otp: otp,
                    otp_type: 'register'
                })
            })

            const data = await response.json()

            if (data.success) {
                localStorage.setItem('token', data.token)
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user))
                }

                setStatus('success')

                const role = data.user?.role
                setTimeout(() => {
                    if (role === 'doctor') router.push('/doctor/dashboard')
                    else if (role === 'provider') router.push('/provider/dashboard')
                    else if (role === 'admin') router.push('/admin/dashboard')
                    else router.push('/dashboard')
                }, 2000)
            } else {
                setStatus('error')
                setError(data.error || "Verification failed")
            }
        } catch (_err) {
            setStatus('error')
            setError("Connection failed. The link may have expired.")
        }
    }, [router, searchParams])

    useEffect(() => {
        const timer = setTimeout(() => {
            handleCallback()
        }, 1000)
        return () => clearTimeout(timer)
    }, [handleCallback])

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFDFF] text-slate-700 font-sans relative overflow-hidden">
            {/* Background Aesthetics */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#f0f9ff_0%,transparent_100%)] opacity-50"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500"></div>
            
            <div className="w-full max-w-lg px-8 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[3rem] shadow-skeuo-floating border border-slate-50 p-12 text-center space-y-10"
                >
                    {/* Header Icon */}
                    <div className="relative mx-auto w-24 h-24">
                        <AnimatePresence mode="wait">
                            {status === 'verifying' && (
                                <motion.div 
                                    key="verifying"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <div className="absolute inset-0 bg-teal-500/10 rounded-3xl animate-pulse"></div>
                                    <RefreshCw className="h-12 w-12 text-teal-600 animate-spin" />
                                </motion.div>
                            )}
                            {status === 'success' && (
                                <motion.div 
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl animate-bounce"></div>
                                    <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                                </motion.div>
                            )}
                            {status === 'error' && (
                                <motion.div 
                                    key="error"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <div className="absolute inset-0 bg-red-500/10 rounded-3xl"></div>
                                    <AlertCircle className="h-12 w-12 text-red-500" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2">
                            <Sparkles className="h-5 w-5 text-teal-500" />
                            <span className="text-xl font-black text-slate-800 tracking-tighter uppercase">HealthTrack+ Elite</span>
                        </div>
                        
                        <AnimatePresence mode="wait">
                            {status === 'verifying' && (
                                <motion.div key="v-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <h2 className="text-4xl font-black text-slate-800 tracking-tight">Verifying Credentials</h2>
                                    <p className="text-slate-400 font-bold text-lg mt-2">Connecting to secure medical network...</p>
                                </motion.div>
                            )}
                            {status === 'success' && (
                                <motion.div key="s-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h2 className="text-4xl font-black text-slate-800 tracking-tight">Access Granted</h2>
                                    <p className="text-slate-400 font-bold text-lg mt-2">Your email has been successfully verified.</p>
                                </motion.div>
                            )}
                            {status === 'error' && (
                                <motion.div key="e-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h2 className="text-4xl font-black text-slate-800 tracking-tight">Verification Denied</h2>
                                    <p className="text-red-400 font-bold text-lg mt-2">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="pt-6">
                        {status === 'success' ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-1 bg-slate-100 w-full rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '0%' }}
                                        transition={{ duration: 2, ease: "easeInOut" }}
                                        className="h-full bg-emerald-500"
                                    />
                                </div>
                                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-300">Synchronizing Session Data</p>
                            </div>
                        ) : (
                            <Button 
                                onClick={() => router.push('/login')}
                                className={cn(
                                    "w-full h-16 text-white font-black text-lg rounded-2xl transition-all shadow-xl group",
                                    status === 'error' ? "bg-red-600 shadow-red-500/20" : "bg-slate-800 shadow-slate-500/20"
                                )}
                            >
                                <span className="flex items-center gap-3">
                                    {status === 'error' ? "Return to Secure Login" : "Cancel & Return"}
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Button>
                        )}
                    </div>
                </motion.div>

                <div className="mt-12 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                        Secure Cryptographic Verification • Node v8.4.2
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function VerifyEmail() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white font-black tracking-widest text-slate-200">
                INIT_VERIFICATION_PROTOCOL...
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    )
}
