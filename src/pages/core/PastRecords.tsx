import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, FileText, Calendar } from "lucide-react"

interface HealthRecord {
    recorded_at: string
    blood_pressure_systolic: number
    blood_pressure_diastolic: number
}

interface Prescription {
    prescription_date: string
    doctor_name: string
}

interface PastRecordsData {
    health_records: HealthRecord[]
    prescriptions: Prescription[]
}

export default function PastRecords() {
    const [data, setData] = useState<PastRecordsData | null>(null)
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
                const response = await fetch(`${API_URL}/api/past-records/`, {
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
                    throw new Error('Failed to fetch past records')
                }

                const result = await response.json()
                setData(result)
            } catch (err: any) {
                if (err.name === 'AbortError') return
                console.error("Past Records Fetch Error:", err)
                setError(err.message || "Failed to load past records")
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false)
                }
            }
        }

        fetchData()
        return () => controller.abort()
    }, [navigate])

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading Past Records...</div>
    if (error) return <div className="min-h-screen bg-background flex items-center justify-center text-destructive">{error}</div>
    if (!data) return null

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Past Records</h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-border shadow-sm h-full">
                        <CardHeader className="bg-transparent border-b border-border/50 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Heart className="h-5 w-5 text-primary" />
                                Health Records
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <ul className="space-y-3">
                                {data.health_records.slice(0, 5).map((record, i) => (
                                    <li key={i} className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            {record.recorded_at}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {record.blood_pressure_systolic && (
                                                <span>BP: {record.blood_pressure_systolic}/{record.blood_pressure_diastolic}</span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                                {data.health_records.length === 0 && (
                                    <li className="text-center text-muted-foreground py-4">No records found</li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-sm h-full">
                        <CardHeader className="bg-transparent border-b border-border/50 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="h-5 w-5 text-emerald-500" />
                                Prescriptions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <ul className="space-y-3">
                                {data.prescriptions.slice(0, 5).map((p, i) => (
                                    <li key={i} className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            {p.prescription_date}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {p.doctor_name}
                                        </div>
                                    </li>
                                ))}
                                {data.prescriptions.length === 0 && (
                                    <li className="text-center text-muted-foreground py-4">No prescriptions found</li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
