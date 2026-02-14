import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smile, List, CalendarCheck, Plus, Bed, Clock } from "lucide-react"

interface MentalHealthLog {
    recorded_at: string
    mood_score: number
    mood_score_display: string
    stress_level_display: string
    sleep_hours: number | null
    notes: string
}

interface MentalHealthData {
    avg_mood: number
    logs: MentalHealthLog[]
}

export default function MentalHealth() {
    const [data, setData] = useState<MentalHealthData | null>(null)
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
                const response = await fetch(`${API_URL}/api/mental-health/`, {
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
                    throw new Error('Failed to fetch mental health data')
                }

                const result = await response.json()
                setData(result)
            } catch (err: any) {
                if (err.name === 'AbortError') return
                console.error("Mental Health Fetch Error:", err)
                setError(err.message || "Failed to load mental health data")
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false)
                }
            }
        }

        fetchData()
        return () => controller.abort()
    }, [navigate])

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading Mental Health Data...</div>
    if (error) return <div className="min-h-screen bg-background flex items-center justify-center text-destructive">{error}</div>
    if (!data) return null

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Mental Health</h1>
                    <p className="text-muted-foreground mt-1">Track your mood and inner peace</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="border-border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Average Mood</CardTitle>
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <Smile className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{data.avg_mood}/5</div>
                            <p className="text-xs text-muted-foreground mt-1">Overall Score</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Entries</CardTitle>
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <List className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{data.logs.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">Mood Logs</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Streak</CardTitle>
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <CalendarCheck className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">--</div>
                            <p className="text-xs text-muted-foreground mt-1">Days active</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-primary">Recent Mood Logs</h2>
                    <Button onClick={() => alert('Feature coming soon!')} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Plus className="h-4 w-4" />
                        Log Mood
                    </Button>
                </div>

                <Card className="border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground bg-secondary/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Mood</th>
                                    <th className="px-6 py-4 font-medium">Stress Level</th>
                                    <th className="px-6 py-4 font-medium">Sleep</th>
                                    <th className="px-6 py-4 font-medium">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {data.logs.map((log, i) => (
                                    <tr key={i} className="bg-card hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-foreground font-medium">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                {log.recorded_at}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${log.mood_score >= 4 ? "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800" :
                                                log.mood_score === 3 ? "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800" :
                                                    "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800"
                                                }`}>
                                                {log.mood_score_display}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-foreground">{log.stress_level_display}</td>
                                        <td className="px-6 py-4">
                                            {log.sleep_hours ? (
                                                <div className="flex items-center gap-2">
                                                    <Bed className="h-4 w-4 text-primary" />
                                                    {log.sleep_hours} hrs
                                                </div>
                                            ) : "-"}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground italic truncate max-w-[200px]">
                                            {log.notes}
                                        </td>
                                    </tr>
                                ))}
                                {data.logs.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                            No mental health logs found.
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
