'use client'

import { useState, useEffect } from 'react'
import { LogOut, Sun, Moon, MessageSquare, Network, User } from 'lucide-react'
import { signout } from '@/app/auth/actions'
import Link from 'next/link'

export function AppHeader() {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [isChatView, setIsChatView] = useState(true)

    // Initialize state from local storage or system preference
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
        setIsChatView(!isChatView)
        // Logic to switch view will be implemented later, or we can use URL query/routing
    }

    return (
        <header className="absolute top-0 w-full p-6 flex justify-between items-center z-30">
            {/* Left: User Setting Icon */}
            <div className="flex items-center">
                <Link href="/settings" className="p-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer">
                    <User className="w-5 h-5" />
                    <span className="sr-only">User Settings</span>
                </Link>
            </div>

            {/* Right: Controls & Logout */}
            <div className="flex items-center gap-4">
                {/* View Switch */}
                <button
                    onClick={toggleView}
                    className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    title={isChatView ? "Switch to Mindmap" : "Switch to Chat"}
                >
                    <div className={`p-1.5 rounded-md transition-all ${isChatView ? 'bg-white dark:bg-gray-700 shadow-sm text-black dark:text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'}`}>
                        <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className={`p-1.5 rounded-md transition-all ${!isChatView ? 'bg-white dark:bg-gray-700 shadow-sm text-black dark:text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'}`}>
                        <Network className="w-4 h-4" />
                    </div>
                </button>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-full transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer"
                    title="Toggle Theme"
                >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Divider */}
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>

                {/* Logout */}
                <form action={signout}>
                    <button type="submit" className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-full transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer">
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign out</span>
                    </button>
                </form>
            </div>
        </header>
    )
}
