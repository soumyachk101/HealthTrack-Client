import { Home, Pill, Activity, Heart, FileText, FolderOpen, Shield, User, LogOut } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export function Sidebar() {
    const navItems = [
        { icon: Home, label: "Dashboard", href: "/dashboard/" },
        { icon: Pill, label: "Medicines", href: "/medicines/" },
        { icon: Activity, label: "Health Track", href: "/health-track/" },
        { icon: Heart, label: "Mental Health", href: "/mental-health/" },
        { icon: FileText, label: "Prescriptions", href: "/prescriptions/" },
        { icon: FolderOpen, label: "Past Records", href: "/past-records/" },
        { icon: Activity, label: "Lifestyle", href: "/lifestyle/" },
        { icon: Shield, label: "Insurance", href: "/insurance/" },
        { icon: User, label: "Profile", href: "/profile/" },
    ]

    const location = useLocation()

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-white hidden lg:flex flex-col shadow-sm">
            <div className="p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                        <img src="/logo.svg" alt="HealthTrack Logo" className="h-8 w-8" />
                    </div>
                    <span className="font-bold tracking-tight text-foreground text-lg">HealthTrack</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    // Check if current path starts with the item's href (to handle sub-paths like /medicines/add/)
                    const isActive = location.pathname.startsWith(item.href) || (item.href !== "/" && location.pathname.includes(item.href))

                    return (
                        <Link
                            key={item.label}
                            to={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-border/50">
                <a
                    href="/accounts/logout/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Log Out
                </a>
            </div>
        </aside>
    )
}
