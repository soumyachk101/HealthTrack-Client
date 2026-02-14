import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCookie } from "@/lib/csrf"
import { Loader2, FileText } from "lucide-react"

export default function AddPrescription() {
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
        // Check if file is empty, if so remove it so backend doesn't complain if expecting a file object (though my backend allows null)
        const fileInput = formData.get('document') as File
        if (fileInput && fileInput.size === 0) {
            formData.delete('document')
        }

        try {
            const response = await fetch(`${API_URL}/core/api/prescriptions/add/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'X-CSRFToken': csrfToken
                    // Content-Type not set, let browser handle boundary for FormData
                },
                body: formData
            })

            if (response.ok) {
                navigate('/prescriptions')
            } else {
                console.error("Failed to add prescription")
            }
        } catch (error) {
            console.error("Error adding prescription:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-4 md:p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Add Prescription</h1>
                    <p className="text-muted-foreground mt-1">Upload and track medical prescriptions</p>
                </header>

                <div className="max-w-2xl mx-auto">
                    <Card className="border-border/50 bg-card/50 backdrop-blur">
                        <CardHeader>
                            <CardTitle>Prescription Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form method="POST" encType="multipart/form-data" onSubmit={handleSubmit} className="space-y-6">
                                <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="doctor_name">Doctor Name</Label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="doctor_name" name="doctor_name" required className="pl-10" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hospital_name">Hospital/Clinic</Label>
                                        <Input id="hospital_name" name="hospital_name" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="diagnosis">Diagnosis</Label>
                                    <textarea
                                        id="diagnosis"
                                        name="diagnosis"
                                        required
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="prescription_date">Date</Label>
                                        <Input id="prescription_date" name="prescription_date" type="date" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="follow_up_date">Follow-up Date</Label>
                                        <Input id="follow_up_date" name="follow_up_date" type="date" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="document">Upload Document (Optional)</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="document"
                                            name="document"
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="cursor-pointer file:cursor-pointer"
                                        />
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
                                        Save Prescription
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
