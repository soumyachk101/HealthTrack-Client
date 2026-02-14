import { Menu, X, LogOut } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { navItems } from "./nav-config"
import { Button } from "@/components/ui/button"

interface MobileSidebarProps {
    items?: typeof navItems
}

export function MobileSidebar({ items = navItems }: MobileSidebarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation()

    // Close sidebar when route changes
    useEffect(() => {
        setIsOpen(false)
    }, [location.pathname])

    // Lock body scroll when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    return (
        <div className="lg:hidden">
            {/* Mobile Header Trigger */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-border z-40 flex items-center px-4 justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                        <img src="/logo.svg" alt="HealthTrack Logo" className="h-8 w-8" />
                    </div>
                    <span className="font-bold tracking-tight text-foreground text-lg">HealthTrack+</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                    <Menu className="h-6 w-6" />
                </Button>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Content */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-border/50 flex items-center justify-between">
                        <span className="font-bold text-lg">Menu</span>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {items.map((item) => {
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
                        <button
                            onClick={() => {
                                localStorage.removeItem('token')
                                localStorage.removeItem('user')
                                window.location.href = '/login'
                            }}
                            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
