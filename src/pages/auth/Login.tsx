import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCookie } from "@/lib/csrf"
import { Loader2, Activity, Shield, Heart, Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react"

export default function Login() {
    const [isLoading, setIsLoading] = useState(false)
    const [csrfToken, setCsrfToken] = useState<string>("")
    const [showPassword, setShowPassword] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    useEffect(() => {
        const token = getCookie("csrftoken")
        if (token) setCsrfToken(token)
    }, [])

    const handleSubmit = () => {
        setIsLoading(true)
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
            {/* Left: Form Section */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-28 py-12 relative">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-[0.015]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />

                <div className="w-full max-w-md mx-auto relative z-10">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-12">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            HealthTrack+
                        </span>
                    </div>

                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
                            Welcome back
                        </h1>
                        <p className="text-slate-500 text-lg">
                            Sign in to continue managing your health journey
                        </p>
                    </div>

                    {/* Form */}
                    <form method="POST" action="/accounts/login/" onSubmit={handleSubmit} className="space-y-6">
                        <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-sm font-semibold text-slate-700">
                                Email or Phone Number
                            </Label>
                            <div className="relative group">
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'username' ? 'text-teal-500' : 'text-slate-400'}`}>
                                    <Mail className="h-5 w-5" />
                                </div>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    placeholder="name@example.com"
                                    className="h-13 pl-12 pr-4 bg-white border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500/20 focus:ring-4 transition-all duration-200 shadow-sm hover:border-slate-300"
                                    autoComplete="username"
                                    onFocus={() => setFocusedField('username')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                                    Password
                                </Label>
                                <a 
                                    href="/accounts/password_reset/" 
                                    className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative group">
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'password' ? 'text-teal-500' : 'text-slate-400'}`}>
                                    <Lock className="h-5 w-5" />
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="Enter your password"
                                    className="h-13 pl-12 pr-12 bg-white border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500/20 focus:ring-4 transition-all duration-200 shadow-sm hover:border-slate-300"
                                    autoComplete="current-password"
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
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

                        {/* Submit Button */}
                        <Button 
                            type="submit" 
                            className="w-full h-13 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300 group"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gradient-to-br from-slate-50 via-white to-teal-50/30 text-slate-500">
                                New to HealthTrack+?
                            </span>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <a 
                        href="/accounts/register/" 
                        className="flex items-center justify-center w-full h-13 border-2 border-slate-200 hover:border-teal-500 rounded-xl text-slate-700 hover:text-teal-600 font-semibold transition-all duration-300 group bg-white hover:bg-teal-50/50"
                    >
                        Create an account
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>

                    {/* Footer */}
                    <p className="mt-10 text-center text-sm text-slate-500">
                        © 2026 HealthTrack+. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right: Visual Section */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                
                {/* Animated Gradient Orbs */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                
                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }} />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-16">
                    {/* Top Section */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-sm font-medium text-white/90">Trusted by 50,000+ users</span>
                        </div>
                        
                        <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                            Your Health,
                            <br />
                            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                Reimagined.
                            </span>
                        </h2>
                        
                        <p className="text-lg text-slate-300 max-w-md leading-relaxed">
                            Experience the future of personal health management with AI-powered insights, secure medical records, and seamless care coordination.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="space-y-4">
                        {[
                            { icon: Activity, label: "Real-time Health Analytics", color: "from-teal-500 to-emerald-500" },
                            { icon: Shield, label: "Bank-grade Data Security", color: "from-cyan-500 to-blue-500" },
                            { icon: Heart, label: "Personalized Wellness Plans", color: "from-rose-500 to-pink-500" },
                        ].map((feature, index) => (
                            <div 
                                key={index}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-default"
                            >
                                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-white font-medium text-lg">{feature.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Quote */}
                    <div className="pt-8 border-t border-white/10">
                        <p className="text-slate-400 italic">
                            "HealthTrack+ transformed how I manage my family's health records."
                        </p>
                        <p className="text-white font-medium mt-2">— Dr. Sarah Chen, Family Physician</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
