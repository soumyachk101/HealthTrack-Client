import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplet, Dumbbell, Footprints, Plus, CalendarCheck } from "lucide-react"

interface LifestyleLog {
    recorded_at: string
    water_intake: number
    exercise_minutes: number
    steps_count: number
    calories_consumed: number | null
}

interface LifestyleData {
    logs: LifestyleLog[]
}

export default function Lifestyle() {
    const [data, setData] = useState<LifestyleData | null>(null)
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
                const response = await fetch(`${API_URL}/api/lifestyle/`, {
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
                    throw new Error('Failed to fetch lifestyle data')
                }

                const result = await response.json()
                setData(result)
            } catch (err: any) {
                if (err.name === 'AbortError') return
                console.error("Lifestyle Fetch Error:", err)
                setError(err.message || "Failed to load lifestyle data")
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false)
                }
            }
        }

        fetchData()
        return () => controller.abort()
    }, [navigate])

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading Lifestyle Data...</div>
    if (error) return <div className="min-h-screen bg-background flex items-center justify-center text-destructive">{error}</div>
    if (!data) return null

    const latest = data.logs[0] || {}

    return (

        <DashboardLayout>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Lifestyle Tracking</h1>
                <p className="text-muted-foreground mt-1">Stay active, stay healthy</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Water Intake</CardTitle>
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <Droplet className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{latest.water_intake ?? "-"}</div>
                        <p className="text-xs text-muted-foreground mt-1">Glasses (Latest)</p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Steps</CardTitle>
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <Footprints className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{latest.steps_count ?? "-"}</div>
                        <p className="text-xs text-muted-foreground mt-1">Steps Walked</p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Exercise</CardTitle>
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <Dumbbell className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{latest.exercise_minutes ?? "-"}</div>
                        <p className="text-xs text-muted-foreground mt-1">Minutes Active</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-primary">Lifestyle History</h2>
                <Button onClick={() => alert('Feature coming soon!')} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="h-4 w-4" />
                    Log Activity
                </Button>
            </div>

            <Card className="border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground bg-secondary/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Water</th>
                                <th className="px-6 py-4 font-medium">Exercise</th>
                                <th className="px-6 py-4 font-medium">Steps</th>
                                <th className="px-6 py-4 font-medium">Calories</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {data.logs.map((log, i) => (
                                <tr key={i} className="bg-card hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-foreground font-medium">
                                            <CalendarCheck className="h-3 w-3 text-muted-foreground" />
                                            {log.recorded_at}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Droplet className="h-4 w-4 text-sky-500" />
                                            {log.water_intake} glasses
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                            <Dumbbell className="h-3 w-3 mr-1" />
                                            {log.exercise_minutes} min
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{log.steps_count}</td>
                                    <td className="px-6 py-4">{log.calories_consumed || "-"}</td>
                                </tr>
                            ))}
                            {data.logs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        No lifestyle logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </DashboardLayout>
    )
}
