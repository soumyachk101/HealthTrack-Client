import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, User, Hospital, Calendar } from "lucide-react"

interface Prescription {
    prescription_date: string
    doctor_name: string
    hospital_name: string
    diagnosis: string
    follow_up_date: string
}

interface PrescriptionsData {
    prescriptions: Prescription[]
}

export default function Prescriptions() {
    const [data, setData] = useState<PrescriptionsData | null>(null)

    useEffect(() => {
        const dataScript = document.getElementById("prescriptions-data")
        if (dataScript && dataScript.textContent) {
            try {
                const parsedData = JSON.parse(dataScript.textContent)
                setData(parsedData)
            } catch (e) {
                console.error("Failed to parse prescriptions data", e)
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
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Prescriptions</h1>
                        <p className="text-muted-foreground mt-1">Manage your digital prescriptions</p>
                    </div>
                    <a href="/prescriptions/add/">
                        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Plus className="h-4 w-4" />
                            Add Prescription
                        </Button>
                    </a>
                </header>

                <Card className="border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Doctor</th>
                                    <th className="px-6 py-4 font-medium">Hospital</th>
                                    <th className="px-6 py-4 font-medium">Diagnosis</th>
                                    <th className="px-6 py-4 font-medium">Follow-up</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {data.prescriptions.map((p, i) => (
                                    <tr key={i} className="bg-card hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-foreground font-medium">
                                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                                {p.prescription_date}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <User className="h-3 w-3 text-primary" />
                                                {p.doctor_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Hospital className="h-3 w-3 text-muted-foreground" />
                                                {p.hospital_name || "-"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 truncate max-w-[200px]" title={p.diagnosis}>
                                            {p.diagnosis}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {p.follow_up_date || "-"}
                                        </td>
                                    </tr>
                                ))}
                                {data.prescriptions.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                            No prescriptions yet.
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
