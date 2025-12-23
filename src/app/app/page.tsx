import { createClient } from '@/utils/supabase/server'
import { AppHeader } from '@/components/AppHeader'
import { UniversalInputBar } from '@/components/UniversalInputBar'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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
            <AppHeader />

            {/* Content */}
            <div className="pt-32 px-6 max-w-5xl mx-auto space-y-16">


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
