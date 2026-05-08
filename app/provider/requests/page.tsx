"use client";

import { useState, useEffect } from 'react'
import { Clock, MapPin, DollarSign, Package, Home, Settings } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { getCookie } from "@/lib/csrf"
import { useRouter } from "next/navigation"

const providerNavItems = [
    { icon: Home, label: "Dashboard", href: "/provider/dashboard" },
    { icon: Package, label: "Services", href: "/provider/services" },
    { icon: MapPin, label: "Requests", href: "/provider/requests" },
    { icon: DollarSign, label: "Earnings", href: "/provider/earnings" },
    { icon: Clock, label: "History", href: "/provider/history" },
    { icon: Settings, label: "Settings", href: "/provider/settings" },
]

export default function ProviderRequests() {
    const [requests, setRequests] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/login')
            return
        }
        try {
            const response = await fetch(`${API_URL}/api/service-requests/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token')
                router.push('/login')
                return
            }

            const data = await response.json()
            if (data.success) {
                setRequests(data.requests)
            }
        } catch (err) {
            console.error("Failed to fetch requests", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAction = async (id: number, action: 'accept' | 'decline' | 'complete') => {
        try {
            const token = localStorage.getItem('token')
            const csrfToken = getCookie("csrftoken")

            const response = await fetch(`${API_URL}/api/service-requests/${id}/action/`, {
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
                fetchRequests() 
            }
        } catch (err) {
            console.error("Action failed", err)
        }
    }

    return (
        <DashboardLayout sidebarItems={providerNavItems}>
            <div className="flex flex-col gap-6 h-full">
                <header className="h-20 bg-white shadow-clay-card rounded-3xl flex items-center justify-between px-8">
                    <h1 className="text-xl font-bold text-slate-800">Service Requests</h1>
                </header>

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-center text-slate-500 py-8">Loading requests...</div>
                    ) : requests.length === 0 ? (
                        <div className="text-center text-slate-500 py-8">No incoming service requests.</div>
                    ) : (
                        requests.map((req) => (
                            <Card key={req.id} className="border-border shadow-sm">
                                <CardContent className="p-6 flex flex-col sm:flex-row gap-6 items-center justify-between">
                                    <div className="flex items-center gap-6 flex-1">
                                        <div className="h-16 w-16 bg-blue-50 rounded-2xl flex flex-col items-center justify-center text-blue-700 border border-blue-100 flex-shrink-0">
                                            <span className="text-xs font-bold uppercase">
                                                {new Date(req.scheduled_date || req.created_at).toLocaleString('default', { month: 'short' })}
                                            </span>
                                            <span className="text-2xl font-bold">
                                                {new Date(req.scheduled_date || req.created_at).getDate()}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">{req.service_name}</h3>
                                            <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                                                <MapPin className="h-3 w-3" /> {req.address}
                                            </p>
                                            <p className="text-xs font-semibold text-slate-400 mt-1">Patient: {req.patient_name}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <span className="block text-xl font-bold text-slate-900">${req.price}</span>
                                            <span className={cn("text-xs font-semibold px-3 py-1 rounded-full inline-block mt-1",
                                                req.status === 'pending' ? "bg-amber-100 text-amber-700" :
                                                req.status === 'accepted' ? "bg-blue-100 text-blue-700" :
                                                req.status === 'completed' ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                                            )}>
                                                {req.status}
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            {req.status === 'pending' && (
                                                <>
                                                    <Button onClick={() => handleAction(req.id, 'accept')} className="bg-slate-900 hover:bg-slate-800 text-white">
                                                        Accept
                                                    </Button>
                                                    <Button onClick={() => handleAction(req.id, 'decline')} variant="outline" className="border-slate-200 hover:bg-slate-50 text-slate-700">
                                                        Decline
                                                    </Button>
                                                </>
                                            )}
                                            {req.status === 'accepted' && (
                                                <Button onClick={() => handleAction(req.id, 'complete')} className="bg-green-600 hover:bg-green-700 text-white">
                                                    Complete
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
