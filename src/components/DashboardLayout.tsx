'use client'

import { useState, useEffect } from 'react'
import { PanelLeftClose, PanelLeftOpen, LogOut, MessageSquare, Network, Sun, Moon, User as UserIcon, Plus } from 'lucide-react'
import { signout } from '@/app/auth/actions'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

interface DashboardLayoutProps {
    user: User
    children: React.ReactNode
}

export function DashboardLayout({ user, children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [viewMode, setViewMode] = useState<'chat' | 'mindmap'>('chat')
    const [isDarkMode, setIsDarkMode] = useState(false)

    // Initialize theme
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme')
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
            setIsDarkMode(true)
            document.documentElement.classList.add('dark')
        } else {
            setIsDarkMode(false)
            document.documentElement.classList.remove('dark')
        }
    }, [])

    const toggleTheme = () => {
        const newMode = !isDarkMode
        setIsDarkMode(newMode)
        if (newMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }

    const toggleView = () => {
        setViewMode(prev => prev === 'chat' ? 'mindmap' : 'chat')
    }

    return (
        <div className="flex h-screen w-full overflow-hidden transition-colors duration-300">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-[280px]' : 'w-0'
                    } flex-shrink-0 bg-gray-50/80 dark:bg-black/40 backdrop-blur-xl border-r border-gray-200/50 dark:border-white/5 transition-all duration-300 ease-in-out flex flex-col overflow-hidden relative z-20`}
            >
                {/* Sidebar Header (New Chat) */}
                <div className="p-4">
                    <button className="flex items-center gap-3 w-full px-4 py-3 rounded-full bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200/50 dark:border-transparent transition-all shadow-sm group">
                        <Plus className="w-5 h-5 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                        <span className="font-medium">New chat</span>
                        <span className="ml-auto text-xs text-gray-400">⌘N</span>
                    </button>
                </div>

                {/* Sidebar Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto px-3 py-2">
                    <div className="text-xs font-medium text-gray-400 px-3 py-2">Recent</div>
                    {/* Placeholder for list items */}
                    <div className="space-y-1">
                        {[1, 2, 3].map((i) => (
                            <button key={i} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-white/5 rounded-xl truncate transition-colors">
                                Project Meeting Notes {i}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sidebar Footer (User Profile) */}
                <div className="p-4 border-t border-gray-200/50 dark:border-white/5">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-3xl hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 text-gray-600 dark:text-gray-300">
                            <UserIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                                {user.email?.split('@')[0]}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                Free Plan
                            </div>
                        </div>
                        <form action={signout}>
                            <button type="submit" className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-all text-gray-500">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full min-w-0 relative">
                {/* Top Navigation Bar */}
                <header className="h-14 flex items-center justify-between px-4 flex-shrink-0 z-10">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                            title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                        >
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>

                        {/* Model/View Switcher (Center-ish / Left-aligned) */}
                        <div className="hidden md:flex items-center gap-1 text-lg font-medium text-gray-400 select-none">
                            <span className={viewMode === 'chat' ? 'text-gray-900 dark:text-white' : ''}>DOR 1.0</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* View Toggle Button */}
                        <button
                            onClick={toggleView}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-sm font-medium transition-colors"
                        >
                            {viewMode === 'chat' ? (
                                <>
                                    <Network className="w-4 h-4" />
                                    <span>Mindmap</span>
                                </>
                            ) : (
                                <>
                                    <MessageSquare className="w-4 h-4" />
                                    <span>Chat</span>
                                </>
                            )}
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>
                </header>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-3xl mx-auto w-full px-4 h-full flex flex-col">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
