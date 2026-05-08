"use client";

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
    Activity, ArrowRight, Pill, Brain, Menu, X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, useTransform, useSpring } from 'framer-motion'

export default function Landing() {
    const [scrolled, setScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    }, [mouseX, mouseY])

    const rotateX = useTransform(mouseY, [-1, 1], [5, -5]);
    const rotateY = useTransform(mouseX, [-1, 1], [-5, 5]);

    const features = [
        {
            icon: Activity,
            title: "Precision Vitals",
            desc: "Medical-grade accuracy for monitoring your body's most critical signals in real-time.",
            points: ["Heart Rate Variance", "Blood Oxygen (SpO2)", "Sleep Architecture"],
            color: "text-teal-600",
        },
        {
            icon: Pill,
            title: "Smart Regimen",
            desc: "An intelligent assistant that manages your entire medication schedule and inventory.",
            points: ["Interaction Warnings", "Refill Predictions", "Family Sharing"],
            color: "text-blue-600",
        },
        {
            icon: Brain,
            title: "Neuro Insights",
            desc: "Understanding your mental state through behavioral patterns and AI analysis.",
            points: ["Mood correlations", "Stress triggers", "Focus metrics"],
            color: "text-purple-600",
        },
        {
            icon: Activity,
            title: "Vault Security",
            desc: "Your data is encrypted, decentralized, and yours. We facilitate sharing, we don't own it.",
            points: ["End-to-end Encryption", "HIPAA Compliant", "Audit Logs"],
            color: "text-emerald-600",
        }
    ]

    return (
        <div className="min-h-screen bg-[#EFF6FF] text-slate-700 font-sans selection:bg-teal-200 selection:text-teal-900 overflow-x-hidden relative">
            <div className="bg-texture"></div>

            <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-6 px-4">
                <motion.nav
                    initial={{ y: -100, width: "100%" }}
                    animate={{
                        y: 0,
                        width: scrolled ? "min(400px, 100%)" : "min(800px, 100%)",
                        borderRadius: isMobileMenuOpen ? "2rem 2rem 0 0" : "1.5rem"
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className={cn(
                        "relative h-16 md:h-20 flex items-center justify-between px-4 md:px-6 transition-all duration-300",
                        scrolled
                            ? "bg-[#EFF6FF]/95 backdrop-blur-md shadow-skeuo-md border border-white/50"
                            : "bg-[#EFF6FF] shadow-skeuo-lg border border-white/50"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#EFF6FF] shadow-skeuo-sm flex items-center justify-center text-teal-600 border border-white/50 active:shadow-skeuo-inset-sm transition-shadow cursor-pointer">
                            <Activity className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <span className={cn("font-bold text-slate-700 text-base md:text-lg tracking-tight transition-all duration-300", scrolled ? "md:opacity-0 md:w-0 overflow-hidden" : "opacity-100")}>
                            HealthTrack<span className="text-teal-500">+</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login">
                            <button className="btn-skeuo text-sm px-6 py-2.5">
                                Login
                            </button>
                        </Link>
                        <Link href="/register">
                            <button className="btn-skeuo-primary text-sm px-6 py-2.5">
                                Get Started
                            </button>
                        </Link>
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden w-10 h-10 rounded-xl bg-[#EFF6FF] shadow-skeuo-sm flex items-center justify-center text-slate-600 border border-white/50 active:shadow-skeuo-inset-sm transition-all"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    <motion.div
                        initial={false}
                        animate={{
                            height: isMobileMenuOpen ? "auto" : 0,
                            opacity: isMobileMenuOpen ? 1 : 0
                        }}
                        className="absolute top-full left-0 right-0 bg-[#EFF6FF] shadow-skeuo-lg border border-white/50 rounded-b-3xl overflow-hidden md:hidden z-[-1]"
                    >
                        <div className="p-6 space-y-4">
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block">
                                <button className="btn-skeuo w-full py-4 text-base">Login</button>
                            </Link>
                            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="block">
                                <button className="btn-skeuo-primary w-full py-4 text-base">Get Started</button>
                            </Link>
                        </div>
                    </motion.div>
                </motion.nav>
            </header>

            <section className="relative pt-24 md:pt-48 pb-16 md:pb-32 z-10 min-h-[calc(100vh-5rem)] md:min-h-screen flex flex-col justify-start md:justify-center items-center text-center px-4">
                <div className="absolute top-40 left-[10%] w-32 h-32 rounded-full bg-[#EFF6FF] shadow-skeuo-md opacity-60 animate-blob-float"></div>
                <div className="absolute top-60 right-[15%] w-24 h-24 rounded-full bg-[#EFF6FF] shadow-skeuo-convex opacity-50 animate-blob-float" style={{ animationDelay: '-2s' }}></div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto space-y-6 md:space-y-10"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#EFF6FF] shadow-skeuo-inset-sm border-b border-white/50 mb-4 cursor-default">
                        <span className="flex h-3 w-3 rounded-full bg-teal-500 shadow-[2px_2px_4px_#cdcaca,-2px_-2px_4px_#ffffff]"></span>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">System Online v2.5</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-slate-800 leading-[1.2] md:leading-[1.1] drop-shadow-sm">
                        Design Your <br />
                        <span className="text-teal-600 relative inline-block">
                            Health Future
                            <svg className="absolute w-full h-2 md:h-3 -bottom-1 left-0 text-teal-500/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium px-4 md:px-0">
                        Experience the feel of premium healthcare.
                        <span className="font-semibold text-teal-600 mx-1">Tactile</span>
                        tracking for your body and mind.
                    </p>

                    <div className="pt-6 md:pt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 md:gap-8 items-center w-full px-4 sm:px-6">
                        <Link href="/register" className="w-full sm:w-auto">
                            <button className="btn-skeuo-primary text-sm md:text-base lg:text-lg px-6 md:px-8 lg:px-10 py-3 md:py-3.5 lg:py-4 w-full sm:min-w-[200px] flex items-center justify-center gap-2 md:gap-3 group">
                                Patient Sign Up
                                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>

                        <div className="flex gap-3 sm:gap-4 w-full sm:w-auto justify-center">
                            <Link href="/register?role=doctor" className="flex-1 sm:flex-none">
                                <button className="btn-skeuo text-xs sm:text-sm w-full sm:w-auto px-4 md:px-6 py-3">
                                    Doctor Join
                                </button>
                            </Link>
                            <Link href="/register?role=provider" className="flex-1 sm:flex-none">
                                <button className="btn-skeuo text-xs sm:text-sm w-full sm:w-auto px-4 md:px-6 py-3">
                                    Provider Join
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    style={{ rotateX, rotateY, perspective: 1000 }}
                    className="mt-12 sm:mt-16 md:mt-20 lg:mt-32 w-full max-w-5xl mx-auto relative group z-20 px-4"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 10 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="rounded-3xl md:rounded-[3rem] bg-[#EFF6FF] p-3 md:p-6 shadow-[10px_10px_30px_#cad4e0,-10px_-10px_30px_#ffffff] md:shadow-[20px_20px_60px_#cad4e0,-20px_-20px_60px_#ffffff] border border-white/80"
                    >
                        <div className="rounded-2xl md:rounded-[2.5rem] bg-[#e0eafc] p-1 md:p-2 shadow-inner border border-slate-200">
                            <div className="rounded-xl md:rounded-[2rem] overflow-hidden bg-[#EFF6FF] aspect-[4/3] md:aspect-[16/9] flex flex-col shadow-[inset_2px_2px_10px_rgba(0,0,0,0.05)] border border-white">
                                <div className="h-10 md:h-16 bg-[#EFF6FF] border-b border-slate-200/60 flex items-center px-4 md:px-8 gap-4 shadow-sm z-10">
                                    <div className="flex gap-2 md:gap-3">
                                        <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-red-400 shadow-sm"></div>
                                        <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-yellow-400 shadow-sm"></div>
                                        <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-green-400 shadow-sm"></div>
                                    </div>
                                    <div className="flex-1 flex justify-center">
                                        <div className="w-40 sm:w-48 md:w-64 h-6 md:h-10 bg-[#EFF6FF] rounded-lg shadow-skeuo-inset-sm flex items-center justify-center text-[11px] sm:text-xs md:text-xs text-slate-400 font-bold tracking-wide">HEALTH_TRACK_OS</div>
                                    </div>
                                </div>

                                <div className="flex-1 p-4 md:p-8 bg-[#F8FAFC] grid grid-cols-12 md:gap-8 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>

                                    <div className="hidden md:flex col-span-1 flex-col gap-6 items-center pt-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] shadow-skeuo-md flex items-center justify-center text-teal-600"><Activity className="w-6 h-6" /></div>
                                        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] shadow-skeuo-sm flex items-center justify-center text-slate-400 hover:text-teal-500 transition-colors"><Pill className="w-5 h-5" /></div>
                                        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] shadow-skeuo-sm flex items-center justify-center text-slate-400 hover:text-teal-500 transition-colors"><Brain className="w-5 h-5" /></div>
                                    </div>

                                    <div className="col-span-12 md:col-span-11 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8 z-10">
                                        <div className="md:col-span-2 bg-[#EFF6FF] rounded-2xl md:rounded-3xl p-3 md:p-8 shadow-skeuo-lg border border-white/60 relative overflow-hidden">
                                            <div className="flex justify-between items-center mb-3 md:mb-8">
                                                <h3 className="text-base md:text-2xl font-bold text-slate-700">Heart</h3>
                                                <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-[#EFF6FF] shadow-skeuo-convex flex items-center justify-center text-slate-400">
                                                    <Activity className="w-3 h-3 md:w-5 md:h-5" />
                                                </div>
                                            </div>
                                            <div className="flex items-end gap-1.5 md:gap-3 h-16 md:h-40 px-1 md:px-2 pb-2">
                                                {[30, 50, 45, 80, 60, 90, 55, 70, 40].map((h, i) => (
                                                    <div key={i} className="flex-1 bg-[#EFF6FF] rounded-full shadow-skeuo-inset-sm relative overflow-hidden group">
                                                        <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-teal-500 rounded-full opacity-80 shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="md:col-span-1 bg-[#EFF6FF] rounded-2xl md:rounded-3xl p-3 md:p-8 shadow-skeuo-convex border border-white/60 flex flex-col justify-between items-center text-center">
                                            <div className="w-10 h-10 md:w-20 md:h-20 rounded-full bg-[#EFF6FF] shadow-skeuo-md flex items-center justify-center text-teal-500 mb-2 md:mb-4 border border-white">
                                                <span className="text-lg md:text-2xl font-bold">98</span>
                                            </div>
                                            <div>
                                                <div className="text-slate-800 font-bold text-sm md:text-lg">Score</div>
                                                <div className="text-slate-400 text-xs md:text-sm mt-0.5 md:mt-1 hidden md:block">Excellent</div>
                                            </div>
                                            <button className="mt-3 md:mt-6 w-full py-2 md:py-3 rounded-xl bg-[#EFF6FF] shadow-skeuo-sm text-[10px] md:text-sm font-bold text-teal-600 active:shadow-skeuo-inset-sm transition-all">
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            <section className="py-20 md:py-32 px-4 container mx-auto relative z-10">
                <div className="mb-16 md:mb-24 md:pl-12 text-center md:text-left">
                    <span className="text-teal-600 font-bold uppercase text-xs mb-4 block tracking-widest shadow-none">System Capabilities</span>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-800 leading-tight">
                        Tangible Results. <br />
                        <span className="text-slate-400">Real Impact.</span>
                    </h2>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                    {features.map((feature, i) => (
                        <div key={i} className={cn(
                            "card-skeuo card-skeuo-hover group",
                            (i === 0 || i === 3) ? "lg:col-span-2" : "lg:col-span-1"
                        )}>
                            <div className="flex flex-col h-full justify-between">
                                <div className="mb-6 md:mb-8 p-1 md:p-2">
                                    <div className={cn("w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-skeuo-floating bg-[#EFF6FF] border border-white", feature.color)}>
                                        <feature.icon className="w-6 h-6 md:w-8 md:h-8" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 md:mb-3">{feature.title}</h3>
                                    <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                                </div>
                                <div className="space-y-4 bg-[#F8FAFC]/50 p-4 md:p-6 rounded-2xl shadow-skeuo-inset-sm border-b border-white">
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                        {feature.points.map((pt: string, idx: number) => (
                                            <li key={idx} className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-slate-600 font-bold">
                                                <div className={cn("w-1.5 h-1.5 md:w-2 md:h-2 rounded-full shadow-sm bg-teal-400")}></div>
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

            <section className="min-h-[50vh] md:min-h-[60vh] flex flex-col justify-center items-center text-center px-4 relative overflow-hidden py-20">
                <div className="absolute inset-0 bg-[#EFF6FF]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] rounded-full bg-white shadow-skeuo-md opacity-40"></div>
                </div>

                <div className="relative z-10 space-y-6 md:space-y-10">
                    <h2 className="text-5xl md:text-8xl font-black text-slate-800 tracking-tight drop-shadow-sm">Ready?</h2>
                    <p className="text-lg md:text-2xl text-slate-500 font-medium px-4">Join the future of tangible health tracking.</p>
                    <Link href="/register" className="block w-full sm:w-auto px-6">
                        <button className="btn-skeuo-primary text-xl md:text-2xl px-8 md:px-12 py-4 md:py-6 rounded-2xl shadow-skeuo-lg hover:shadow-skeuo-floating transition-all w-full sm:w-auto transform hover:-translate-y-1">
                            Create Free Account
                        </button>
                    </Link>
                </div>
            </section>

            <footer className="py-12 text-center text-slate-500 text-sm border-t border-slate-200 bg-[#EFF6FF]">
                <div className="inline-block px-6 py-2 rounded-full shadow-skeuo-inset-sm bg-[#EFF6FF]">
                    <p className="font-semibold">© 2026 HealthTrack+ <span className="mx-2 text-slate-300">|</span> v2.5.0 SKEUO</p>
                </div>
            </footer>
        </div>
    )
}
