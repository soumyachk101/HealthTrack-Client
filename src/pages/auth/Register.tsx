import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCookie } from "@/lib/csrf"
import { Loader2, CheckCircle2, User, Mail, MapPin, Lock, Eye, EyeOff, ArrowRight, Sparkles, Shield, Zap, Users } from "lucide-react"

export default function Register() {
    const [isLoading, setIsLoading] = useState(false)
    const [csrfToken, setCsrfToken] = useState<string>("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)
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

    const handleSubmit = () => {
        setIsLoading(true)
    }

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

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
            {/* Left: Form Section */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-8 relative overflow-y-auto">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-[0.015]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />

                <div className="w-full max-w-xl mx-auto relative z-10">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">
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
                            Create your account
                        </h1>
                        <p className="text-slate-500 text-lg">
                            Start your journey to better health management
                        </p>
                    </div>

                    {/* Form */}
                    <form method="POST" action="/accounts/register/" onSubmit={handleSubmit} className="space-y-5">
                        <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name" className="text-sm font-semibold text-slate-700">
                                    First Name
                                </Label>
                                <div className="relative">
                                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'first_name' ? 'text-teal-500' : 'text-slate-400'}`}>
                                        <User className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        placeholder="John"
                                        required
                                        className="h-12 pl-12 pr-4 bg-white border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500/20 focus:ring-4 transition-all duration-200 shadow-sm hover:border-slate-300"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('first_name')}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name" className="text-sm font-semibold text-slate-700">
                                    Last Name
                                </Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    placeholder="Doe"
                                    required
                                    className="h-12 px-4 bg-white border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500/20 focus:ring-4 transition-all duration-200 shadow-sm hover:border-slate-300"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-sm font-semibold text-slate-700">
                                Username
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="johndoe123"
                                required
                                className="h-12 px-4 bg-white border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500/20 focus:ring-4 transition-all duration-200 shadow-sm hover:border-slate-300"
                                autoComplete="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                                Email Address
                            </Label>
                            <div className="relative">
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'email' ? 'text-teal-500' : 'text-slate-400'}`}>
                                    <Mail className="h-5 w-5" />
                                </div>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    required
                                    className="h-12 pl-12 pr-4 bg-white border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500/20 focus:ring-4 transition-all duration-200 shadow-sm hover:border-slate-300"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </div>
                        </div>

                        {/* State */}
                        <div className="space-y-2">
                            <Label htmlFor="state" className="text-sm font-semibold text-slate-700">
                                State
                            </Label>
                            <div className="relative">
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'state' ? 'text-teal-500' : 'text-slate-400'}`}>
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <select
                                    id="state"
                                    name="state"
                                    required
                                    className="flex h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 py-2 text-sm text-slate-900 shadow-sm hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
                                    value={formData.state}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('state')}
                                    onBlur={() => setFocusedField(null)}
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
                        </div>

                        {/* Password Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                                    Password
                                </Label>
                                <div className="relative">
                                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'password' ? 'text-teal-500' : 'text-slate-400'}`}>
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        className="h-12 pl-12 pr-12 bg-white border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500/20 focus:ring-4 transition-all duration-200 shadow-sm hover:border-slate-300"
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
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
                                <Label htmlFor="password2" className="text-sm font-semibold text-slate-700">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password2"
                                        name="password2"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        className="h-12 pl-4 pr-12 bg-white border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500/20 focus:ring-4 transition-all duration-200 shadow-sm hover:border-slate-300"
                                        autoComplete="new-password"
                                        value={formData.password2}
                                        onChange={handleChange}
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

                        {/* Terms Checkbox */}
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

                        {/* Submit Button */}
                        <Button 
                            type="submit" 
                            className="w-full h-13 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300 group mt-2"
                            disabled={isLoading}
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

                    {/* Sign In Link */}
                    <p className="mt-8 text-center text-slate-600">
                        Already have an account?{" "}
                        <a href="/accounts/login/" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">
                            Sign in
                        </a>
                    </p>

                    {/* Footer */}
                    <p className="mt-6 text-center text-sm text-slate-500">
                        © 2026 HealthTrack+. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right: Visual Section */}
            <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden">
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
                <div className="relative z-10 flex flex-col justify-center h-full p-12 xl:p-16">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8 w-fit">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-sm font-medium text-white/90">Join 50,000+ users today</span>
                    </div>
                    
                    <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                        Start Your
                        <br />
                        <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                            Health Journey
                        </span>
                    </h2>
                    
                    <p className="text-lg text-slate-300 max-w-md leading-relaxed mb-10">
                        Join thousands who have transformed their health management with our comprehensive platform.
                    </p>

                    {/* Feature Cards */}
                    <div className="space-y-4">
                        {[
                            { icon: Zap, title: "Smart Tracking", desc: "AI-powered health insights", color: "from-amber-500 to-orange-500" },
                            { icon: Shield, title: "Secure Storage", desc: "Bank-grade encryption", color: "from-cyan-500 to-blue-500" },
                            { icon: Users, title: "Family Health", desc: "Manage profiles for loved ones", color: "from-violet-500 to-purple-500" },
                        ].map((feature, index) => (
                            <div 
                                key={index}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                            >
                                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">{feature.title}</h3>
                                    <p className="text-slate-400 text-sm">{feature.desc}</p>
                                </div>
                                <CheckCircle2 className="h-5 w-5 text-emerald-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-6">
                        {[
                            { value: "50K+", label: "Active Users" },
                            { value: "99.9%", label: "Uptime" },
                            { value: "4.9★", label: "User Rating" },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <div className="text-sm text-slate-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
