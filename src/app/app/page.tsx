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

    // Fetch recent sessions - User requested sort by created time
    const { data: sessions } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20) // Increased limit for sidebar

    return (
        <DashboardLayout user={user} sessions={sessions || []}>
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

                <div className="w-full max-w-2xl">
                    <UniversalInputBar />
                </div>
            </div>
        </DashboardLayout>
    )
}
