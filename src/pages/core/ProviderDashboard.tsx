import { useState } from 'react'
import { Package, Truck, Activity, DollarSign, Filter, Check, MapPin, Calendar, Home, User } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardLayout } from "@/components/layout/DashboardLayout"

const providerNavItems = [
    { icon: Home, label: "Dashboard", href: "/provider-dashboard" },
    { icon: Package, label: "Requests", href: "/provider/requests" },
    { icon: DollarSign, label: "Earnings", href: "/provider/earnings" },
    { icon: User, label: "Profile", href: "/provider/profile" },
]

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
        <DashboardLayout sidebarItems={providerNavItems}>
            <div className="space-y-8">
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
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{req.type}</span>
                                                    <span className="text-xs text-slate-400">• {req.time}</span>
                                                </div>
                                                <h3 className="font-bold text-slate-900 text-lg">{req.client}</h3>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-lg text-slate-900">{req.price}</div>
                                                <div className="text-xs font-medium text-emerald-600">Cash on Delivery</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 mb-4">
                                            <MapPin className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                            <p className="text-slate-600 text-sm leading-snug">{req.address}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 md:mt-0">
                                            <div className="flex gap-2">
                                                {req.items.map((item, i) => (
                                                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">{item}</span>
                                                ))}
                                            </div>
                                            <div className="flex gap-3">
                                                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">Decline</Button>
                                                <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800">Accept Order</Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                                <button className="text-sm font-medium text-blue-600 hover:underline">View All Requests</button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Map Placeholder */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg">
                            <h3 className="font-bold text-lg mb-2">Driver Status</h3>
                            <div className="flex items-center justify-between mb-6">
                                <span className="flex items-center gap-2 text-sm text-slate-300">
                                    <Activity className="h-4 w-4 text-emerald-400" />
                                    Online
                                </span>
                                <div className="relative">
                                    <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-400">Completion Rate</span>
                                        <span className="font-bold">98%</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[98%]"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-400">Customer Rating</span>
                                        <span className="font-bold">4.9</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-500 w-[96%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 className="font-bold text-slate-900 mb-4">Recent Notifications</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm">
                                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <span className="text-slate-600">New incentive available for weekend deliveries.</span>
                                </li>
                                <li className="flex gap-3 text-sm">
                                    <div className="h-2 w-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <span className="text-slate-600">Order #1234 has been canceled by customer.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
