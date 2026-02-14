import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, Phone, MapPin, Heart, AlertCircle, Save } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface ProfileData {
    csrf_token: string
    user: {
        first_name: string
        last_name: string
        email: string
        phone: string
        city: string
        blood_group: string
        address: string
        emergency_contact: string
        emergency_phone: string
    }
    messages: Array<{
        tags: string
        message: string
    }>
}

export default function Profile() {
    const [data, setData] = useState<ProfileData | null>(null)
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
                const response = await fetch(`${API_URL}/api/profile/`, {
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
                    throw new Error('Failed to fetch profile data')
                }

                const result = await response.json()
                setData(result)
            } catch (err: any) {
                if (err.name === 'AbortError') return
                console.error("Profile Fetch Error:", err)
                setError(err.message || "Failed to load profile")
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false)
                }
            }
        }

        fetchData()
        return () => controller.abort()
    }, [navigate])

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        alert("Profile updates are coming soon!")
    }

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading Profile...</div>
    if (error) return (
        <div className="min-h-screen bg-background flex items-center justify-center text-destructive flex-col gap-4">
            <AlertCircle className="h-10 w-10" />
            <p>{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
        </div>
    )

    return (
        <DashboardLayout>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-primary">My Profile</h1>
                <p className="text-muted-foreground mt-1">Manage your personal information</p>
            </header>

            <form onSubmit={handleSave}>
                <Card className="border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Personal Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">First Name</label>
                                <Input name="first_name" defaultValue={data?.user.first_name} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last Name</label>
                                <Input name="last_name" defaultValue={data?.user.last_name} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" /> Email
                                </label>
                                <Input defaultValue={data?.user.email} disabled className="bg-muted text-muted-foreground cursor-not-allowed" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" /> Phone
                                </label>
                                <Input name="phone" type="tel" defaultValue={data?.user.phone} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" /> City
                                </label>
                                <Input name="city" defaultValue={data?.user.city} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Heart className="h-4 w-4 text-destructive" /> Blood Group
                                </label>
                                <select
                                    name="blood_group"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    defaultValue={data?.user.blood_group}
                                >
                                    <option value="">Select Blood Group</option>
                                    <option value="A+">A+ (A Positive)</option>
                                    <option value="A-">A- (A Negative)</option>
                                    <option value="B+">B+ (B Positive)</option>
                                    <option value="B-">B- (B Negative)</option>
                                    <option value="AB+">AB+ (AB Positive)</option>
                                    <option value="AB-">AB- (AB Negative)</option>
                                    <option value="O+">O+ (O Positive)</option>
                                    <option value="O-">O- (O Negative)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Address</label>
                            <textarea
                                name="address"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                defaultValue={data?.user.address}
                            />
                        </div>

                        <div className="pt-4 border-t border-border">
                            <h3 className="text-lg font-semibold mb-4 text-primary">Emergency Contact</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Name</label>
                                    <Input name="emergency_contact" defaultValue={data?.user.emergency_contact} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone</label>
                                    <Input name="emergency_phone" type="tel" defaultValue={data?.user.emergency_phone} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                                <Save className="h-4 w-4" />
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </DashboardLayout>
    )
}
