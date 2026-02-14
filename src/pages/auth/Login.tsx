import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCookie } from "@/lib/csrf"
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowRight, User, Stethoscope, Building2 } from "lucide-react"

export default function Login() {
    const [isLoading, setIsLoading] = useState(false)
    const [csrfToken, setCsrfToken] = useState<string>("")
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState<'patient' | 'doctor' | 'provider'>('patient')

    useEffect(() => {
        const token = getCookie("csrftoken")
        if (token) setCsrfToken(token)
    }, [])

    const handleSubmit = () => {
        setIsLoading(true)
    }

    const getRoleIcon = () => {
        switch (role) {
            case 'doctor': return <Stethoscope className="h-5 w-5 text-teal-400" />
            case 'provider': return <Building2 className="h-5 w-5 text-teal-400" />
            default: return <User className="h-5 w-5 text-teal-400" />
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
        <div className="min-h-screen flex bg-[#FAFAFA] text-slate-900 font-sans selection:bg-teal-500/30">
            {/* Left: VS Code / Technical Visual Side */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-slate-900 text-slate-300">
                <div className="absolute inset-0 bg-grid opacity-[0.05] pointer-events-none"></div>

                {/* Decoration: Code Blobs */}
                <div className="absolute -top-[20%] -left-[10%] w-[70vh] h-[70vh] bg-teal-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute top-[40%] -right-[10%] w-[60vh] h-[60vh] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 w-full h-full flex flex-col justify-center px-16 xl:px-24">
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-teal-950/50 border border-teal-800/50 mb-6 w-fit">
                            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                            <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-widest">Secure Login</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                            Healthcare <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Management Redefined.</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                            Securely access your patient records, appointments, and medical history from a unified dashboard.
                        </p>
                    </div>


                </div>
            </div>

            {/* Right: Form Section */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 relative">
                <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"></div>
                <div className="w-full max-w-[400px] relative z-10">

                    {/* Role Switcher */}
                    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl mb-8">
                        <button
                            type="button"
                            onClick={() => setRole('patient')}
                            className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${role === 'patient' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <User className="h-4 w-4" />
                            Patient
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('doctor')}
                            className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${role === 'doctor' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Stethoscope className="h-4 w-4" />
                            Doctor
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('provider')}
                            className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${role === 'provider' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Building2 className="h-4 w-4" />
                            Provider
                        </button>
                    </div>

                    {/* Header */}
                    <div className="mb-10">
                        <div className="h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-slate-900/20">
                            {getRoleIcon()}
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">{getRoleTitle()}</h2>
                        <p className="text-slate-500 text-sm font-mono">Please enter your credentials to proceed.</p>
                    </div>

                    {/* Form */}
                    <form method="POST" action="/accounts/login/" onSubmit={handleSubmit} className="space-y-6">
                        <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
                        {/* Hidden Role Input */}
                        <input type="hidden" name="role" value={role} />

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                                Email_ID / Username
                            </Label>
                            <div className="relative group">
                                <div className="absolute transition-all duration-300 opacity-0 group-focus-within:opacity-100 -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg blur opacity-20 group-hover:opacity-100"></div>
                                <div className="relative flex items-center bg-white rounded-lg border border-slate-200 shadow-sm">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        className="h-12 pl-10 pr-4 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-slate-900 placeholder:text-slate-300"
                                        autoComplete="username"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                                    Password_Key
                                </Label>
                                <a href="/accounts/password_reset/" className="text-xs font-mono text-teal-600 hover:text-teal-700 hover:underline">
                                    [FORGOT?]
                                </a>
                            </div>

                            <div className="relative group">
                                <div className="absolute transition-all duration-300 opacity-0 group-focus-within:opacity-100 -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg blur opacity-20 group-hover:opacity-100"></div>
                                <div className="relative flex items-center bg-white rounded-lg border border-slate-200 shadow-sm">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        className="h-12 pl-10 pr-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-slate-900 placeholder:text-slate-300"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                id="remember"
                                name="remember"
                                type="checkbox"
                                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/20"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-slate-600 font-medium">
                                Keep session active
                            </label>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-lg shadow-teal-900/10 hover:shadow-teal-500/20 transition-all duration-300 group overflow-hidden relative"
                            disabled={isLoading}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    AUTHENTICATE <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase font-mono tracking-widest">
                            <span className="px-3 bg-[#FAFAFA] text-slate-400">
                                OR
                            </span>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <a
                        href="/accounts/register/"
                        className="flex items-center justify-center w-full h-12 border border-slate-200 hover:border-teal-500 hover:text-teal-700 bg-white rounded-lg text-slate-600 font-bold transition-all duration-300 group"
                    >
                        <span className="group-hover:translate-x-1 transition-transform inline-block">Create New Account</span>
                    </a>

                    <p className="mt-8 text-center text-xs font-mono text-slate-400">
                        SECURE_CONNECTION_ESTABLISHED
                    </p>
                </div>
            </div>
        </div>
    )
}
