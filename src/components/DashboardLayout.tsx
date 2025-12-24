'use client'

import { useState, useEffect } from 'react'
import { PanelLeftClose, PanelLeftOpen, LogOut, MessageSquare, Network, Sun, Moon, User as UserIcon, Plus, LayoutGrid, List } from 'lucide-react'
import { signout } from '@/app/auth/actions'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

interface DashboardLayoutProps {
    user: User
    children: React.ReactNode
    sessions?: any[]
}

export function DashboardLayout({ user, children, sessions = [] }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [viewMode, setViewMode] = useState<'chat' | 'mindmap'>('chat')
    const [layoutMode, setLayoutMode] = useState<'list' | 'grid'>('list')
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [isSubChatOpen, setIsSubChatOpen] = useState(false)

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
                    } flex-shrink-0 bg-gray-50/80 dark:bg-zinc-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-white/5 transition-all duration-300 ease-in-out flex flex-col overflow-hidden relative z-20`}
            >
                {/* Sidebar Header (New Chat & Sub Chat) */}
                <div className="p-4 flex gap-2">
                    <button className="flex-1 flex items-center gap-3 px-4 py-3 rounded-full bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200/50 dark:border-transparent transition-all shadow-sm group">
                        <Plus className="w-5 h-5 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                        <span className="font-medium text-sm">New chat</span>
                    </button>
                    <button
                        onClick={() => setIsSubChatOpen(!isSubChatOpen)}
                        className={`p-3 rounded-full border border-gray-200/50 dark:border-transparent transition-all shadow-sm group ${isSubChatOpen ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300' : 'bg-white dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'}`}
                        title="Toggle Sub Chat"
                    >
                        <MessageSquare className="w-5 h-5" />
                    </button>
                </div>

                {/* Sidebar Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto px-3 py-2">
                    <div className="flex items-center justify-between px-3 py-2 mb-1">
                        <div className="text-xs font-medium text-gray-400">Recent</div>
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-0.5 rounded-lg">
                            <button
                                onClick={() => setLayoutMode('list')}
                                className={`p-1 rounded-md transition-all ${layoutMode === 'list' ? 'bg-white dark:bg-white/10 shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                            >
                                <List className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setLayoutMode('grid')}
                                className={`p-1 rounded-md transition-all ${layoutMode === 'grid' ? 'bg-white dark:bg-white/10 shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                            >
                                <LayoutGrid className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className={layoutMode === 'grid' ? 'grid grid-cols-2 gap-2' : 'space-y-0.5'}>
                        {sessions.length === 0 ? (
                            <div className="p-4 text-center text-xs text-gray-400">
                                No sessions yet.
                            </div>
                        ) : (
                            sessions.map((session, i) => (
                                <Link
                                    key={session.id}
                                    href={`/session/${session.id}`}
                                    className={`
                                        block group w-full text-left transition-all duration-200
                                        ${layoutMode === 'grid'
                                            ? 'aspect-square p-3 flex flex-col justify-between bg-white dark:bg-white/5 border border-gray-200/50 dark:border-white/5 rounded-2xl hover:border-gray-300 dark:hover:border-white/20 hover:shadow-md'
                                            : 'px-3 py-3 border-b border-gray-100/50 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg'
                                        }
                                    `}
                                >
                                    {layoutMode === 'grid' ? (
                                        <>
                                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xs font-medium text-gray-500">
                                                {session.title.substring(0, 1).toUpperCase()}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="font-medium text-xs text-gray-900 dark:text-gray-200 line-clamp-2 leading-relaxed">
                                                    {session.title}
                                                </div>
                                                <div className="text-[10px] text-gray-400">
                                                    {new Date(session.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{session.title}</span>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {new Date(session.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </Link>
                            ))
                        )}
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
                        <div className="hidden md:flex items-center gap-1 text-lg font-bold text-gray-400 select-none">
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

            {/* Right Panel (Sub Chat) */}
            <aside
                className={`${isSubChatOpen ? 'w-[350px] border-l' : 'w-0'
                    } flex-shrink-0 bg-gray-50/80 dark:bg-zinc-900/80 backdrop-blur-xl border-gray-200/50 dark:border-white/5 transition-all duration-300 ease-in-out flex flex-col overflow-hidden relative z-20`}
            >
                <div className="h-14 flex items-center px-4 border-b border-gray-200/50 dark:border-white/5 flex-shrink-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Sub Chat</h3>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-10">
                        Select a thread to view details or start a side conversation.
                    </div>
                </div>
            </aside>
        </div>
    )
}
