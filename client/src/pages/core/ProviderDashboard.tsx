import { useState } from 'react'
import { Package, Truck, Activity, DollarSign, Filter, Check, MapPin, Briefcase, Calendar } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ProviderDashboard() {
    const [activeTab, setActiveTab] = useState('requests')

    // Mock Data
    const stats = [
        { label: "Pending Requests", value: "24", icon: Package, color: "text-orange-600", bg: "bg-orange-50" },
        { label: "Completed Today", value: "18", icon: Check, color: "text-green-600", bg: "bg-green-50" },
        { label: "Active Deliveries", value: "6", icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Total Earnings", value: "$1,840", icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
    ]

    const requests = [
        { id: 1, type: "Medicine Delivery", client: "Alice Freeman", address: "123 Maple Ave, Springfield", items: ["Paracetamol 500mg", "Vitamin C"], time: "10 min ago", status: "New", price: "$45.00" },
        { id: 2, type: "Lab Test", client: "Robert Wolf", address: "45 Pine St, Downtown", items: ["Full Body Checkup"], time: "25 min ago", status: "New", price: "$120.00" },
        { id: 3, type: "Medicine Delivery", client: "Sarah Lee", address: "88 Oak Dr, Westside", items: ["Insulin Pen", "Needles"], time: "1 hour ago", status: "Processing", price: "$85.50" },
    ]

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-xl text-slate-900 tracking-tight">HealthTrack+ <span className="text-emerald-600">Partner</span></span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" className="text-slate-500 hover:text-slate-900 hidden sm:flex">Help Center</Button>
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                <span className="font-bold text-sm text-slate-600">SP</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                        <p className="text-slate-500 mt-1">Manage your orders and track performance.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="gap-2 bg-white">
                            <Calendar className="h-4 w-4" /> Today: Jan 16
                        </Button>
                        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                            <Activity className="h-4 w-4" /> Go Online
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="border-slate-200 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", stat.bg, stat.color)}>
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", stat.color.includes('red') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700')}>
                                        +4.5%
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Content Area */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Request Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="font-bold text-lg text-slate-800">Incoming Requests</h2>
                                <div className="flex gap-2">
                                    <Button
                                        variant={activeTab === 'requests' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setActiveTab('requests')}
                                        className={activeTab === 'requests' ? 'bg-slate-900 text-white' : 'text-slate-500'}
                                    >
                                        Active
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                                        <Filter className="h-4 w-4 mr-2" /> Filter
                                    </Button>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {requests.map((req) => (
                                    <div key={req.id} className="p-6 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-4">
                                                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                                                    {req.type === 'Lab Test' ? <Activity className="h-6 w-6" /> : <Package className="h-6 w-6" />}
                                                </div>
                                                <div>
                                                    <h4 className="text-base font-bold text-slate-900">{req.type}</h4>
                                                    <p className="text-sm text-slate-500 font-medium">Order #{1000 + req.id}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-lg font-bold text-slate-900">{req.price}</span>
                                                <span className="text-xs font-medium text-slate-400">{req.time}</span>
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4 mb-6">
                                            <div className="flex items-start gap-2 text-sm text-slate-600">
                                                <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                                                <span>{req.address}</span>
                                            </div>
                                            <div className="flex items-start gap-2 text-sm text-slate-600">
                                                <Package className="h-4 w-4 text-slate-400 mt-0.5" />
                                                <span>{req.items.join(', ')}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button className="flex-1 bg-slate-900 text-white hover:bg-slate-800">
                                                Accept Order
                                            </Button>
                                            <Button variant="outline" className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-red-600 hover:border-red-200">
                                                Decline
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                                <button className="text-sm font-medium text-blue-600 hover:underline">View All Requests</button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Profile Summary */}
                    <div className="space-y-6">
                        <Card className="border-slate-200 shadow-sm overflow-hidden">
                            <div className="h-24 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
                            <CardContent className="relative pt-0 px-6 pb-6">
                                <div className="h-16 w-16 rounded-xl bg-white p-1 absolute -top-8 shadow-sm">
                                    <div className="h-full w-full bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                        <Briefcase className="h-6 w-6" />
                                    </div>
                                </div>
                                <div className="mt-10">
                                    <h3 className="font-bold text-lg text-slate-900">MediCare Pharmacy</h3>
                                    <p className="text-sm text-slate-500">Service Provider • Premium Partner</p>
                                </div>
                                <div className="mt-6 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Service Rating</span>
                                        <span className="font-bold text-slate-900">4.8/5.0</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-emerald-500 h-2 rounded-full w-[96%]"></div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Response Rate</span>
                                        <span className="font-bold text-slate-900">98%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm bg-blue-50/50 border-blue-100">
                            <CardContent className="p-6">
                                <h4 className="font-bold text-blue-900 mb-2">Pro Tip</h4>
                                <p className="text-sm text-blue-700 mb-4">Accepting orders within 5 minutes increases your visibility by 20%.</p>
                                <Button size="sm" variant="link" className="p-0 h-auto text-blue-600">Learn More &rarr;</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
