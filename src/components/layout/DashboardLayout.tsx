import type { ReactNode } from "react"
import { Sidebar } from "./Sidebar"
import { MobileSidebar } from "./MobileSidebar"

import { navItems } from "./nav-config"

interface DashboardLayoutProps {
    children: ReactNode
    sidebarItems?: typeof navItems
}

export function DashboardLayout({ children, sidebarItems }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Desktop Sidebar */}
            <Sidebar items={sidebarItems} />

            {/* Mobile Sidebar */}
            <MobileSidebar items={sidebarItems} />

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 transition-all">
                {children}
            </main>
        </div>
    )
}
