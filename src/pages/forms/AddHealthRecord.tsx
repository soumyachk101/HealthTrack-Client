import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getCookie } from "@/lib/csrf"
import { Loader2, Activity } from "lucide-react"

export default function AddHealthRecord() {
    const [isLoading, setIsLoading] = useState(false)
    const [csrfToken, setCsrfToken] = useState<string>("")

    useEffect(() => {
        const token = getCookie("csrftoken")
        if (token) setCsrfToken(token)
    }, [])

    const navigate = useNavigate()
    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        try {
            const response = await fetch(`${API_URL}/core/api/health-track/add/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(data)
            })

            if (response.ok) {
                navigate('/health-track')
            } else {
                console.error("Failed to add record")
                // In a real app, set an error state here
            }
        } catch (error) {
            console.error("Error adding record:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-4 md:p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Add Health Record</h1>
                    <p className="text-muted-foreground mt-1">Record your daily vitals</p>
                </header>

                <div className="max-w-2xl mx-auto">
                    <Card className="border-border/50 bg-card/50 backdrop-blur">
                        <CardHeader>
                            <CardTitle>Vital Signs</CardTitle>
                            <CardDescription>Enter your latest health readings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form method="POST" onSubmit={handleSubmit} className="space-y-6">
                                <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="blood_pressure_systolic">BP Systolic</Label>
                                        <div className="relative">
                                            <Activity className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="blood_pressure_systolic" name="blood_pressure_systolic" type="number" placeholder="120" className="pl-12" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="blood_pressure_diastolic">BP Diastolic</Label>
                                        <Input id="blood_pressure_diastolic" name="blood_pressure_diastolic" type="number" placeholder="80" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="blood_sugar">Blood Sugar (mg/dL)</Label>
                                        <Input id="blood_sugar" name="blood_sugar" type="number" step="0.01" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="weight">Weight (kg)</Label>
                                        <Input id="weight" name="weight" type="number" step="0.01" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="heart_rate">Heart Rate (bpm)</Label>
                                        <Input id="heart_rate" name="heart_rate" type="number" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="temperature">Temp (&deg;F)</Label>
                                        <Input id="temperature" name="temperature" type="number" step="0.1" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="oxygen_level">Oxygen (%)</Label>
                                        <Input id="oxygen_level" name="oxygen_level" type="number" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Any additional observations..."
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Record
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
