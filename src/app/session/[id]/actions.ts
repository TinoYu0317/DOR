'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateNode(sessionId: string, nodeId: string, title: string, gist: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('nodes')
        .update({ title, gist, updated_at: new Date().toISOString() })
        .eq('id', nodeId)

    if (error) throw new Error(error.message)

    revalidatePath(`/session/${sessionId}`)
}
