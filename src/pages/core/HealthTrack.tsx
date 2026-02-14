import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card } from "@/components/ui/card"
import { Activity, Plus, Heart, Droplet, Weight, Wind, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"

interface HealthRecord {
    recorded_at: string
    blood_pressure_systolic?: number
    blood_pressure_diastolic?: number
    blood_sugar?: number
    weight?: number
    heart_rate?: number
    oxygen_level?: number
    bp_status: string
}

interface HealthTrackData {
    records: HealthRecord[]
}

export default function HealthTrack() {
    const [data, setData] = useState<HealthTrackData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const controller = new AbortController()
        const fetchData = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                navigate('/login')
                return
            }

            try {
                const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
                const response = await fetch(`${API_URL}/api/health-track/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    signal: controller.signal
                })

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token')
                    navigate('/login')
                    return
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch health records')
                }

                const result = await response.json()
                setData(result)
            } catch (err: any) {
                if (err.name === 'AbortError') return
                console.error("Health Track Fetch Error:", err)
                setError(err.message || "Failed to load health records")
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false)
                }
            }
        }

        fetchData()
        return () => controller.abort()
    }, [navigate])

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading Health Track...</div>
    if (error) return (
        <div className="min-h-screen bg-background flex items-center justify-center text-destructive flex-col gap-4">
            <AlertCircle className="h-10 w-10" />
            <p>{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
        </div>
    )

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-8">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Monthly Health Track</h1>
                        <p className="text-muted-foreground mt-1">Track your vital signs and health history</p>
                    </div>
                    <Link to="/add-health-record">
                        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Plus className="h-4 w-4" />
                            Add Record
                        </Button>
                    </Link>
                </header>

                <Card className="border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground bg-secondary/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Heart className="h-3 w-3" /> Blood Pressure
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Droplet className="h-3 w-3" /> Blood Sugar
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Weight className="h-3 w-3" /> Weight
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-3 w-3" /> Heart Rate
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Wind className="h-3 w-3" /> Oxygen
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {data?.records.map((record, i) => (
                                    <tr key={i} className="bg-card hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">{record.recorded_at}</td>
                                        <td className="px-6 py-4">
                                            {record.blood_pressure_systolic
                                                ? `${record.blood_pressure_systolic}/${record.blood_pressure_diastolic} mmHg`
                                                : "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {record.blood_sugar ? `${record.blood_sugar} mg/dL` : "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {record.weight ? `${record.weight} kg` : "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {record.heart_rate ? `${record.heart_rate} bpm` : "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {record.oxygen_level ? `${record.oxygen_level}%` : "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                {record.bp_status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(!data?.records || data.records.length === 0) && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                                            No health records yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </main>
        </div>
    )
}
