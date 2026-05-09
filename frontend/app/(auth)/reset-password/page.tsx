"use client";

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowRight, KeyRound, Sparkles, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { getApiUrl } from "@/lib/api"

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
            if (err instanceof Error) {
                console.error('Password reset error:', err.message)
                setError(err.message || "Failed to reset password. The link may have expired.")
            } else {
                console.error('Password reset error:', err)
                setError("Failed to reset password. The link may have expired.")
            }
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
                        <h2 className="text-3xl font-bold text-slate-800">New Password</h2>
                        <p className="mt-3 text-slate-500 font-medium text-sm">
                            Enter your new password below.
                        </p>
                    </div>

                    {success ? (
                        <div className="flex flex-col items-center gap-4 py-6">
                            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                            </div>
                            <p className="text-slate-700 font-bold text-lg">Password Reset!</p>
                            <p className="text-slate-500 text-sm">Redirecting to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 text-center font-medium">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    New Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-skeuo pr-12"
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirm"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input-skeuo"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full btn-skeuo-primary h-14 text-lg shadow-skeuo-md hover:shadow-skeuo-floating"
                                disabled={isLoading || !sessionReady || !password || !confirmPassword}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Reset Password <ArrowRight className="h-5 w-5" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    )}
                </div>

                <p className="text-center text-xs font-mono text-slate-400 uppercase tracking-widest opacity-60 mt-6">
                    Secure Connection • Firebase Authentication
                </p>
            </div>
        </div>
    )
}
