
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCookie } from "@/lib/csrf"
import { Loader2, User, Mail, MapPin, Lock, Eye, EyeOff, ArrowRight, Sparkles, Shield, Zap, Users, Stethoscope, Building2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

export default function Register() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [csrfToken, setCsrfToken] = useState<string>("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
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

    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        if (formData.password !== formData.password2) {
            setError("Passwords do not match")
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch(`${API_URL}/accounts/api/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    role: formData.role
                })
            })

            const data = await response.json()

            if (data.success) {
                if (data.otp_required) {
                    localStorage.setItem('verification_email', formData.email)
                    navigate('/verify-otp')
                    return
                }
                // Store token if needed
                localStorage.setItem('token', data.token)
                navigate('/dashboard')
            } else {
                setError(data.error || "Registration failed")
            }
        } catch (err) {
            setError("Network error. Please try again.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
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
        <div className="min-h-screen flex bg-[#EFF6FF] text-slate-700 font-sans selection:bg-teal-200 selection:text-teal-900 overflow-hidden">
            {/* TEXTURE OVERLAY */}
            <div className="bg-texture"></div>

            {/* Left: Form Section */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-16 xl:px-24 py-8 relative overflow-y-auto h-screen scrollbar-hide z-10">

                <div className="w-full max-w-xl mx-auto py-8">
                    {/* Header */}
                    <div className="mb-8">
                        {/* Role Switcher */}
                        <div className="grid grid-cols-3 gap-3 p-2 rounded-2xl bg-[#EFF6FF] shadow-skeuo-inset-sm mb-8 border border-white/50 w-full max-w-[400px]">
                            {(['patient', 'doctor', 'provider'] as const).map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-xs font-bold transition-all duration-200 uppercase tracking-wide",
                                        formData.role === r
                                            ? "bg-[#EFF6FF] text-teal-600 shadow-skeuo-sm scale-[0.98] border border-white/60"
                                            : "text-slate-400 hover:text-slate-600 hover:bg-[#EFF6FF]/50"
                                    )}
                                >
                                    {r === 'patient' && <User className="h-4 w-4" />}
                                    {r === 'doctor' && <Stethoscope className="h-4 w-4" />}
                                    {r === 'provider' && <Building2 className="h-4 w-4" />}
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 bg-[#EFF6FF] rounded-xl flex items-center justify-center shadow-skeuo-sm border border-white text-teal-500">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-black text-slate-800 tracking-tighter">HealthTrack+</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
                            {getRoleTitle()}
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">
                            Enter your details to register for the unified health network.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2">
                                <Shield className="h-4 w-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                        <input type="hidden" name="role" value={formData.role} />

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    First Name
                                </Label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        required
                                        className="input-skeuo pl-10"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Last Name
                                </Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    required
                                    className="input-skeuo px-4"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                Username
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                required
                                className="input-skeuo px-4"
                                autoComplete="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                Email Address
                            </Label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="input-skeuo pl-10"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* State */}
                        <div className="space-y-2">
                            <Label htmlFor="state" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                Region / State
                            </Label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <MapPin className="h-4 w-4" />
                                </div>
                                <select
                                    id="state"
                                    name="state"
                                    required
                                    className="flex h-12 w-full rounded-xl border-none bg-input shadow-skeuo-inset-md pl-10 pr-4 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-teal-500/50 appearance-none cursor-pointer outline-none transition-shadow"
                                    value={formData.state}
                                    onChange={handleChange}
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

                        {/* Password Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Password
                                </Label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="input-skeuo pl-10 pr-10"
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={handleChange}
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
                            <div className="space-y-2">
                                <Label htmlFor="password2" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Confirm
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password2"
                                        name="password2"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        className="input-skeuo px-4 pr-10"
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

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-3 pt-2 ml-1">
                            <div className="relative flex items-center h-5">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="peer h-4 w-4 appearance-none rounded border-0 bg-[#EFF6FF] shadow-skeuo-inset-sm checked:bg-teal-500 checked:shadow-skeuo-sm transition-all cursor-pointer"
                                />
                                <CheckIcon className="absolute w-3 h-3 left-0.5 top-0.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                            </div>
                            <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed cursor-pointer select-none">
                                By continuing, you agree to the <a href="#" className="text-teal-600 font-bold hover:underline">Terms of Service</a>.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full btn-skeuo-primary h-14 mt-6 text-lg shadow-skeuo-md hover:shadow-skeuo-floating"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Create Account <ArrowRight className="ml-2 h-5 w-5" />
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Sign In Link */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            Already have an account?{" "}
                            <Link to="/login" className="text-teal-600 font-bold hover:underline decoration-2 underline-offset-4">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right: Visual Section */}
            <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-[#EFF6FF] items-center justify-center border-l border-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"></div>

                {/* Visuals */}
                <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute bottom-[10%] left-[10%] w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="relative z-10 w-full max-w-md p-10">
                    <h2 className="text-5xl font-black text-slate-800 mb-8 leading-tight">
                        Join the <br />
                        <span className="text-teal-600">Network.</span>
                    </h2>

                    {/* Mini Bento Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        <div className="card-skeuo p-6 flex items-start gap-4">
                            <div className="h-12 w-12 rounded-xl bg-[#EFF6FF] shadow-skeuo-sm flex items-center justify-center text-yellow-500">
                                <Zap className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-slate-800 font-bold text-lg mb-1">Smart Tracking</h3>
                                <p className="text-sm text-slate-500">AI-powered analytics for real-time health insights.</p>
                            </div>
                        </div>

                        <div className="card-skeuo p-6 flex items-start gap-4">
                            <div className="h-12 w-12 rounded-xl bg-[#EFF6FF] shadow-skeuo-sm flex items-center justify-center text-emerald-500">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-slate-800 font-bold text-lg mb-1">Bank-Grade Security</h3>
                                <p className="text-sm text-slate-500">AES-256 encryption for all your medical data.</p>
                            </div>
                        </div>

                        <div className="card-skeuo p-6 flex items-start gap-4">
                            <div className="h-12 w-12 rounded-xl bg-[#EFF6FF] shadow-skeuo-sm flex items-center justify-center text-blue-500">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-slate-800 font-bold text-lg mb-1">Family Protocol</h3>
                                <p className="text-sm text-slate-500">Manage up to 5 sub-accounts effortlessly.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-between text-[10px] font-bold font-mono text-slate-400 tracking-widest uppercase">
                        <span>System: Secure</span>
                        <span>HIPAA Compliant</span>
                    </div>
                </div>
            </div>
        </div >
    )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    )
}
