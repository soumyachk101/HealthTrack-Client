import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
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

    useEffect(() => {
        const dataScript = document.getElementById("lifestyle-data")
        if (dataScript && dataScript.textContent) {
            try {
                const parsedData = JSON.parse(dataScript.textContent)
                setData(parsedData)
            } catch (e) {
                console.error("Failed to parse lifestyle data", e)
            }
        }
    }, [])

    if (!data) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>

    const latest = data.logs[0] || {}

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-8">
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
                            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
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
            </main>
        </div>
    )
}
