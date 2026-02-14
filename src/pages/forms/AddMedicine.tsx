import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getCookie } from "@/lib/csrf"
import { Loader2, Pill } from "lucide-react"

export default function AddMedicine() {
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
            const response = await fetch(`${API_URL}/core/api/medicines/add/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(data)
            })

            if (response.ok) {
                navigate('/medicines')
            } else {
                console.error("Failed to add medicine")
            }
        } catch (error) {
            console.error("Error adding medicine:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-4 md:p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Add Medicine</h1>
                    <p className="text-muted-foreground mt-1">Schedule a new medication</p>
                </header>

                <div className="max-w-2xl mx-auto">
                    <Card className="border-border/50 bg-card/50 backdrop-blur">
                        <CardHeader>
                            <CardTitle>Medicine Details</CardTitle>
                            <CardDescription>Enter dosage and schedule information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form method="POST" onSubmit={handleSubmit} className="space-y-6">
                                <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Medicine Name</Label>
                                        <div className="relative">
                                            <Pill className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="name" name="name" placeholder="e.g. Paracetamol" required className="pl-10" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dosage">Dosage</Label>
                                        <Input id="dosage" name="dosage" placeholder="e.g. 500mg" required />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="frequency">Frequency</Label>
                                        <select
                                            id="frequency"
                                            name="frequency"
                                            required
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="once">Once Daily</option>
                                            <option value="twice">Twice Daily</option>
                                            <option value="thrice">Three Times Daily</option>
                                            <option value="asneeded">As Needed</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="prescribed_by">Prescribed By</Label>
                                        <Input id="prescribed_by" name="prescribed_by" placeholder="Doctor's name" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">Start Date</Label>
                                        <Input id="start_date" name="start_date" type="date" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">End Date (Optional)</Label>
                                        <Input id="end_date" name="end_date" type="date" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Medicine
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
