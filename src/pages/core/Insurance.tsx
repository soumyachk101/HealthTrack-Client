import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, FileText, CheckCircle, AlertCircle, Plus, Calendar } from "lucide-react"

interface Policy {
    provider_name: string
    policy_type_display: string
    policy_number: string
    coverage_amount: number
    end_date: string
    is_active: boolean
}

interface InsuranceData {
    policies: Policy[]
    active_policies: number
}

export default function Insurance() {
    const [data, setData] = useState<InsuranceData | null>(null)

    useEffect(() => {
        const dataScript = document.getElementById("insurance-data")
        if (dataScript && dataScript.textContent) {
            try {
                const parsedData = JSON.parse(dataScript.textContent)
                setData(parsedData)
            } catch (e) {
                console.error("Failed to parse insurance data", e)
            }
        }
    }, [])

    if (!data) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Insurance Policies</h1>
                    <p className="text-muted-foreground mt-1">Protecting your health journey</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="border-border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Policies</CardTitle>
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <FileText className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{data.policies.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">Registered</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Active Coverage</CardTitle>
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <Shield className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{data.active_policies}</div>
                            <p className="text-xs text-muted-foreground mt-1">Policies Active</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Expiring Soon</CardTitle>
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <AlertCircle className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">--</div>
                            <p className="text-xs text-muted-foreground mt-1">Check details below</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-primary">Your Policies</h2>
                    <Button onClick={() => alert('Feature coming soon!')} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Plus className="h-4 w-4" />
                        Add Policy
                    </Button>
                </div>

                <Card className="border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground bg-secondary/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Provider</th>
                                    <th className="px-6 py-4 font-medium">Type</th>
                                    <th className="px-6 py-4 font-medium">Policy No.</th>
                                    <th className="px-6 py-4 font-medium">Coverage</th>
                                    <th className="px-6 py-4 font-medium">Valid Until</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {data.policies.map((policy, i) => (
                                    <tr key={i} className="bg-card hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-foreground">{policy.provider_name}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs">
                                                {policy.policy_type_display}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">{policy.policy_number}</td>
                                        <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                                            ₹{policy.coverage_amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {policy.end_date}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${policy.is_active
                                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                : "bg-slate-500/10 text-slate-500"
                                                }`}>
                                                {policy.is_active ? (
                                                    <><CheckCircle className="h-3 w-3 mr-1" /> Active</>
                                                ) : "Expired"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {data.policies.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                            No insurance policies found.
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
