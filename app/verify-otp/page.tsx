"use client";

import { useState, useEffect } from "react"
import { Loader2, ShieldCheck, RefreshCw, Sparkles, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function VerifyOTP() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [email, setEmail] = useState<string>("")
    const [linkSent, setLinkSent] = useState(false)

    useEffect(() => {
        const storedEmail = localStorage.getItem('verification_email')

        if (!storedEmail) {
            router.push('/login')
            return
        }

        setEmail(storedEmail)
        sendVerificationEmail(storedEmail)
    }, [router])

    const sendVerificationEmail = async (emailAddress: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const { error: supaError } = await supabase.auth.signInWithOtp({
                email: emailAddress,
                options: {
                    emailRedirectTo: `${window.location.origin}/verify-email`,
                }
            })
            if (supaError) throw supaError
            setLinkSent(true)
            setSuccess("Verification link sent! Check your inbox.")
        } catch (err: any) {
            console.error('Supabase magic link error:', err)
            setError(err.message || "Failed to send verification email")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResend = async () => {
        setIsResending(true)
        setError(null)
        setSuccess(null)
        try {
            await sendVerificationEmail(email)
        } finally {
            setIsResending(false)
        }
    }

    const maskedEmail = email ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : ''

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
                        <h2 className="text-3xl font-bold text-slate-800">Check Your Email</h2>
                        <p className="mt-3 text-slate-500 font-medium text-sm">
                            We sent a verification link to<br />
                            <span className="text-teal-600 font-bold">{maskedEmail}</span>
                        </p>
                    </div>

                    <div className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 text-center font-medium">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 text-sm border border-emerald-100 text-center font-medium">
                                {success}
                            </div>
                        )}

                        {isLoading ? (
                            <div className="flex flex-col items-center gap-4 py-8">
                                <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
                                <p className="text-slate-500 font-medium">Sending verification email...</p>
                            </div>
                        ) : linkSent ? (
                            <div className="flex flex-col items-center gap-4 py-6">
                                <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center">
                                    <Mail className="h-8 w-8 text-teal-600" />
                                </div>
                                <div className="text-center">
                                    <p className="text-slate-700 font-bold text-lg mb-2">Link Sent!</p>
                                    <p className="text-slate-500 text-sm">
                                        Click the magic link in your email<br />
                                        to complete verification.
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                        <p className="text-sm text-slate-500 font-medium mb-3">
                            Didn&apos;t receive the email?
                        </p>
                        <button
                            onClick={handleResend}
                            disabled={isResending || isLoading}
                            className="inline-flex items-center gap-2 text-teal-600 font-bold text-sm hover:underline decoration-2 underline-offset-4 disabled:opacity-50"
                        >
                            {isResending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="h-4 w-4" />
                            )}
                            Resend Link
                        </button>
                    </div>
                </div>

                <p className="text-center text-xs font-mono text-slate-400 uppercase tracking-widest opacity-60 mt-6">
                    Secure Verification • Supabase Authentication
                </p>
            </div>
        </div>
    )
}
