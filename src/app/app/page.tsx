import { createClient } from '@/utils/supabase/server'
import { UniversalInputBar } from '@/components/UniversalInputBar'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { signout } from '@/app/auth/actions'

export default async function AppPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/auth/login')
    }

    // Fetch recent sessions
    const { data: sessions } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(3)

    return (
        <main className="min-h-screen relative pb-32">
            {/* Header with Logout */}
            <header className="absolute top-0 w-full p-6 flex justify-end z-30">
                <form action={signout}>
                    <button type="submit" className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-black bg-white/50 hover:bg-white rounded-full transition-all border border-transparent hover:border-gray-200 cursor-pointer">
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign out</span>
                    </button>
                </form>
            </header>

            {/* Content */}
            <div className="pt-32 px-6 max-w-5xl mx-auto space-y-16">
                <div className="text-center space-y-3">
                    <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight font-serif italic">
                        Start somewhere.
                    </h1>
                    <p className="text-gray-400 font-light">Capture your thoughts, voice, or files.</p>
                </div>

                {sessions && sessions.length > 0 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-backwards">
                        <h3 className="text-center text-xs font-medium uppercase tracking-widest text-gray-400">Recent Sessions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {sessions.map(session => (
                                <Link href={`/session/${session.id}`} key={session.id} className="block group">
                                    <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-40 flex flex-col justify-between">
                                        <h4 className="font-medium text-lg text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                            {session.title}
                                        </h4>
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs text-gray-400 font-mono">
                                                {new Date(session.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                            <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-500 transition-colors"></div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <UniversalInputBar />
        </main>
    )
}
