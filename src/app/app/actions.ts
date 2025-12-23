'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createSessionFromInput(formData: FormData) {
    const rawText = formData.get('input') as string
    if (!rawText || !rawText.trim()) return

    const supabase = await createClient()

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // 2. Create Session
    // Title defaults to first 6 words
    const words = rawText.trim().split(/\s+/)
    const title = words.length > 0 ? words.slice(0, 6).join(' ') + (words.length > 6 ? '...' : '') : 'Untitled Session'

    const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert({
            user_id: user.id,
            title,
            is_archived: false,
        })
        .select()
        .single()

    if (sessionError) {
        console.error('Session creation error:', sessionError)
        throw new Error(sessionError.message)
    }

    // 3. Insert Item
    const { error: itemError } = await supabase
        .from('items')
        .insert({
            session_id: session.id,
            user_id: user.id,
            source_type: 'text',
            raw_text: rawText,
        })

    if (itemError) {
        console.error('Item creation error:', itemError)
        throw new Error(itemError.message)
    }

    // 4. Create 3 placeholder nodes for demo
    // We'll create 3 nodes regardless of text length for the "MVP/Demo" feel
    const nodesPayload = [1, 2, 3].map((i) => ({
        session_id: session.id,
        user_id: user.id,
        title: `Node ${i}`,
        gist: rawText.length > 20 ? rawText.substring((i - 1) * 10, i * 20) : rawText,
        tags: ['demo', `node-${i}`],
    }))

    const { error: nodesError } = await supabase
        .from('nodes')
        .insert(nodesPayload)

    if (nodesError) {
        console.error('Node creation error:', nodesError)
        throw new Error(nodesError.message)
    }

    redirect(`/session/${session.id}`)
}
