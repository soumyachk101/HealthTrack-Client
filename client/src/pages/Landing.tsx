import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Activity, CheckCircle2, ArrowRight, Menu, X, Pill, Brain, FileText, Smartphone, Heart, Moon, User, Stethoscope, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Landing() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'service_provider' | null>(null)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const features = [
        {
            icon: Activity,
            title: "Comprehensive Tracking",
            desc: "Monitor blood pressure, sugar levels, weight, and heart rate with medical-grade precision."
        },
        {
            icon: Pill,
            title: "Smart Medication",
            desc: "Never miss a dose with intelligent reminders and automated refill alerts."
        },
        {
            icon: Brain,
            title: "Mental Wellness",
            desc: "Track mood patterns and get personalized insights for better mental health."
        },
        {
            icon: FileText,
            title: "Digital Records",
            desc: "Securely store and share prescriptions and lab reports with your doctors."
        }
    ]

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
            {/* Navbar */}
            <nav className={cn(
                "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
                scrolled ? "bg-white/80 backdrop-blur-md border-border py-4 shadow-sm" : "bg-transparent border-transparent py-6"
            )}>
                <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-xl flex items-center justify-center">
                            <img src="/logo.svg" alt="HealthTrack Logo" className="h-9 w-9" />
                        </div>
                        <span className="text-xl font-bold text-foreground tracking-tight">
                            HealthTrack
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>

                        {/* Explicit Login Buttons */}
                        <div className="flex items-center gap-4 border-r border-border pr-6 mr-2">
                            <Link to="/login?role=patient" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Patient
                            </Link>
                            <Link to="/login?role=doctor" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                                <Stethoscope className="h-4 w-4" />
                                Doctor
                            </Link>
                            <Link to="/login?role=service_provider" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                Provider
                            </Link>
                        </div>

                        <Link to="/register" className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 py-2 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all hover:bg-teal-500 hover:-translate-y-0.5 active:translate-y-0">
                            Get Started
                        </Link>
                    </div>

                    <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border-b border-border p-4 md:hidden flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-5">
                        <div className="flex flex-col gap-2 border-b border-border pb-2 mb-2">
                            <div className="text-xs font-semibold text-muted-foreground px-2">Menu</div>
                            <a href="#" className="px-2 py-2 text-foreground hover:bg-muted rounded-lg transition-colors">Find Doctors</a>
                            <a href="#" className="px-2 py-2 text-foreground hover:bg-muted rounded-lg transition-colors">Lab Tests</a>
                            <a href="#" className="px-2 py-2 text-foreground hover:bg-muted rounded-lg transition-colors">Articles</a>
                        </div>
                        <div className="flex flex-col gap-2 border-b border-border pb-2 mb-2">
                            <div className="text-xs font-semibold text-muted-foreground px-2">Professional Access</div>
                            <Link to="/login?role=doctor" className="flex items-center gap-2 px-2 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                                <Stethoscope className="h-4 w-4" /> For Doctors
                            </Link>
                            <Link to="/login?role=service_provider" className="flex items-center gap-2 px-2 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                                <Briefcase className="h-4 w-4" /> For Providers
                            </Link>
                        </div>
                        <Link to="/login?role=patient" className="block w-full py-2 text-center bg-primary text-white rounded-lg font-medium shadow-md">Log In / Sign Up</Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] animate-pulse delay-1000" />
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.2]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2360A5FA' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
                    }} />
                </div>

                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-8">

                        {/* Pill Label */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border shadow-sm text-foreground/80 text-sm font-medium animate-fade-in-up hover:border-primary/30 transition-colors cursor-default">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            <span>#1 Healthcare Management Platform</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-1.1 text-foreground">
                            Your Complete <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary animate-gradient-x">Health Journey</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Take control of your wellbeing with advanced tracking, AI-powered insights,
                            and secure medical records—all in one beautiful platform.
                        </p>

                        {/* User Type Toggle and Auth Buttons */}
                        <div className="flex flex-col items-center gap-6 pt-8">
                            {/* Toggle/Segmented Control for User Types */}
                            <div className="inline-flex items-center gap-1 p-1 bg-muted/50 rounded-lg border border-border">
                                <button
                                    onClick={() => setSelectedRole('patient')}
                                    className={cn(
                                        "px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                                        selectedRole === 'patient'
                                            ? "bg-white text-primary shadow-sm"
                                            : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                                    )}
                                >
                                    For Patients
                                </button>
                                <button
                                    onClick={() => setSelectedRole('doctor')}
                                    className={cn(
                                        "px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                                        selectedRole === 'doctor'
                                            ? "bg-white text-primary shadow-sm"
                                            : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                                    )}
                                >
                                    For Doctors
                                </button>
                                <button
                                    onClick={() => setSelectedRole('service_provider')}
                                    className={cn(
                                        "px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                                        selectedRole === 'service_provider'
                                            ? "bg-white text-primary shadow-sm"
                                            : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                                    )}
                                >
                                    For Providers
                                </button>
                            </div>

                            {/* Sign Up / Sign In Buttons - Show when role is selected */}
                            {selectedRole && (
                                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                                    <Link
                                        to={`/register?role=${selectedRole}`}
                                        className="px-6 py-2.5 rounded-lg bg-primary hover:bg-teal-500 text-white font-semibold text-sm shadow-md shadow-primary/20 transition-all hover:shadow-lg"
                                    >
                                        Sign Up
                                    </Link>
                                    <Link
                                        to={`/login?role=${selectedRole}`}
                                        className="px-6 py-2.5 rounded-lg bg-white hover:bg-muted border border-border text-foreground font-medium text-sm transition-all"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            )}

                            {/* Default Sign Up / Sign In Button - Show when no role selected */}
                            {!selectedRole && (
                                <Link
                                    to="/register"
                                    className="px-8 py-3 rounded-xl bg-primary hover:bg-teal-500 text-white font-semibold text-base shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30"
                                >
                                    Sign Up / Sign In
                                </Link>
                            )}
                        </div>

                        {/* Trust Badges */}
                        <div className="pt-10 flex flex-wrap items-center justify-center gap-6 md:gap-12 text-muted-foreground border-t border-border/60 mt-12 w-full max-w-3xl">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-primary" />
                                <span className="text-sm font-semibold text-foreground/80">HIPAA Compliant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-secondary" />
                                <span className="text-sm font-semibold text-foreground/80">Expert Verified</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-accent" />
                                <span className="text-sm font-semibold text-foreground/80">Mobile Ready</span>
                            </div>
                        </div>

                        {/* Mock Dashboard Graphic */}
                        <div className="relative w-full max-w-4xl mt-16 perspective-1000">
                            <div className="relative rounded-2xl bg-white border border-border shadow-2xl shadow-primary/10 overflow-hidden transform rotate-x-12 transition-transform hover:rotate-0 duration-700 ease-out">
                                {/* Mock Header */}
                                <div className="h-14 border-b border-border flex items-center px-6 gap-4 bg-muted/30">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="h-2 w-32 bg-border rounded-full"></div>
                                </div>
                                {/* Mock Content */}
                                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/10">
                                    {/* Card 1 */}
                                    <div className="p-6 bg-white rounded-xl border border-border shadow-sm flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Activity className="w-5 h-5" /></div>
                                            <div className="text-xs font-semibold text-accent-foreground bg-accent px-2 py-1 rounded-full">+2.4%</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-muted-foreground mb-1">Blood Pressure</div>
                                            <div className="text-2xl font-bold text-foreground">118/75 <span className="text-sm font-normal text-muted-foreground">mmHg</span></div>
                                        </div>
                                    </div>
                                    {/* Card 2 */}
                                    <div className="p-6 bg-white rounded-xl border border-border shadow-sm flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary"><Moon className="w-5 h-5" /></div>
                                            <div className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">Optimal</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-muted-foreground mb-1">Sleep Duration</div>
                                            <div className="text-2xl font-bold text-foreground">8h 12m</div>
                                        </div>
                                    </div>
                                    {/* Card 3 */}
                                    <div className="p-6 bg-white rounded-xl border border-border shadow-sm flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-primary"><Heart className="w-5 h-5" /></div>
                                            <div className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">Resting</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-muted-foreground mb-1">Heart Rate</div>
                                            <div className="text-2xl font-bold text-foreground">72 <span className="text-sm font-normal text-muted-foreground">bpm</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 relative bg-white border-y border-border">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <div className="inline-block mb-4">
                            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">Features</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Everything you need</h2>
                        <p className="text-muted-foreground text-lg">Powerful features designed to make health management effortless and effective.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, idx) => (
                            <div key={idx} className="group p-8 rounded-2xl bg-muted/30 border border-border hover:bg-white hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="h-12 w-12 rounded-xl bg-white border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-300 shadow-sm">
                                    <feature.icon className="w-6 h-6 text-foreground group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-background">
                    <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto p-12 rounded-3xl bg-foreground text-white text-center shadow-2xl shadow-primary/20 relative overflow-hidden">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary rounded-full blur-[80px] opacity-20 animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-secondary rounded-full blur-[80px] opacity-20 animate-pulse delay-700"></div>

                        <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to transform your health?</h2>
                        <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto relative z-10">
                            Join the fastest growing health management platform today. No credit card required.
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-foreground font-bold hover:bg-primary hover:text-white transition-all relative z-10 hover:shadow-lg hover:shadow-white/10 hover:-translate-y-0.5"
                        >
                            Create Free Account
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-border bg-white text-muted-foreground">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                                <img src="/logo.svg" alt="HealthTrack Logo" className="h-8 w-8" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-foreground leading-none">HealthTrack</span>
                                <span className="text-[10px] text-muted-foreground font-semibold">Medical Suite</span>
                            </div>
                        </div>
                        <div className="flex gap-8 text-sm font-medium">
                            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">
                            © 2026 HealthTrack+. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
