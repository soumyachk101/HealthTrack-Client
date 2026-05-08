"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowRight, ArrowLeft, Mail, Sparkles, KeyRound } from "lucide-react"
import Link from "next/link"
import { getApiUrl } from "@/lib/api"

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
        } catch (err: any) {
            console.error('Password reset error:', err)
            setError(err.message || "Failed to send reset email. Please try again.")
        } finally {
            setIsLoading(false)
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
                            <KeyRound className="h-8 w-8 text-teal-600" />
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-teal-500" />
                            <span className="text-lg font-black text-slate-800 tracking-tighter">HealthTrack+</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800">Reset Password</h2>
                        <p className="mt-3 text-slate-500 font-medium text-sm">
                            Enter your email and we&apos;ll send you a link to reset your password.
                        </p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 text-center font-medium">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-skeuo pl-12"
                                        placeholder="your.email@example.com"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full btn-skeuo-primary h-14 text-lg shadow-skeuo-md hover:shadow-skeuo-floating"
                                disabled={isLoading || !email}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Send Reset Link <ArrowRight className="h-5 w-5" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center gap-4 py-6">
                            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                                <Mail className="h-8 w-8 text-emerald-500" />
                            </div>
                            <div className="text-center">
                                <p className="text-slate-700 font-bold text-lg mb-2">Check Your Email!</p>
                                <p className="text-slate-500 text-sm">
                                    We&apos;ve sent a password reset link to<br />
                                    <span className="font-bold text-teal-600">{email}</span>
                                </p>
                                <p className="text-slate-400 text-xs mt-3">
                                    Check your spam folder if you don&apos;t see it.
                                </p>
                            </div>

                            <button
                                onClick={() => { setSuccess(false); setEmail(""); }}
                                className="mt-2 text-teal-600 font-bold text-sm hover:underline decoration-2 underline-offset-4"
                            >
                                Try a different email
                            </button>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-teal-600 font-bold text-sm hover:underline decoration-2 underline-offset-4"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Login
                        </Link>
                    </div>
                </div>

                <p className="text-center text-xs font-mono text-slate-400 uppercase tracking-widest opacity-60 mt-6">
                    Secure Connection • Supabase Authentication
                </p>
            </div>
        </div>
    )
}
