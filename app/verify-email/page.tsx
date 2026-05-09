"use client";

import { useState, useEffect, Suspense } from "react"
import { Loader2, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { getApiUrl } from "@/lib/api"

function VerifyEmailContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        handleCallback()
    }, [searchParams])

    const handleCallback = async () => {
        try {
            const otp = searchParams.get('otp')
            const emailParam = searchParams.get('email')

            if (!otp || !emailParam) {
                setStatus('error')
                setError("Invalid verification link. Missing token or email.")
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
                }, 1500)
            } else {
                setStatus('error')
                setError(data.error || "Verification failed")
            }
        } catch (err: any) {
            console.error('Email verification error:', err)
            setStatus('error')
            setError(err.message || "Verification failed. The link may have expired.")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#EFF6FF] text-slate-700 font-sans selection:bg-teal-200 selection:text-teal-900 relative overflow-hidden">
            <div className="bg-texture"></div>

            <div className="absolute top-[10%] right-[15%] w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-[10%] left-[15%] w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="w-full max-w-md px-4 relative z-10">
                <div className="card-skeuo">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-20 h-20 rounded-2xl bg-[#EFF6FF] shadow-skeuo-floating flex items-center justify-center mb-6 border border-white">
                            <ShieldCheck className="h-8 w-8 text-teal-600" />
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-teal-500" />
                            <span className="text-lg font-black text-slate-800 tracking-tighter">HealthTrack+</span>
                        </div>
                    </div>

                    {status === 'verifying' && (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
                            <p className="text-slate-600 font-bold text-lg">Verifying your email...</p>
                            <p className="text-slate-500 text-sm">Please wait a moment</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                            </div>
                            <p className="text-slate-700 font-bold text-xl">Email Verified!</p>
                            <p className="text-slate-500 text-sm">Redirecting to your dashboard...</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 text-center font-medium w-full">
                                {error}
                            </div>
                            <button
                                onClick={() => router.push('/login')}
                                className="mt-4 text-teal-600 font-bold text-sm hover:underline"
                            >
                                Back to Login
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-center text-xs font-mono text-slate-400 uppercase tracking-widest opacity-60 mt-6">
                    Secure Verification • HealthTrack+
                </p>
            </div>
        </div>
    )
}

export default function VerifyEmail() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#EFF6FF]"><Loader2 className="h-8 w-8 animate-spin text-teal-600" /></div>}>
            <VerifyEmailContent />
        </Suspense>
    )
}
