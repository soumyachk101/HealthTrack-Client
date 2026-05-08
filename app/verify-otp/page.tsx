"use client";

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { getCookie } from "@/lib/csrf"
import { Loader2, ArrowRight, ShieldCheck, RefreshCw, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { getApiUrl } from "@/lib/api"

export default function VerifyOTP() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [csrfToken, setCsrfToken] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
    const [email, setEmail] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [otpType, setOtpType] = useState<string>("register")
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        const token = getCookie("csrftoken")
        if (token) setCsrfToken(token)

        const storedEmail = localStorage.getItem('verification_email')
        const storedUsername = localStorage.getItem('verification_username')
        const storedType = localStorage.getItem('verification_type')

        if (!storedEmail) {
            router.push('/login')
            return
        }

        setEmail(storedEmail)
        if (storedUsername) setUsername(storedUsername)
        if (storedType) setOtpType(storedType)

        inputRefs.current[0]?.focus()
    }, [router])

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (pastedData.length === 6) {
            const newOtp = pastedData.split('')
            setOtp(newOtp)
            inputRefs.current[5]?.focus()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setIsLoading(true)

        const otpCode = otp.join('')
        if (otpCode.length !== 6) {
            setError("Please enter the complete 6-digit code")
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch(getApiUrl("/accounts/api/verify-otp/"), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify({
                    otp: otpCode,
                    email: email,
                    otp_type: otpType,
                    username: username
                })
            })

            const data = await response.json()

            if (data.success) {
                localStorage.setItem('token', data.token)
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user))
                }

                localStorage.removeItem('verification_email')
                localStorage.removeItem('verification_username')
                localStorage.removeItem('verification_type')

                const role = data.user?.role
                if (role === 'doctor') {
                    router.push('/doctor/dashboard')
                } else if (role === 'provider') {
                    router.push('/provider/dashboard')
                } else if (role === 'admin') {
                    router.push('/admin/dashboard')
                } else {
                    router.push('/dashboard')
                }
            } else {
                setError(data.error || "Verification failed")
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
        setIsResending(true)

        try {
            const response = await fetch(getApiUrl("/accounts/api/resend-otp/"), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: email,
                    otp_type: otpType,
                    first_name: ''
                })
            })

            const data = await response.json()

            if (data.success) {
                setSuccess("A new verification code has been sent to your email")
                setOtp(["", "", "", "", "", ""])
                inputRefs.current[0]?.focus()
            } else {
                setError(data.error || "Failed to resend code")
            }
        } catch (err) {
            setError("Network error. Please try again.")
            console.error(err)
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
                        <h2 className="text-3xl font-bold text-slate-800">Verify Your Identity</h2>
                        <p className="mt-3 text-slate-500 font-medium text-sm">
                            We sent a 6-digit code to<br />
                            <span className="text-teal-600 font-bold">{maskedEmail}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        <div className="flex justify-center gap-3" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border-none bg-input shadow-skeuo-inset-md text-slate-700 focus:ring-2 focus:ring-teal-500/50 outline-none transition-shadow"
                                />
                            ))}
                        </div>

                        <Button
                            type="submit"
                            className="w-full btn-skeuo-primary h-14 text-lg shadow-skeuo-md hover:shadow-skeuo-floating"
                            disabled={isLoading || otp.join('').length !== 6}
                        >
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Verify Code <ArrowRight className="h-5 w-5" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                        <p className="text-sm text-slate-500 font-medium mb-3">
                            Didn&apos;t receive the code?
                        </p>
                        <button
                            onClick={handleResend}
                            disabled={isResending}
                            className="inline-flex items-center gap-2 text-teal-600 font-bold text-sm hover:underline decoration-2 underline-offset-4 disabled:opacity-50"
                        >
                            {isResending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="h-4 w-4" />
                            )}
                            Resend Code
                        </button>
                    </div>
                </div>

                <p className="text-center text-xs font-mono text-slate-400 uppercase tracking-widest opacity-60 mt-6">
                    Secure Verification • OTP Expires in 10 min
                </p>
            </div>
        </div>
    )
}
