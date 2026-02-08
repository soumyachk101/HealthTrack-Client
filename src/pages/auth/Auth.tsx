import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCookie } from "@/lib/csrf"
import { Loader2, Sparkles, CheckCircle2, Eye, EyeOff, Mail, Lock, User, MapPin, ArrowRight, Activity, Shield, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

type AuthMode = "login" | "register"

export default function Auth() {
    const [mode, setMode] = useState<AuthMode>(() => {
        const path = window.location.pathname
        return path.includes('register') ? 'register' : 'login'
    })
    const [isLoading, setIsLoading] = useState(false)
    const [csrfToken, setCsrfToken] = useState<string>("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Form Data
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        state: "",
        password: "",
        password2: ""
    })

    useEffect(() => {
        const token = getCookie("csrftoken")
        if (token) setCsrfToken(token)
    }, [])

    const handleSubmit = () => setIsLoading(true)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
        "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh", "Chandigarh",
        "Puducherry", "Andaman & Nicobar", "Lakshadweep", "Dadra & Nagar Haveli"
    ]

    const role = new URLSearchParams(window.location.search).get('role')
    const roleTitle = role
        ? `${role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Login`
        : 'Welcome back'

    useEffect(() => {
        document.title = `${roleTitle} | HealthTrack+`
    }, [roleTitle])

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
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            HealthTrack+
                        </span>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
                            {mode === 'login' ? roleTitle : 'Create your account'}
                        </h1>
                        <p className="text-slate-500 text-lg">
                            {mode === 'login'
                                ? 'Sign in to continue managing your health journey'
                                : 'Start your journey to better health management'}
                        </p>
                    </div>

                    {/* Mode Toggle Tabs */}
                    <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-xl mb-8">
                        <button
                            onClick={() => setMode('login')}
                            className={cn(
                                "py-3 text-sm font-semibold rounded-lg transition-all duration-300",
                                mode === 'login'
                                    ? "bg-white text-teal-600 shadow-md"
                                    : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setMode('register')}
                            className={cn(
                                "py-3 text-sm font-semibold rounded-lg transition-all duration-300",
                                mode === 'register'
                                    ? "bg-white text-teal-600 shadow-md"
                                    : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Forms */}
                    {mode === 'login' ? (
                        <form method="POST" action="/accounts/login/" onSubmit={handleSubmit} className="space-y-6">
                            <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-teal-500" />
                                    Email or Username
                                </Label>
                                <Input
                                    name="username"
                                    required
                                    placeholder="Enter your email or username"
                                    className="h-13 px-4 bg-white border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500/20 focus:ring-4 transition-all duration-200 shadow-sm hover:border-slate-300"
                                    
                                    
                                />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-teal-500" />
                                        Password
                                    </Label>
                                    <a href="/accounts/password_reset/" className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="Enter your password"
                                        className="h-13 px-4 pr-12 bg-white border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500/20 focus:ring-4 transition-all duration-200 shadow-sm hover:border-slate-300"
                                        
                                        
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

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-13 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300 group"
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
                    ) : (
                        <form method="POST" action="/accounts/register/" onSubmit={handleSubmit} className="space-y-5">
                            <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
                            {role && <input type="hidden" name="role" value={role} />}

                            {/* Name Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <User className="h-4 w-4 text-teal-500" />
                                        First Name
                                    </Label>
                                    <Input
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="First name"
                                        className="h-12 px-4 bg-white border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500/20 focus:ring-4 transition-all duration-200 shadow-sm hover:border-slate-300"
                                        
                                        
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Last Name</Label>
                                    <Input
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Last name"
                                        className="h-12 px-4 bg-white border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500/20 focus:ring-4 transition-all duration-200 shadow-sm hover:border-slate-300"
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Username</Label>
                                <Input
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    placeholder="Choose a username"
                                    className="h-12 px-4 bg-white border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500/20 focus:ring-4 transition-all duration-200 shadow-sm hover:border-slate-300"
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-teal-500" />
                                    Email
                                </Label>
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email"
                                    className="h-12 px-4 bg-white border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500/20 focus:ring-4 transition-all duration-200 shadow-sm hover:border-slate-300"
                                    
                                    
                                />
                            </div>

                            {/* Role Specific Fields */}
                            {role === 'doctor' && (
                                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">Specialization</Label>
                                        <Input
                                            name="specialization"
                                            placeholder="e.g. Cardiologist"
                                            className="h-12 px-4 bg-blue-50/50 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4 transition-all duration-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">Medical Reg. No</Label>
                                        <Input
                                            name="registration_number"
                                            placeholder="MCI-12345"
                                            className="h-12 px-4 bg-blue-50/50 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4 transition-all duration-200"
                                        />
                                    </div>
                                </div>
                            )}

                            {role === 'service_provider' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">Business Name</Label>
                                        <Input
                                            name="business_name"
                                            placeholder="Your Business/Organization Name"
                                            required
                                            className="h-12 px-4 bg-emerald-50/50 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition-all duration-200"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-slate-700">Service Type</Label>
                                            <select
                                                name="provider_type"
                                                required
                                                className="flex h-12 w-full rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200"
                                            >
                                                <option value="pharmacy">Pharmacy</option>
                                                <option value="lab">Lab / Diagnostic</option>
                                                <option value="hospital">Hospital</option>
                                                <option value="clinic">Clinic</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-slate-700">License Number</Label>
                                            <Input
                                                name="license_number"
                                                placeholder="LIC-98765"
                                                className="h-12 px-4 bg-emerald-50/50 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* State */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-teal-500" />
                                    State
                                </Label>
                                <select
                                    name="state"
                                    required
                                    value={formData.state}
                                    onChange={handleChange}
                                    
                                    
                                    className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 12px center',
                                        backgroundSize: '20px'
                                    }}
                                >
                                    <option value="">Select State</option>
                                    {indianStates.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Password Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-teal-500" />
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="••••••••"
                                            className="h-12 px-4 pr-12 bg-white border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500/20 focus:ring-4 transition-all duration-200 shadow-sm hover:border-slate-300"
                                            
                                            
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Confirm</Label>
                                    <div className="relative">
                                        <Input
                                            name="password2"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.password2}
                                            onChange={handleChange}
                                            required
                                            placeholder="••••••••"
                                            className="h-12 pl-4 pr-12 bg-white border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500/20 focus:ring-4 transition-all duration-200 shadow-sm hover:border-slate-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="mt-1 h-5 w-5 rounded border-slate-300 text-teal-500 focus:ring-teal-500 cursor-pointer"
                                />
                                <label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                                    I agree to the <a href="#" className="text-teal-600 font-medium hover:text-teal-700 hover:underline">Terms of Service</a> and <a href="#" className="text-teal-600 font-medium hover:text-teal-700 hover:underline">Privacy Policy</a>
                                </label>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-13 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300 group"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    )}

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
                            Healthcare
                            <br />
                            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                Reimagined.
                            </span>
                        </h2>

                        <p className="text-lg text-slate-300 max-w-md leading-relaxed">
                            Experience the future of personal health management with AI-powered insights and secure medical records.
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
                                <CheckCircle2 className="h-5 w-5 text-emerald-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
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
