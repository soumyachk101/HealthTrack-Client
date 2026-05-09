"use client";

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { Users, ShieldCheck, Activity, AlertCircle, Check, X, Trash2, Search, FileText, Settings, Database } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { getCookie } from "@/lib/csrf"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { getApiUrl } from "@/lib/api"

interface AdminStats {
    total_users: number
    patients: number
    pending_approvals: number
    total_records: number
    providers: number
}

interface AdminUser {
    id: number
    username: string
    email: string
    user_type: string
    is_approved: boolean
    date_joined: string
}

const adminNavItems = [
    { icon: Activity, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Users, label: "User Management", href: "/admin/users" },
    { icon: Database, label: "Health Data", href: "/admin/health-data" },
    { icon: FileText, label: "System Reports", href: "/admin/reports" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
]

export function AdminView() {
    const pathname = usePathname()
    const router = useRouter()
    const activePath = pathname
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [users, setUsers] = useState<AdminUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('')


    const fetchData = useCallback(async () => {
        setIsLoading(true)
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/login')
            return
        }
        try {
            // Fetch Stats
            const statsRes = await fetch(getApiUrl("/admin-panel/api/stats/"), {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (statsRes.status === 401 || statsRes.status === 403) {
                localStorage.removeItem('token')
                router.push('/login')
                return
            }

            const statsData = await statsRes.json()
            if (statsData.success) setStats(statsData.stats)

            // Fetch Users
            const usersRes = await fetch(getApiUrl("/admin-panel/api/users/"), {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const usersData = await usersRes.json()
            if (usersData.success) setUsers(usersData.users)

        } catch (err: unknown) {
            console.error("Failed to fetch admin data", err)
        } finally {
            setIsLoading(false)
        }
    }, [router])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleUserAction = async (id: number, action: string) => {
        const token = localStorage.getItem('token')
        const csrfToken = getCookie("csrftoken")
        try {
            const res = await fetch(getApiUrl(`/admin-panel/api/users/${id}/action/`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-CSRFToken': csrfToken || ''
                },
                body: JSON.stringify({ action })
            })
            const data = await res.json()
            if (data.success) {
                fetchData() // Refresh
            }
        } catch (err: unknown) {
            console.error("Admin action failed", err)
            if (err instanceof Error) {
                // Potential feedback to user here if needed
            }
        }
    }

    const filteredUsers = users.filter(u => {
        const matchesSearch = (u.email.toLowerCase().includes(searchTerm.toLowerCase()) || u.username.toLowerCase().includes(searchTerm.toLowerCase()));
        
        let matchesType = true;
        if (filterType === 'patient') matchesType = u.user_type === 'patient';
        else if (filterType === 'doctor') matchesType = u.user_type === 'doctor';
        else if (filterType === 'admin') matchesType = u.user_type === 'admin';
        else if (filterType === 'provider') matchesType = ['hospital', 'clinic', 'pharmacy', 'lab', 'provider'].includes(u.user_type);
        
        return matchesSearch && matchesType;
    })

    return (
        <DashboardLayout sidebarItems={adminNavItems}>
            <div className="flex flex-col gap-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                            {activePath === '/admin/users' ? "User Management" :
                             activePath === '/admin/health-data' ? "System Health Data" :
                             activePath === '/admin/reports' ? "System Reports" :
                             activePath === '/admin/settings' ? "Admin Settings" :
                             "System Administration"}
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">
                            {activePath === '/admin/users' ? "Manage permissions and accounts." :
                             activePath === '/admin/health-data' ? "Real-time health database monitoring." :
                             activePath === '/admin/reports' ? "Download and view system activity." :
                             activePath === '/admin/settings' ? "Configure global portal parameters." :
                             "Monitor users, approvals, and system health."}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" /> SECURE ROOT ACCESS
                        </div>
                    </div>
                </header>

                {(activePath === '/admin/dashboard' || activePath === '/admin' || activePath.endsWith('dashboard')) && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="card-skeuo border-none">
                                <CardContent className="p-6">
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Users</p>
                                    <h3 className="text-3xl font-black text-slate-800">{stats?.total_users || 0}</h3>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-600">
                                        <Users className="h-3 w-3" /> {stats?.patients} Patients
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="card-skeuo border-none">
                                <CardContent className="p-6">
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Approvals</p>
                                    <h3 className="text-3xl font-black text-amber-600">{stats?.pending_approvals || 0}</h3>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-600">
                                        <AlertCircle className="h-3 w-3" /> Needs attention
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="card-skeuo border-none">
                                <CardContent className="p-6">
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Health Records</p>
                                    <h3 className="text-3xl font-black text-teal-600">{stats?.total_records || 0}</h3>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-teal-600">
                                        <Activity className="h-3 w-3" /> System wide
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="card-skeuo border-none">
                                <CardContent className="p-6">
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Service Providers</p>
                                    <h3 className="text-3xl font-black text-slate-800">{stats?.providers || 0}</h3>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500">
                                        <Search className="h-3 w-3" /> Managed network
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}

                {(activePath.includes('dashboard') || activePath.includes('users') || activePath === '/admin') && (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h2 className="text-xl font-bold text-slate-800">User Management</h2>
                            <div className="flex items-center gap-3">
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input 
                                        className="input-skeuo pl-10 h-10 text-sm" 
                                        placeholder="Search users..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select 
                                    className="input-skeuo h-10 text-sm w-32 px-2"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    <option value="">All Types</option>
                                    <option value="patient">Patient</option>
                                    <option value="doctor">Doctor</option>
                                    <option value="provider">Provider</option>
                                </select>
                            </div>
                        </div>

                        <div className="card-skeuo p-0 overflow-hidden border-none">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50/50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Type</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Joined</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {isLoading ? (
                                            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading users...</td></tr>
                                        ) : filteredUsers.length === 0 ? (
                                            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No users found.</td></tr>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] shadow-skeuo-sm flex items-center justify-center text-slate-400 border border-white font-bold">
                                                                {user.username.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-700">{user.username}</div>
                                                                <div className="text-xs text-slate-400">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={cn(
                                                            "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                                                            user.user_type === 'patient' ? "bg-blue-50 text-blue-600" :
                                                            user.user_type === 'doctor' ? "bg-teal-50 text-teal-600" : 
                                                            user.user_type === 'admin' ? "bg-slate-900 text-white" :
                                                            "bg-purple-50 text-purple-600"
                                                        )}>
                                                            {user.user_type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className={cn("h-2 w-2 rounded-full", user.is_approved ? "bg-emerald-500" : "bg-amber-500")} />
                                                            <span className="text-sm font-medium text-slate-600">
                                                                {user.is_approved ? "Approved" : "Pending"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                                        {user.date_joined}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {!user.is_approved && (
                                                                <button 
                                                                    onClick={() => handleUserAction(user.id, 'approve')}
                                                                    className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors shadow-skeuo-sm border border-white"
                                                                    title="Approve"
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                            {user.is_approved && user.user_type !== 'patient' && (
                                                                <button 
                                                                    onClick={() => handleUserAction(user.id, 'reject')}
                                                                    className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-colors shadow-skeuo-sm border border-white"
                                                                    title="Revoke Approval"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                            <button 
                                                                onClick={() => {
                                                                    if(confirm('Are you sure you want to delete this user?')) handleUserAction(user.id, 'delete')
                                                                }}
                                                                className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors shadow-skeuo-sm border border-white"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activePath.includes('health-data') && (
                    <div className="card-skeuo p-12 text-center space-y-4">
                        <Database className="h-12 w-12 text-slate-300 mx-auto" />
                        <h3 className="text-xl font-bold text-slate-800">Health Database Records</h3>
                        <p className="text-slate-500 max-w-md mx-auto">This section displays all encrypted health records in the system. This feature is currently being optimized for high-volume data.</p>
                    </div>
                )}

                {activePath.includes('reports') && (
                    <div className="card-skeuo p-12 text-center space-y-4">
                        <FileText className="h-12 w-12 text-slate-300 mx-auto" />
                        <h3 className="text-xl font-bold text-slate-800">System Activity Reports</h3>
                        <p className="text-slate-500 max-w-md mx-auto">Generate PDF or Excel reports for user activity, service provider performance, and platform growth metrics.</p>
                    </div>
                )}

                {activePath.includes('settings') && (
                    <div className="card-skeuo p-12 text-center space-y-4">
                        <Settings className="h-12 w-12 text-slate-300 mx-auto" />
                        <h3 className="text-xl font-bold text-slate-800">Platform Settings</h3>
                        <p className="text-slate-500 max-w-md mx-auto">Configure global system parameters, maintenance mode, and API rate limits for the HealthTrack+ platform.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
