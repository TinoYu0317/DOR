import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { BubbleMap } from '@/components/BubbleMap'

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function SessionPage(props: PageProps) {
    const params = await props.params
    const { id } = params

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: session } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', id)
        .single()

    if (!session) redirect('/app')

    const { data: nodes } = await supabase
        .from('nodes')
        .select('*')
        .eq('session_id', id)
        .order('created_at')

    return (
        <div className="h-screen w-full relative overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
            <header className="absolute top-0 left-0 w-full p-6 z-20 flex items-center justify-between pointer-events-none">
                <Link href="/app" className="pointer-events-auto p-3 hover:bg-white/80 backdrop-blur-md rounded-full transition-all cursor-pointer text-gray-500 hover:text-black shadow-sm border border-transparent hover:border-gray-200">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-sm font-medium text-gray-400 uppercase tracking-widest bg-white/50 backdrop-blur-md px-4 py-1 rounded-full">{session.title}</h1>
                <div className="w-10"></div>
            </header>

            <BubbleMap nodes={nodes || []} session={session} />
        </div>
    )
}
