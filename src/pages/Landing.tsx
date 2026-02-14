import { useEffect, useState, useRef } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
    Shield, Activity, ArrowRight, Pill, Brain
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, useTransform, useSpring, useMotionValue } from 'framer-motion'

// --- Magnetic Button Component ---
const MagneticButton = ({ children, className, onClick }: { children: ReactNode, className?: string, onClick?: () => void }) => {
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        x.set((clientX - centerX) * 0.2); // Magnetic strength
        y.set((clientY - centerY) * 0.2);
    }

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.button
            ref={ref}
            className={className}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x, y }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        >
            {children}
        </motion.button>
    );
}

// --- Card Stack Item ---


export default function Landing() {
    const [scrolled, setScrolled] = useState(false)

    // Smooth Mouse parallax
    const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
    const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            mouseX.set((clientX - centerX) / centerX);
            mouseY.set((clientY - centerY) / centerY);
        }

        window.addEventListener('scroll', handleScroll)
        window.addEventListener('mousemove', handleMouseMove)
        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    const rotateX = useTransform(mouseY, [-1, 1], [10, -10]);
    const rotateY = useTransform(mouseX, [-1, 1], [-10, 10]);

    // Features Data
    const features = [
        {
            icon: Activity,
            title: "Precision Vitals",
            desc: "Medical-grade accuracy for monitoring your body's most critical signals in real-time.",
            points: ["Heart Rate Variance", "Blood Oxygen (SpO2)", "Sleep Architecture"],
            color: "text-rose-500",
            bg: "bg-rose-50",
        },
        {
            icon: Pill,
            title: "Smart Regimen",
            desc: "An intelligent assistant that manages your entire medication schedule and inventory.",
            points: ["Interaction Warnings", "Refill Predictions", "Family Sharing"],
            color: "text-indigo-500",
            bg: "bg-indigo-50",
        },
        {
            icon: Brain,
            title: "Neuro Insights",
            desc: "Understanding your mental state through behavioral patterns and AI analysis.",
            points: ["Mood correlations", "Stress triggers", "Focus metrics"],
            color: "text-amber-500",
            bg: "bg-amber-50",
        },
        {
            icon: Shield,
            title: "Vault Security",
            desc: "Your data is encrypted, decentralized, and yours. We facilitate sharing, we don't own it.",
            points: ["End-to-end Encryption", "HIPAA Compliant", "Audit Logs"],
            color: "text-emerald-500",
            bg: "bg-emerald-900/20",
        }
    ]



    return (
        <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-teal-500/30 overflow-x-hidden relative">

            {/* TECHNICAL GRID BACKGROUND */}
            <div className="fixed inset-0 bg-grid pointer-events-none [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-60 z-0"></div>

            {/* NOISE TEXTURE OVERLAY */}
            <div className="bg-noise"></div>

            {/* FLUID AURORA BACKGROUND (CSS Optimized - Light Mode Colors) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-60">
                <div className="absolute -top-[50%] -left-[20%] w-[120vw] h-[120vw] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-200/40 via-white/0 to-transparent blur-[100px] animate-blob-spin" />
                <div className="absolute -bottom-[50%] -right-[20%] w-[120vw] h-[120vw] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-200/40 via-white/0 to-transparent blur-[100px] animate-blob-spin" style={{ animationDirection: 'reverse' }} />

                {/* Accent Orbs */}
                <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-emerald-300/20 rounded-full blur-[128px] animate-blob-float" />
                <div className="absolute bottom-[20%] left-[10%] w-96 h-96 bg-cyan-300/20 rounded-full blur-[128px] animate-blob-float" style={{ animationDelay: '-5s' }} />
            </div>

            {/* NAV - Dynamic Island Style */}
            <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 pointer-events-none">
                <motion.nav
                    initial={{ y: -100, width: "300px" }}
                    animate={{ y: 0, width: scrolled ? "400px" : "600px" }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className={cn(
                        "pointer-events-auto h-16 rounded-full flex items-center justify-between px-2 backdrop-blur-xl border border-slate-200/60 shadow-xl transition-all duration-500",
                        scrolled ? "bg-white/90 shadow-teal-900/5" : "bg-white/50"
                    )}
                >
                    <div className="flex items-center gap-3 pl-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                            <Activity className="w-4 h-4" />
                        </div>
                        <span className={cn("font-bold text-slate-800 transition-opacity duration-300", scrolled ? "opacity-0 w-0 overflow-hidden" : "opacity-100")}>
                            HealthTrack+ <span className="text-xs font-mono text-teal-600 ml-1 opacity-60">v2.4</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-1 pr-1">
                        <Link to="/login">
                            <MagneticButton className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-600 hover:text-slate-900 bg-transparent hover:bg-white/40 transition-colors">
                                Login
                            </MagneticButton>
                        </Link>
                        <Link to="/register">
                            <MagneticButton className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                                Get Started
                            </MagneticButton>
                        </Link>
                    </div>
                </motion.nav>
            </header>

            {/* HERO */}
            <section className="relative pt-40 pb-32 z-10 min-h-screen flex flex-col justify-center items-center text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-5xl mx-auto space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-4 cursor-default">
                        <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">SYS_STATUS: ONLINE</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                        Design Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500">
                            Health Future
                        </span>
                    </h1>

                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        An elegant, AI-powered sanctuary for your medical data.
                        Precise tracking meets <span className="font-mono text-teal-600 bg-teal-50 px-1 rounded">beautiful_design</span>.
                    </p>

                    <div className="pt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 items-center">
                        <Link to="/register">
                            <MagneticButton className="group relative px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg shadow-2xl shadow-teal-900/20 overflow-hidden hover:scale-105 transition-transform min-w-[200px]">
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Patient Sign Up <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </MagneticButton>
                        </Link>

                        <div className="flex gap-4">
                            <Link to="/register?role=doctor">
                                <MagneticButton className="px-6 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold text-sm hover:border-teal-400 hover:text-teal-600 transition-colors shadow-sm">
                                    Doctor Join
                                </MagneticButton>
                            </Link>
                            <Link to="/register?role=provider">
                                <MagneticButton className="px-6 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold text-sm hover:border-teal-400 hover:text-teal-600 transition-colors shadow-sm">
                                    Provider Join
                                </MagneticButton>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* 3D FLOATING MOCKUP */}
                <motion.div
                    style={{ rotateX, rotateY, perspective: 1000 }}
                    className="mt-24 w-full max-w-6xl mx-auto relative group"
                >
                    <div className="absolute -top-12 -left-12 font-mono text-xs text-slate-300 opacity-50 hidden md:block">
                        // DASHBOARD_PREVIEW_INIT<br />
                        class: FloatingWrapper<br />
                        perspective: 1000px
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 10 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="rounded-[2.5rem] bg-white p-3 shadow-[0_50px_100px_-20px_rgba(50,50,93,0.1)] ring-1 ring-slate-900/5 backdrop-blur-xl"
                    >
                        {/* Fake Browser UI */}
                        <div className="rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 aspect-[16/9] flex flex-col">
                            <div className="h-14 bg-white/80 border-b border-slate-100 flex items-center px-6 gap-3">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="w-64 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400 font-mono">https://healthtrack.plus</div>
                                </div>
                            </div>
                            {/* Dashboard Content */}
                            <div className="flex-1 p-8 bg-slate-50/50 grid grid-cols-12 gap-6 relative">
                                {/* Sidebar */}
                                <div className="col-span-2 hidden md:flex flex-col gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg"><Activity className="w-5 h-5" /></div>
                                    <div className="h-px bg-slate-200 w-full my-2"></div>
                                    {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-xl bg-white border border-slate-200"></div>)}
                                </div>
                                {/* Main Stats */}
                                <div className="col-span-12 md:col-span-10 grid grid-cols-3 gap-6">
                                    <div className="col-span-2 bg-white rounded-3xl p-8 border border-slate-100 flex flex-col justify-between shadow-sm relative overflow-hidden">
                                        <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-300">WIDGET_ID: 8842</div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-2xl font-bold text-slate-800">Weekly Wellness</h3>
                                                <p className="text-slate-400">You're doing great!</p>
                                            </div>
                                            <div className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-sm font-bold border border-teal-100">+12%</div>
                                        </div>
                                        <div className="h-32 flex items-end gap-2 mt-8">
                                            {[40, 60, 45, 70, 85, 60, 75].map((h, i) => (
                                                <div key={i} className="flex-1 bg-slate-100 rounded-t-xl relative group hover:bg-teal-50 transition-colors duration-500">
                                                    <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-slate-900 rounded-xl opacity-10 group-hover:opacity-100 group-hover:bg-teal-500 transition-all"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-1 bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 blur-[60px] opacity-30"></div>
                                        <Activity className="w-8 h-8 text-teal-400" />
                                        <div>
                                            <div className="text-4xl font-bold tracking-tight">98</div>
                                            <div className="text-slate-400 font-mono text-sm">SCORE_VAL</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* BENTO GRID FEATURES (Replaces Card Stack) */}
            <section className="py-32 px-4 container mx-auto relative z-10">
                <div className="mb-24 md:pl-12">
                    <span className="text-teal-600 font-mono uppercase text-xs mb-4 block tracking-widest">// CAPABILITIES</span>
                    <h2 className="text-5xl md:text-7xl font-bold text-slate-900">
                        Powerful features <br />
                        <span className="text-slate-300">for a better you.</span>
                    </h2>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, i) => (
                        <div key={i} className={cn(
                            "group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 p-10 hover:border-teal-200 transition-colors duration-500",
                            i === 0 || i === 3 ? "md:col-span-2" : "md:col-span-1"
                        )}>
                            <div className="absolute inset-0 bg-grid-small opacity-[0.03] pointer-events-none"></div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="mb-8">
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", feature.bg, feature.color)}>
                                        <feature.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                                    <p className="text-slate-500 font-medium">{feature.desc}</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-px w-full bg-slate-100"></div>
                                    <ul className="grid grid-cols-2 gap-2">
                                        {feature.points.map((pt: string, idx: number) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-slate-600 font-mono">
                                                <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                                                {pt}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* TRUST */}
            <section className="py-32 border-t border-slate-100 bg-[#FAFAFA] relative overflow-hidden">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-xl md:text-3xl font-bold mb-16 text-slate-400 font-mono">TRUSTED_BY_INSTITUTIONS</h2>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 hover:opacity-100">
                        {['Mayo Clinic', 'Johns Hopkins', 'Cleveland Clinic', 'NHS'].map((brand, i) => (
                            <div key={i} className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                                <Shield className="w-6 h-6" /> {brand}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="min-h-[60vh] flex flex-col justify-center items-center text-center px-4 relative overflow-hidden bg-white border-t border-slate-100">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-50/50 via-white to-white pointer-events-none" />
                <div className="absolute inset-0 bg-grid opacity-[0.05] pointer-events-none"></div>

                <h2 className="text-[15vw] font-black text-slate-100 leading-none select-none absolute z-0 tracking-tighter">
                    2026
                </h2>
                <div className="relative z-10 space-y-8">
                    <h2 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight">Ready to begin?</h2>
                    <p className="text-xl text-slate-500">Your journey to better health starts with one click.</p>
                    <Link to="/register">
                        <MagneticButton className="px-10 py-5 bg-slate-900 text-white rounded-full font-bold text-xl hover:bg-teal-600 transition-colors shadow-2xl shadow-teal-900/10 hover:shadow-teal-500/20">
                            Create Free Account
                        </MagneticButton>
                    </Link>
                </div>
            </section>

            {/* SIMPLE FOOTER */}
            <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-100 bg-white">
                <p className="font-mono text-xs">© 2026 HealthTrack+ <span className="mx-2">|</span> BUILD_VER: 2.4.9 <span className="mx-2">|</span> SECURE</p>
            </footer>
        </div>
    )
}
