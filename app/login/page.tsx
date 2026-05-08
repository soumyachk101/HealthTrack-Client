"use client";

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCookie } from "@/lib/csrf"
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowRight, User, Stethoscope, Building2, Activity, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { getApiUrl } from "@/lib/api"
import { GoogleLogin } from "@react-oauth/google"

export default function Login() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [csrfToken, setCsrfToken] = useState<string>("")
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState<'patient' | 'doctor' | 'provider'>('patient')
    const [error, setError] = useState<string | null>(null)


    useEffect(() => {
        const token = getCookie("csrftoken")
        if (token) setCsrfToken(token)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            const response = await fetch(getApiUrl("/accounts/api/login/"), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: (e.target as any).username.value,
                    password: (e.target as any).password.value
                })
            })

            const data = await response.json()

            if (data.success) {
                localStorage.setItem('token', data.token)
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user))
                    if (data.user.role === 'doctor') {
                        router.push('/doctor/dashboard')
                        return
                    } else if (data.user.role === 'provider') {
                        router.push('/provider/dashboard')
                        return
                    } else if (data.user.role === 'admin') {
                        router.push('/admin/dashboard')
                        return
                    }
                }
                router.push('/dashboard')
            } else {
                setError(data.error || "Login failed")
            }
        } catch (err) {
            setError("Network error. Please try again.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const getRoleIcon = () => {
        switch (role) {
            case 'doctor': return <Stethoscope className="h-6 w-6 text-teal-600" />
            case 'provider': return <Building2 className="h-6 w-6 text-teal-600" />
            default: return <User className="h-6 w-6 text-teal-600" />
        }
    }

    const getRoleTitle = () => {
        switch (role) {
            case 'doctor': return "Doctor Portal"
            case 'provider': return "Provider Portal"
            default: return "Patient Portal"
        }
    }

    return (
        <div className="min-h-screen flex bg-[#EFF6FF] text-slate-700 font-sans selection:bg-teal-200 selection:text-teal-900 relative overflow-hidden">
            <div className="bg-texture"></div>

            <div className="hidden lg:flex lg:w-[50%] relative items-center justify-center p-12">
                <div className="absolute top-[20%] left-[20%] w-32 h-32 rounded-full bg-[#EFF6FF] shadow-skeuo-md animate-blob-float opacity-80"></div>
                <div className="absolute bottom-[20%] right-[20%] w-40 h-40 rounded-full bg-[#EFF6FF] shadow-skeuo-convex animate-blob-float opacity-60" style={{ animationDelay: '-2s' }}></div>

                <div className="relative z-10 max-w-lg">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#EFF6FF] shadow-skeuo-inset-sm border-b border-white/50 mb-8">
                        <span className="flex h-3 w-3 rounded-full bg-teal-500 shadow-[2px_2px_4px_#cdcaca,-2px_-2px_4px_#ffffff] animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Secure Access v2.5</span>
                    </div>

                    <h1 className="text-6xl font-black text-slate-800 tracking-tight leading-tight mb-6">
                        Welcome <br />
                        <span className="text-teal-600">Back.</span>
                    </h1>

                    <p className="text-xl text-slate-500 leading-relaxed font-medium">
                        Access your comprehensive health dashboard.
                        <span className="block mt-4 p-4 rounded-2xl bg-[#EFF6FF] shadow-skeuo-sm border border-white/50 text-sm">
                            <Activity className="inline-block w-4 h-4 mr-2 text-teal-500" />
                            Real-time vitals synchronization active.
                        </span>
                    </p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
                <div className="absolute inset-0 lg:hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="w-full max-w-md space-y-8">
                    <div className="card-skeuo relative z-10">
                        <div className="text-center mb-10">
                            <div className="mx-auto w-20 h-20 rounded-2xl bg-[#EFF6FF] shadow-skeuo-floating flex items-center justify-center mb-6 border border-white">
                                {getRoleIcon()}
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800">{getRoleTitle()}</h2>
                            <p className="mt-2 text-slate-500 font-medium">Enter your credentials to access the system.</p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 p-2 rounded-2xl bg-[#EFF6FF] shadow-skeuo-inset-sm mb-8 border-b border-white/50">
                            {(['patient', 'doctor', 'provider'] as const).map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-xs font-bold transition-all duration-200 uppercase tracking-wide",
                                        role === r
                                            ? "bg-[#EFF6FF] text-teal-600 shadow-skeuo-sm scale-[0.98] border border-white/60"
                                            : "text-slate-400 hover:text-slate-600 hover:bg-[#EFF6FF]/50"
                                    )}
                                >
                                    {r === 'patient' && <User className="h-4 w-4" />}
                                    {r === 'doctor' && <Stethoscope className="h-4 w-4" />}
                                    {r === 'provider' && <Building2 className="h-4 w-4" />}
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}
                            <input type="hidden" name="role" value={role} />

                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Email or Username
                                </Label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        className="input-skeuo pl-12"
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <Label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Password
                                    </Label>
                                    <Link href="/forgot-password" className="text-xs font-bold text-teal-600 hover:text-teal-700">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="input-skeuo pl-12 pr-12"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center ml-1">
                                <div className="relative flex items-center">
                                    <input
                                        id="remember"
                                        name="remember"
                                        type="checkbox"
                                        className="peer h-5 w-5 appearance-none rounded-md border-0 bg-[#EFF6FF] shadow-skeuo-inset-sm checked:bg-teal-500 checked:shadow-skeuo-sm transition-all cursor-pointer"
                                    />
                                    <CheckIcon className="absolute w-3.5 h-3.5 left-0.5 top-0.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                </div>
                                <label htmlFor="remember" className="ml-3 text-sm text-slate-600 font-bold cursor-pointer select-none">
                                    Keep session active
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full btn-skeuo-primary h-14 text-lg shadow-skeuo-md hover:shadow-skeuo-floating"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Authenticate <ArrowRight className="h-5 w-5" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-slate-200">
                            <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Or continue with</div>
                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={async (credentialResponse) => {
                                        setError(null)
                                        setIsLoading(true)
                                        try {
                                            const response = await fetch(getApiUrl("/accounts/api/google-login/"), {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ credential: credentialResponse.credential })
                                            })
                                            const data = await response.json()
                                            if (data.success) {
                                                localStorage.setItem('token', data.token)
                                                if (data.user) {
                                                    localStorage.setItem('user', JSON.stringify(data.user))
                                                    if (data.user.role === 'doctor') { router.push('/doctor/dashboard'); return }
                                                    if (data.user.role === 'provider') { router.push('/provider/dashboard'); return }
                                                    if (data.user.role === 'admin') { router.push('/admin/dashboard'); return }
                                                }
                                                router.push('/dashboard')
                                            } else {
                                                setError(data.error || 'Google login failed')
                                            }
                                        } catch (err) {
                                            setError('Network error. Please try again.')
                                            console.error(err)
                                        } finally {
                                            setIsLoading(false)
                                        }
                                    }}
                                    onError={() => setError('Google login failed')}
                                    theme="outline"
                                    size="large"
                                    width="384"
                                    text="continue_with"
                                />
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-200">
                            <p className="text-center text-slate-500 font-medium">
                                No account found? {" "}
                                <Link href="/register" className="text-teal-600 font-bold hover:underline decoration-2 underline-offset-4">
                                    Create Profile
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-xs font-mono text-slate-400 uppercase tracking-widest opacity-60">
                        Secure Connection • 256-bit Encryption
                    </p>
                </div>
            </div>
        </div>
    )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    )
}
