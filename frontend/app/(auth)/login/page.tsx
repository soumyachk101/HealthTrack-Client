"use client";

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, User, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ShieldCheck, Zap, Stethoscope, Building2, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { getApiUrl } from "@/lib/api"
import { GoogleLogin } from "@react-oauth/google"
import { motion, AnimatePresence } from "framer-motion"

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [needsVerification, setNeedsVerification] = useState(false)
    const [unverifiedEmail, setUnverifiedEmail] = useState("")
    const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success'>('idle')
    
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "patient"
    })

    useEffect(() => {
        const roleParam = searchParams.get('role');
        if (roleParam && ['patient', 'doctor', 'provider'].includes(roleParam)) {
            setFormData(prev => ({ ...prev, role: roleParam }));
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setNeedsVerification(false)
        setIsLoading(true)

        try {
            const response = await fetch(getApiUrl("/accounts/api/login/"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (data.success) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                
                const role = data.user.role
                if (role === 'doctor') router.push('/doctor/dashboard')
                else if (role === 'provider') router.push('/provider/dashboard')
                else if (role === 'admin') router.push('/admin/dashboard')
                else router.push('/dashboard')
            } else {
                if (data.requires_verification) {
                    setNeedsVerification(true)
                    setUnverifiedEmail(data.email || formData.username)
                    setError(data.error || "Email not verified")
                } else {
                    setError(data.error || "Invalid credentials")
                }
            }
        } catch (_err) {
            setError("Connection failed. Please check your internet.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendVerification = async () => {
        setResendStatus('loading')
        try {
            const response = await fetch(getApiUrl("/accounts/api/resend-otp/"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: unverifiedEmail, otp_type: 'register' })
            })
            const data = await response.json()
            if (data.success) {
                setResendStatus('success')
                setTimeout(() => setResendStatus('idle'), 5000)
            } else {
                setError(data.error || "Failed to resend link")
                setResendStatus('idle')
            }
        } catch (_err) {
            setError("Network error. Try again.")
            setResendStatus('idle')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const roleStyles = {
        patient: {
            bg: "bg-teal-600",
            lightBg: "bg-teal-50",
            text: "text-teal-600",
            shadow: "shadow-teal-500/20",
            icon: <User className="h-4 w-4" />,
            title: "Patient Portal",
            desc: "Access your medical history and AI health insights.",
            visualTitle: "Smart health tracking.",
            accent: "text-teal-500"
        },
        doctor: {
            bg: "bg-blue-600",
            lightBg: "bg-blue-50",
            text: "text-blue-600",
            shadow: "shadow-blue-500/20",
            icon: <Stethoscope className="h-4 w-4" />,
            title: "Doctor Console",
            desc: "Manage your patients, schedule, and prescriptions.",
            visualTitle: "Streamlined practice.",
            accent: "text-blue-500"
        },
        provider: {
            bg: "bg-indigo-600",
            lightBg: "bg-indigo-50",
            text: "text-indigo-600",
            shadow: "shadow-indigo-500/20",
            icon: <Building2 className="h-4 w-4" />,
            title: "Provider Network",
            desc: "Handle lab requests, pharmacy orders, and diagnostics.",
            visualTitle: "Network efficiency.",
            accent: "text-indigo-500"
        }
    }

    const currentStyle = roleStyles[formData.role as keyof typeof roleStyles]

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-[#FDFDFF] text-slate-700 overflow-hidden font-sans">
            {/* Visual Side (Left) */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={formData.role}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className={cn("hidden lg:flex relative items-center justify-center p-16 overflow-hidden border-r border-slate-100", currentStyle.lightBg)}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#fff_0%,transparent_70%)] opacity-60"></div>
                    
                    <div className="relative z-10 w-full max-w-lg space-y-12">
                        <div className="space-y-6">
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-skeuo-sm border border-white"
                            >
                                <Sparkles className={cn("h-4 w-4", currentStyle.accent)} />
                                <span className={cn("text-xs font-black tracking-wider uppercase", currentStyle.text)}>HealthTrack+ Elite</span>
                            </motion.div>
                            
                            <h1 className="text-7xl font-black text-slate-800 leading-[1.05] tracking-tighter">
                                {currentStyle.visualTitle.split(' ')[0]} <br />
                                <span className={currentStyle.text}>{currentStyle.visualTitle.split(' ').slice(1).join(' ')}</span>
                            </h1>
                            <p className="text-xl text-slate-500 max-w-sm font-medium leading-relaxed">
                                {currentStyle.desc}
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { icon: ShieldCheck, title: "Private & Encrypted", desc: "Your data is secured with AES-256 standards." },
                                { icon: Zap, title: "Real-time Sync", desc: "Instant updates across all your medical touchpoints." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 p-8 rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white shadow-skeuo-md">
                                    <div className={cn("h-14 w-14 rounded-2xl bg-white shadow-skeuo-sm flex items-center justify-center shrink-0", currentStyle.text)}>
                                        <item.icon className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-xl mb-1">{item.title}</h3>
                                        <p className="text-base text-slate-500 font-medium leading-normal">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className={cn("absolute -bottom-24 -left-24 w-96 h-96 rounded-full border border-white/40 backdrop-blur-2xl bg-white/10 opacity-50")}></div>
                </motion.div>
            </AnimatePresence>

            {/* Content Side (Right) */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-white">
                <div className="w-full max-w-md space-y-12">
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className={cn("h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-skeuo-md border-2 border-white", currentStyle.text)}
                            >
                                <Sparkles className="h-6 w-6" />
                            </motion.div>
                            <span className="text-3xl font-black text-slate-800 tracking-tighter">HealthTrack+</span>
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={formData.role}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-5xl font-black text-slate-800 tracking-tight leading-tight">
                                    {currentStyle.title}
                                </h2>
                                <p className="text-slate-400 font-semibold text-lg mt-2">Sign in to your secure workspace.</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Role Selector - Premium Interaction */}
                    <div className="p-2 rounded-[2rem] bg-slate-50 shadow-inner-lg flex items-center gap-2 border border-slate-100">
                        {(['patient', 'doctor', 'provider'] as const).map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, role: r }))}
                                className={cn(
                                    "flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all duration-500",
                                    formData.role === r
                                        ? cn("bg-white shadow-skeuo-floating scale-[1.05] border-2", roleStyles[r].text, "border-white")
                                        : "text-slate-300 hover:text-slate-500"
                                )}
                            >
                                <div className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    formData.role === r ? roleStyles[r].lightBg : "bg-transparent"
                                )}>
                                    {roleStyles[r].icon}
                                </div>
                                {r}
                            </button>
                        ))}
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={cn(
                                    "p-5 rounded-3xl flex items-start gap-4",
                                    needsVerification ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-red-50 text-red-600 border border-red-100"
                                )}
                            >
                                <AlertCircle className="h-6 w-6 mt-0.5 shrink-0" />
                                <div className="space-y-3">
                                    <p className="text-base font-bold leading-tight">{error}</p>
                                    {needsVerification && (
                                        <button 
                                            type="button"
                                            onClick={handleResendVerification}
                                            disabled={resendStatus === 'loading'}
                                            className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] py-2 px-4 rounded-full bg-white shadow-sm hover:shadow-md transition-all active:scale-95"
                                        >
                                            {resendStatus === 'loading' ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                                            {resendStatus === 'success' ? "Link Sent!" : "Resend Link"}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Identify Yourself</Label>
                                <div className="relative group">
                                    <div className={cn("absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300", formData.username ? currentStyle.text : "text-slate-300")}>
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <Input
                                        id="username"
                                        name="username"
                                        required
                                        className="h-16 pl-14 pr-6 bg-slate-50/50 border-transparent rounded-2xl focus:bg-white focus:ring-[6px] focus:ring-slate-100 focus:border-slate-200 transition-all text-lg font-medium shadow-none"
                                        autoComplete="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-2">
                                    <Label htmlFor="password" className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Security Key</Label>
                                    <Link href="/forgot-password" className="text-xs font-black text-slate-300 hover:text-teal-600 transition-colors uppercase tracking-widest">
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <div className={cn("absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300", formData.password ? currentStyle.text : "text-slate-300")}>
                                        <Lock className="h-6 w-6" />
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="h-16 pl-14 pr-14 bg-slate-50/50 border-transparent rounded-2xl focus:bg-white focus:ring-[6px] focus:ring-slate-100 focus:border-slate-200 transition-all text-lg font-medium shadow-none"
                                        autoComplete="current-password"
                                        value={formData.password}
                                        onChange={handleChange}
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
                        </div>

                        <Button
                            type="submit"
                            className={cn(
                                "w-full h-18 text-white font-black text-xl rounded-[2rem] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 group",
                                currentStyle.bg,
                                currentStyle.shadow
                            )}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                            ) : (
                                <span className="flex items-center justify-center gap-3">
                                    Authenticate <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="space-y-10">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                                <span className="bg-white px-6">Elite Access</span>
                            </div>
                        </div>

                        <div className="flex justify-center scale-125 origin-center">
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    setError(null)
                                    setIsLoading(true)
                                    try {
                                        const response = await fetch(getApiUrl("/accounts/api/google-login/"), {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ credential: credentialResponse.credential, role: formData.role })
                                        })
                                        const data = await response.json()
                                        if (data.success) {
                                            localStorage.setItem('token', data.token)
                                            localStorage.setItem('user', JSON.stringify(data.user))
                                            const role = data.user.role
                                            if (role === 'doctor') router.push('/doctor/dashboard')
                                            else if (role === 'provider') router.push('/provider/dashboard')
                                            else if (role === 'admin') router.push('/admin/dashboard')
                                            else router.push('/dashboard')
                                        } else {
                                            setError(data.error || 'Google login failed')
                                        }
                                    } finally {
                                        setIsLoading(false)
                                    }
                                }}
                                onError={() => setError('Google login failed')}
                                theme="outline"
                                size="large"
                                shape="pill"
                                width="320"
                            />
                        </div>

                        <div className="text-center pt-4">
                            <p className="text-slate-400 font-bold">
                                New to the network?{" "}
                                <Link href={`/register?role=${formData.role}`} className={cn("font-black hover:underline decoration-4 underline-offset-8 transition-colors", currentStyle.text)}>
                                    Join Now
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Custom Overlay for Role Changes */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-sm flex items-center justify-center"
                    >
                        <div className="flex flex-col items-center gap-6">
                            <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center animate-bounce shadow-2xl bg-white border-2 border-slate-100", currentStyle.text)}>
                                <Sparkles className="h-10 w-10" />
                            </div>
                            <p className="text-xs font-black tracking-[0.4em] uppercase text-slate-500 animate-pulse">Establishing Secure Session</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function Login() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white font-black tracking-widest text-slate-300">SYSTEM_INIT...</div>}>
            <LoginForm />
        </Suspense>
    )
}
