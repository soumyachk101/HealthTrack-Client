"use client";

import { useState, useEffect } from 'react'
import { Calendar, Clock, FileText, Users, Settings, Home, Video } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

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
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token')
                router.push('/login')
                return
            }

            const data = await response.json()
            if (data.success) {
                setAppointments(data.appointments)
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
                fetchAppointments() 
            }
        } catch (err) {
            console.error("Action failed", err)
        }
    }

    return (
        <DashboardLayout sidebarItems={doctorNavItems}>
            <div className="flex flex-col gap-6 h-full">
                <header className="h-20 bg-white shadow-clay-card rounded-3xl flex items-center justify-between px-8">
                    <h1 className="text-xl font-bold text-slate-800">Manage Appointments</h1>
                </header>

                <div className="bg-white rounded-3xl shadow-clay-card overflow-hidden border border-border/50 min-h-[400px]">
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-500">Loading appointments...</div>
                    ) : appointments.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">No appointments scheduled.</div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {appointments.map((appt) => (
                                <div key={appt.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-20 flex flex-col items-center justify-center bg-blue-50 rounded-xl border border-blue-100 text-blue-700">
                                            <span className="text-sm font-bold">{appt.date}</span>
                                            <span className="text-xs font-semibold text-blue-400">{appt.time.substring(0, 5)}</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900">{appt.patient_name}</h4>
                                            <p className="text-sm text-slate-500">{appt.reason} • {appt.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
                                            appt.status === 'pending' ? "bg-yellow-100 text-yellow-800" :
                                            appt.status === 'confirmed' ? "bg-green-100 text-green-800" :
                                            appt.status === 'completed' ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                                        )}>
                                            {appt.status}
                                        </span>
                                        {appt.status === 'pending' && (
                                            <>
                                                <Button size="sm" onClick={() => handleAction(appt.id, 'accept')} className="bg-emerald-600 hover:bg-emerald-700">
                                                    Accept
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => handleAction(appt.id, 'reject')} className="text-red-600 border-red-200 hover:bg-red-50">
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                        {appt.status === 'confirmed' && appt.type === 'Video Consult' && (
                                            <a href={appt.meeting_link} target="_blank" rel="noreferrer">
                                                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                                                    <Video className="h-4 w-4 mr-1" /> Join Call
                                                </Button>
                                            </a>
                                        )}
                                        {appt.status === 'confirmed' && (
                                            <Button size="sm" variant="outline" onClick={() => handleAction(appt.id, 'complete')}>
                                                Complete
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
