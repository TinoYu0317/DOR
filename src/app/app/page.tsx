import { createClient } from '@/utils/supabase/server'
import { DashboardLayout } from '@/components/DashboardLayout'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { UniversalInputBar } from '@/components/UniversalInputBar'

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
        <DashboardLayout user={user}>
            <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] space-y-16 pb-32">
                {/* Empty State / Welcome */}
                {!sessions || sessions.length === 0 ? (
                    <div className="text-center space-y-3">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Welcome to DOR
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            Start a new session to begin capturing your thoughts.
                        </p>
                    </div>
                ) : null}

                {/* Recent Sessions List (Only showing if they exist, but we might want to move this to sidebar mainly) */}
                {sessions && sessions.length > 0 && (
                    <div className="w-full space-y-6">
                        <h3 className="text-center text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">Recent Sessions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sessions.map(session => (
                                <Link href={`/session/${session.id}`} key={session.id} className="block group">
                                    <div className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-blue-500/20 dark:hover:border-blue-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-blue-500 transition-colors">
                                            {session.title}
                                        </h4>
                                        <div className="mt-2 flex justify-between items-center">
                                            <span className="text-xs text-gray-400 font-mono">
                                                {new Date(session.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="w-full max-w-2xl">
                    <UniversalInputBar />
                </div>
            </div>
        </DashboardLayout>
    )
}
