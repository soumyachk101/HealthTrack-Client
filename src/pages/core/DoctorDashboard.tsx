import { useState } from 'react'
import { Calendar, Clock, FileText, Search, Bell, MoreVertical, Video, Users, Stethoscope, ChevronRight } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DoctorDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    // Mock Data
    const stats = [
        { label: "Total Patients", value: "1,248", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Today's Appointments", value: "12", icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: "Pending Reports", value: "5", icon: FileText, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Consultations", value: "854", icon: Stethoscope, color: "text-purple-500", bg: "bg-purple-50" },
    ]

    const appointments = [
        { id: 1, name: "Sarah Johnson", time: "09:00 AM", type: "Video Consult", issue: "Fever & Cold", status: "Upcoming", image: "https://i.pravatar.cc/150?u=1" },
        { id: 2, name: "Mike Chen", time: "10:30 AM", type: "Clinic Visit", issue: "Annual Checkup", status: "Upcoming", image: "https://i.pravatar.cc/150?u=2" },
        { id: 3, name: "Emma Wilson", time: "11:45 AM", type: "Video Consult", issue: "Skin Allergy", status: "In-Progress", image: "https://i.pravatar.cc/150?u=3" },
        { id: 4, name: "James Bond", time: "02:15 PM", type: "Clinic Visit", issue: "Back Pain", status: "Pending", image: "https://i.pravatar.cc/150?u=4" },
    ]

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
            {/* Sidebar (Simplified) */}
            <aside className={cn("bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 lg:translate-x-0 lg:static", !sidebarOpen && "-translate-x-full")}>
                <div className="h-16 flex items-center px-6 border-b border-slate-200">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white mr-3">
                        <Stethoscope className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-lg text-slate-800 tracking-tight">Practo Ray</span>
                </div>
                <nav className="p-4 space-y-1">
                    {['Dashboard', 'Appointments', 'Patients', 'Reports', 'Schedule', 'Settings'].map((item, idx) => (
                        <a key={idx} href="#" className={cn("flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors", idx === 0 ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
                            {idx === 0 ? <Calendar className="h-5 w-5" /> : <ChevronRight className="h-4 w-4" />}
                            {item}
                        </a>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <Clock className="h-5 w-5" /> {/* Using Clock as Placeholder Menu Icon */}
                        </Button>
                        <h1 className="text-xl font-bold text-slate-800">Hello, Dr. Smith</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input placeholder="Search patients..." className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-500" />
                        </div>
                        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-700">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
                        </Button>
                        <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                            <img src="https://i.pravatar.cc/150?u=doctor" alt="Profile" className="h-full w-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {stats.map((stat, idx) => (
                            <Card key={idx} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                                        <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                    </div>
                                    <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Appointments Section */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-800">Today's Appointments</h2>
                                <Button variant="outline" className="text-sm text-blue-600 border-blue-200 hover:bg-blue-50">View All</Button>
                            </div>

                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                {appointments.map((appt, idx) => (
                                    <div key={appt.id} className={cn("p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors", idx !== appointments.length - 1 && "border-b border-slate-100")}>
                                        <div className="flex-shrink-0">
                                            <div className="h-12 w-20 flex flex-col items-center justify-center bg-blue-50 rounded-lg border border-blue-100 text-blue-700">
                                                <span className="text-sm font-bold">{appt.time.split(' ')[0]}</span>
                                                <span className="text-[10px] uppercase font-bold text-blue-400">{appt.time.split(' ')[1]}</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-base font-semibold text-slate-900 truncate">{appt.name}</h4>
                                                <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                    appt.status === 'Upcoming' ? "bg-blue-100 text-blue-800" :
                                                        appt.status === 'In-Progress' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                                )}>
                                                    {appt.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 mb-2">{appt.issue} • {appt.type}</p>
                                            <div className="flex items-center gap-2">
                                                {appt.type === 'Video Consult' && (
                                                    <Button size="sm" className="h-7 px-3 text-xs bg-indigo-600 hover:bg-indigo-700">
                                                        <Video className="h-3 w-3 mr-1" /> Join Call
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="outline" className="h-7 px-3 text-xs">View Details</Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity / Next Patient */}
                        <div className="space-y-6">
                            <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-medium opacity-90">Next Patient</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 mb-6">
                                        <img src="https://i.pravatar.cc/150?u=1" alt="Patient" className="h-16 w-16 rounded-full border-4 border-white/20" />
                                        <div>
                                            <h3 className="text-xl font-bold">Sarah Johnson</h3>
                                            <p className="text-blue-100 text-sm">General Checkup</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button className="flex-1 bg-white text-blue-600 hover:bg-blue-50 font-semibold border-0">Start Visit</Button>
                                        <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 icon-only px-3">
                                            <MoreVertical className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base font-bold text-slate-800">Patient Requests</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 shrink-0" />
                                            <div>
                                                <p className="text-sm text-slate-700"><span className="font-semibold">John Doe</span> requested a prescription refill.</p>
                                                <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                                                <div className="flex gap-2 mt-2">
                                                    <button className="text-xs font-medium text-green-600 hover:underline">Approve</button>
                                                    <button className="text-xs font-medium text-red-600 hover:underline">Decline</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
