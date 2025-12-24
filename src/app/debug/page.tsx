import { createClient } from '@/utils/supabase/server'

export default async function DebugPage() {
    const supabase = await createClient()

    // Test connection and table existence
    const { data, error } = await supabase
        .from('sessions')
        .select('count')
        .limit(1)
        .single()

    const { data: authData, error: authError } = await supabase.auth.getUser()

    return (
        <div className="p-10 font-mono text-sm space-y-6">
            <h1 className="text-2xl font-bold mb-4">Database Debugger</h1>

            <div className="border p-4 rounded bg-gray-50 dark:bg-zinc-900">
                <h2 className="font-bold mb-2">Auth Status</h2>
                <pre>{JSON.stringify({ user: authData?.user?.id || 'No User', error: authError }, null, 2)}</pre>
            </div>

            <div className="border p-4 rounded bg-gray-50 dark:bg-zinc-900">
                <h2 className="font-bold mb-2">Sessions Table Check</h2>
                {error ? (
                    <div className="text-red-500">
                        <p className="font-bold">Error: {error.message}</p>
                        <p>Code: {error.code}</p>
                        <p>Details: {error.details}</p>
                        <p>Hint: {error.hint}</p>
                        <pre className="mt-2 text-xs">{JSON.stringify(error, null, 2)}</pre>
                    </div>
                ) : (
                    <div className="text-green-500">
                        <p>Success! Connection established.</p>
                        <pre>{JSON.stringify(data, null, 2)}</pre>
                    </div>
                )}
            </div>

            {error?.message.includes('relation') && (
                <div className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded border border-yellow-200 dark:border-yellow-800">
                    <h3 className="font-bold text-yellow-800 dark:text-yellow-200">Action Required</h3>
                    <p className="mb-2">The table `sessions` does not exist in your Supabase database.</p>
                    <p>Please go to your <a href="https://supabase.com/dashboard" target="_blank" className="underline text-blue-600">Supabase Dashboard</a>, open the SQL Editor, and run the schema found in <code>/supabase/schema.sql</code>.</p>
                </div>
            )}
        </div>
    )
}
