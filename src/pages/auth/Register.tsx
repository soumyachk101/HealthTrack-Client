
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCookie } from "@/lib/csrf"
import { Loader2, CheckCircle2, User, Mail, MapPin, Lock, Eye, EyeOff, ArrowRight, Sparkles, Shield, Zap, Users, Stethoscope, Building2 } from "lucide-react"

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
        password2: "",
        role: "patient" // Default role
    })

    useEffect(() => {
        const token = getCookie("csrftoken")
        if (token) setCsrfToken(token)

        // Check for role in URL
        const searchParams = new URLSearchParams(window.location.search);
        const roleParam = searchParams.get('role');
        if (roleParam && ['patient', 'doctor', 'provider'].includes(roleParam)) {
            setFormData(prev => ({ ...prev, role: roleParam }));
        }
    }, [])

    const handleSubmit = () => {
        setIsLoading(true)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const setRole = (role: string) => {
        setFormData(prev => ({ ...prev, role }))
    }

    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
        "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh", "Chandigarh",
        "Puducherry", "Andaman & Nicobar", "Lakshadweep", "Dadra & Nagar Haveli"
    ]

    const getRoleTitle = () => {
        switch (formData.role) {
            case 'doctor': return "Doctor Registration"
            case 'provider': return "Provider Registration"
            default: return "Create Account"
        }
    }

    return (
        <div className="min-h-screen flex bg-[#FAFAFA] text-slate-900 font-sans selection:bg-teal-500/30 overflow-hidden">
            {/* Left: Form Section */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-8 relative overflow-y-auto h-screen scrollbar-hide">
                <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"></div>

                <div className="w-full max-w-xl mx-auto relative z-10 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        {/* Role Switcher */}
                        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl mb-6 w-full max-w-[400px]">
                            <button
                                type="button"
                                onClick={() => setRole('patient')}
                                className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${formData.role === 'patient' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <User className="h-4 w-4" />
                                Patient
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('doctor')}
                                className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${formData.role === 'doctor' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Stethoscope className="h-4 w-4" />
                                Doctor
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('provider')}
                                className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${formData.role === 'provider' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Building2 className="h-4 w-4" />
                                Provider
                            </button>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg shadow-slate-900/20">
                                <Sparkles className="h-5 w-5 text-teal-400" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">HealthTrack+</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">
                            {getRoleTitle()}
                        </h1>
                        <p className="text-slate-500 font-mono text-xs uppercase tracking-wider">
                            Enter your details to register
                        </p>
                    </div>

                    {/* Form */}
                    <form method="POST" action="/accounts/register/" onSubmit={handleSubmit} className="space-y-5">
                        <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
                        <input type="hidden" name="role" value={formData.role} />

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name" className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                                    First Name
                                </Label>
                                <div className="relative group">
                                    <div className="absolute transition-all duration-300 opacity-0 group-focus-within:opacity-100 -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg blur opacity-20 group-hover:opacity-100"></div>
                                    <div className="relative flex items-center bg-white rounded-lg border border-slate-200 shadow-sm">
                                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'first_name' ? 'text-teal-500' : 'text-slate-400'}`}>
                                            <User className="h-4 w-4" />
                                        </div>
                                        <Input
                                            id="first_name"
                                            name="first_name"
                                            required
                                            className="h-12 pl-10 pr-4 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-slate-900 placeholder:text-slate-300"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('first_name')}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name" className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                                    Last_Name
                                </Label>
                                <div className="relative group">
                                    <div className="absolute transition-all duration-300 opacity-0 group-focus-within:opacity-100 -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg blur opacity-20 group-hover:opacity-100"></div>
                                    <div className="relative flex items-center bg-white rounded-lg border border-slate-200 shadow-sm">
                                        <Input
                                            id="last_name"
                                            name="last_name"
                                            required
                                            className="h-12 px-4 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-slate-900 placeholder:text-slate-300"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                                Username_ID
                            </Label>
                            <div className="relative group">
                                <div className="absolute transition-all duration-300 opacity-0 group-focus-within:opacity-100 -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg blur opacity-20 group-hover:opacity-100"></div>
                                <div className="relative flex items-center bg-white rounded-lg border border-slate-200 shadow-sm">
                                    <Input
                                        id="username"
                                        name="username"
                                        required
                                        className="h-12 px-4 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-slate-900 placeholder:text-slate-300"
                                        autoComplete="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                                Email_Address
                            </Label>
                            <div className="relative group">
                                <div className="absolute transition-all duration-300 opacity-0 group-focus-within:opacity-100 -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg blur opacity-20 group-hover:opacity-100"></div>
                                <div className="relative flex items-center bg-white rounded-lg border border-slate-200 shadow-sm">
                                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'email' ? 'text-teal-500' : 'text-slate-400'} `}>
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        required
                                        className="h-12 pl-10 pr-4 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-slate-900 placeholder:text-slate-300"
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* State */}
                        <div className="space-y-2">
                            <Label htmlFor="state" className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                                Region_State
                            </Label>
                            <div className="relative group">
                                <div className="absolute transition-all duration-300 opacity-0 group-focus-within:opacity-100 -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg blur opacity-20 group-hover:opacity-100"></div>
                                <div className="relative flex items-center bg-white rounded-lg border border-slate-200 shadow-sm">
                                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'state' ? 'text-teal-500' : 'text-slate-400'} `}>
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <select
                                        id="state"
                                        name="state"
                                        required
                                        className="flex h-12 w-full rounded-lg border-0 bg-transparent pl-10 pr-4 py-2 text-sm text-slate-900 focus:ring-0 focus:outline-none appearance-none cursor-pointer"
                                        value={formData.state}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('state')}
                                        onBlur={() => setFocusedField(null)}
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 12px center',
                                            backgroundSize: '16px'
                                        }}
                                    >
                                        <option value="">Select Region</option>
                                        {indianStates.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Password Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                                    Password
                                </Label>
                                <div className="relative group">
                                    <div className="absolute transition-all duration-300 opacity-0 group-focus-within:opacity-100 -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg blur opacity-20 group-hover:opacity-100"></div>
                                    <div className="relative flex items-center bg-white rounded-lg border border-slate-200 shadow-sm">
                                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'password' ? 'text-teal-500' : 'text-slate-400'} `}>
                                            <Lock className="h-4 w-4" />
                                        </div>
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            placeholder="••••••••"
                                            className="h-12 pl-10 pr-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-slate-900 placeholder:text-slate-300"
                                            autoComplete="new-password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password2" className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                                    Confirm
                                </Label>
                                <div className="relative group">
                                    <div className="absolute transition-all duration-300 opacity-0 group-focus-within:opacity-100 -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg blur opacity-20 group-hover:opacity-100"></div>
                                    <div className="relative flex items-center bg-white rounded-lg border border-slate-200 shadow-sm">
                                        <Input
                                            id="password2"
                                            name="password2"
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            placeholder="••••••••"
                                            className="h-12 pl-4 pr-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-slate-900 placeholder:text-slate-300"
                                            autoComplete="new-password"
                                            value={formData.password2}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-3 pt-2">
                            <div className="relative flex items-center h-5">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/20"
                                />
                            </div>
                            <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
                                By continuing, you acknowledge that you have read and understood, and agree to the <a href="#" className="text-teal-600 font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-teal-600 font-bold hover:underline">Privacy Policy</a>.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-lg shadow-teal-900/10 hover:shadow-teal-500/20 transition-all duration-300 group overflow-hidden relative mt-4"
                            disabled={isLoading}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    CREATE ACCOUNT <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Sign In Link */}
                    <p className="mt-8 text-center text-slate-500 text-sm">
                        Already have an account?{" "}
                        <a href="/accounts/login/" className="text-teal-600 font-bold hover:text-teal-700 transition-colors hover:underline">
                            Login
                        </a>
                    </p>
                </div>
            </div>

            {/* Right: Visual Section */}
            <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden bg-slate-900 text-slate-300">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid opacity-[0.05] pointer-events-none"></div>

                {/* Visuals */}
                <div className="absolute top-[20%] right-[10%] w-[50vh] h-[50vh] bg-teal-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[20%] left-[10%] w-[50vh] h-[50vh] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 w-full h-full flex flex-col justify-center px-16 xl:px-24">
                    <div className="mb-10">
                        {/* Badge Removed */}
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                        Join the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">HealthTrack+ Network.</span>
                    </h2>

                    {/* Mini Bento Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/80 transition-colors">
                            <Zap className="h-6 w-6 text-yellow-400 mb-4" />
                            <h3 className="text-white font-bold mb-1">Smart Tracking</h3>
                            <p className="text-xs text-slate-400">AI-powered analytics for real-time health insights.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/80 transition-colors">
                            <Shield className="h-6 w-6 text-emerald-400 mb-4" />
                            <h3 className="text-white font-bold mb-1">Bank-Grade</h3>
                            <p className="text-xs text-slate-400">AES-256 encryption for all storage buckets.</p>
                        </div>
                        <div className="col-span-2 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">Family Protocol</h3>
                                <p className="text-xs text-slate-400">Manage up to 5 sub-accounts.</p>
                            </div>
                            <div className="ml-auto">
                                <CheckCircle2 className="h-5 w-5 text-teal-500" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-800 flex justify-between text-xs font-mono text-slate-500">
                        <span>SYSTEM: SECURE</span>
                        <span>HIPAA COMPLIANT</span>
                        <span>ENCRYPTED</span>
                    </div>

                </div>
            </div>
        </div >
    )
}
