"use client";

import { useState, useEffect } from 'react'
import { Calendar, Clock, FileText, Users, Stethoscope, Settings, Home, Check, X, Video } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { getCookie } from "@/lib/csrf"
import { useRouter } from "next/navigation"

const doctorNavItems = [
    { icon: Home, label: "Dashboard", href: "/doctor/dashboard" },
    { icon: Calendar, label: "Appointments", href: "/doctor/appointments" },
    { icon: Users, label: "Patients", href: "/doctor/patients" },
    { icon: FileText, label: "Reports", href: "/doctor/reports" },
    { icon: Clock, label: "Schedule", href: "/doctor/schedule" },
    { icon: Settings, label: "Settings", href: "/doctor/settings" },
]

export default function DoctorDashboard() {
    const [appointments, setAppointments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const [stats, setStats] = useState([
        { label: "Total Patients", value: "0", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Today's Appointments", value: "0", icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: "Pending Reports", value: "0", icon: FileText, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Consultations", value: "0", icon: Stethoscope, color: "text-purple-500", bg: "bg-purple-50" },
    ])

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

    useEffect(() => {
        fetchAppointments()
    }, [])

    const fetchAppointments = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/login')
            return
        }
        try {
            const response = await fetch(`${API_URL}/api/appointments/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token')
                router.push('/login')
                return
            }

            const data = await response.json()
            if (data.success) {
                setAppointments(data.appointments)
                const today = new Date().toISOString().split('T')[0]
                const todayCount = data.appointments.filter((a: any) => a.date === today).length

                setStats(prev => prev.map(s => {
                    if (s.label === "Today's Appointments") return { ...s, value: todayCount.toString() }
                    if (s.label === "Consultations") return { ...s, value: data.appointments.length.toString() }
                    return s
                }))
            }
        } catch (err) {
            console.error("Failed to fetch appointments", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAction = async (id: number, action: 'accept' | 'reject' | 'complete') => {
        try {
            const token = localStorage.getItem('token')
            const csrfToken = getCookie("csrftoken")

            const response = await fetch(`${API_URL}/api/appointments/${id}/action/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-CSRFToken': csrfToken || ''
                },
                body: JSON.stringify({ action })
            })

            const data = await response.json()
            if (data.success) {
                fetchAppointments() // Refresh list
            }
        } catch (err) {
            console.error("Action failed", err)
        }
    }

    return (
        <DashboardLayout sidebarItems={doctorNavItems}>
            <div className="flex flex-col min-w-0 overflow-hidden gap-4 h-full">
                {/* Header */}
                <header className="h-20 bg-white shadow-clay-card rounded-3xl flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-8">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-slate-800">Hello, Doctor</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                            <img src="https://i.pravatar.cc/150?u=doctor" alt="Profile" className="h-full w-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {stats.map((stat, idx) => (
                            <Card key={idx} className="hover:-translate-y-1 transition-transform border-border shadow-sm">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                                        <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                    </div>
                                    <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Appointments Section */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-800">Appointments</h2>
                                <Button variant="outline" className="text-sm text-blue-600 border-blue-200 hover:bg-blue-50">View All</Button>
                            </div>

                            <div className="bg-white rounded-3xl shadow-clay-card overflow-hidden border border-border/50 min-h-[300px]">
                                {isLoading ? (
                                    <div className="p-8 text-center text-slate-500">Loading appointments...</div>
                                ) : appointments.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500">No appointments found.</div>
                                ) : (
                                    appointments.map((appt, idx) => (
                                        <div key={appt.id} className={cn("p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors", idx !== appointments.length - 1 && "border-b border-slate-100")}>
                                            <div className="flex-shrink-0">
                                                <div className="h-12 w-20 flex flex-col items-center justify-center bg-blue-50 rounded-lg border border-blue-100 text-blue-700">
                                                    <span className="text-sm font-bold">{appt.date}</span>
                                                    <span className="text-[10px] font-bold text-blue-400">{appt.time.substring(0, 5)}</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="text-base font-semibold text-slate-900 truncate">{appt.patient_name}</h4>
                                                    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                        appt.status === 'pending' ? "bg-yellow-100 text-yellow-800" :
                                                            appt.status === 'confirmed' ? "bg-green-100 text-green-800" :
                                                                appt.status === 'completed' ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                                                    )}>
                                                        {appt.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500 mb-2">{appt.reason} • {appt.type}</p>
                                                <div className="flex items-center gap-2">
                                                    {appt.status === 'pending' && (
                                                        <>
                                                            <Button size="sm" onClick={() => handleAction(appt.id, 'accept')} className="h-7 px-3 text-xs bg-emerald-600 hover:bg-emerald-700">
                                                                <Check className="h-3 w-3 mr-1" /> Accept
                                                            </Button>
                                                            <Button size="sm" variant="outline" onClick={() => handleAction(appt.id, 'reject')} className="h-7 px-3 text-xs text-red-600 border-red-200 hover:bg-red-50">
                                                                <X className="h-3 w-3 mr-1" /> Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                    {appt.status === 'confirmed' && appt.type === 'Video Consult' && (
                                                        <a href={appt.meeting_link} target="_blank" rel="noreferrer">
                                                            <Button size="sm" className="h-7 px-3 text-xs bg-indigo-600 hover:bg-indigo-700">
                                                                <Video className="h-3 w-3 mr-1" /> Join Call
                                                            </Button>
                                                        </a>
                                                    )}
                                                    {appt.status === 'confirmed' && (
                                                        <Button size="sm" variant="outline" onClick={() => handleAction(appt.id, 'complete')} className="h-7 px-3 text-xs">
                                                            Mark Complete
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Activity / Next Patient */}
                        <div className="space-y-6">
                            <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white border-none shadow-clay-card">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-medium opacity-90">Next Patient</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {appointments.filter(a => a.status === 'confirmed').length > 0 ? (
                                        <>
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                                                    {appointments.filter(a => a.status === 'confirmed')[0].patient_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold">{appointments.filter(a => a.status === 'confirmed')[0].patient_name}</h3>
                                                    <p className="text-blue-100 text-sm">{appointments.filter(a => a.status === 'confirmed')[0].reason}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button className="flex-1 bg-white text-blue-600 hover:bg-blue-50 font-semibold border-0">Start Visit</Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-4 text-blue-100">No upcoming confirmed appointments</div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    )
}
