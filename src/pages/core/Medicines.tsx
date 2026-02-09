import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pill, Plus, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Medicine {
    name: string
    dosage: string
    frequency_display: string // specific field for display
    start_date: string
    end_date?: string | null
    is_active: boolean
}

interface MedicinesData {
    active_count: number
    medicines: Medicine[]
}

export default function Medicines() {
    const [data, setData] = useState<MedicinesData | null>(null)

    useEffect(() => {
        const dataScript = document.getElementById("medicines-data")
        if (dataScript && dataScript.textContent) {
            try {
                const parsedData = JSON.parse(dataScript.textContent)
                setData(parsedData)
            } catch (e) {
                console.error("Failed to parse medicines data", e)
            }
        }
    }, [])

    if (!data) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-8">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Medicines</h1>
                        <p className="text-muted-foreground mt-1">Manage your active prescriptions and schedules</p>
                    </div>
                    <a href="/medicines/add/">
                        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Plus className="h-4 w-4" />
                            Add Medicine
                        </Button>
                    </a>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="border-border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Active Medicines</CardTitle>
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <Pill className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{data.active_count}</div>
                            <p className="text-xs text-muted-foreground mt-1">Currently taking</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Medicine Name</th>
                                    <th className="px-6 py-4 font-medium">Dosage</th>
                                    <th className="px-6 py-4 font-medium">Frequency</th>
                                    <th className="px-6 py-4 font-medium">Dates</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {data.medicines.map((med, i) => (
                                    <tr key={i} className="bg-card hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">{med.name}</td>
                                        <td className="px-6 py-4">{med.dosage}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                {med.frequency_display}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col text-xs text-muted-foreground">
                                                <span>Start: {med.start_date}</span>
                                                {med.end_date && <span>End: {med.end_date}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${med.is_active
                                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                : "bg-slate-500/10 text-slate-500"
                                                }`}>
                                                {med.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {data.medicines.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                            No medicines added yet.
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
