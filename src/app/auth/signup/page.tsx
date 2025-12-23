'use client'

import { useActionState } from 'react'
import { signup } from '../actions'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

const initialState = {
    error: '',
}

export default function SignupPage() {
    const [state, formAction, isPending] = useActionState(signup, initialState)
    const supabase = createClient()

    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 ring-1 ring-gray-900/5 shadow-xl backdrop-blur-3xl">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Start organizing your thoughts with DOR
                    </p>
                </div>
                <form action={formAction} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        {state?.error && (
                            <p className="text-sm text-red-600 mb-4">{state.error}</p>
                        )}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex w-full justify-center rounded-lg bg-black px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50 transition-all cursor-pointer"
                        >
                            {isPending ? 'Sign up' : 'Sign up'}
                        </button>
                    </div>
                </form>

                <div className="relative mt-8">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm font-medium leading-6">
                        <span className="bg-white px-6 text-gray-900">Or continue with</span>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={signInWithGoogle}
                        className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent transition-all cursor-pointer"
                    >
                        <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                            <path
                                d="M12.0003 20.45c4.6667 0 7.9167-3.25 7.9167-7.75 0-.4167-.0417-1.1667-.125-1.5833h-7.7917v3.0833h4.4167c-.2084 1.25-1.2084 3.4167-4.4167 3.4167-2.6667 0-4.8333-2.1667-4.8333-4.8333s2.1666-4.8333 4.8333-4.8333c1.25 0 2.3333.4167 3.25 1.25l2.25-2.25c-1.5-1.4167-3.4167-2.25-5.5-2.25-4.5417 0-8.2083 3.6667-8.2083 8.2083s3.6666 8.2083 8.2083 8.2083z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12.0003 4.0833c1.5 0 3.4167.8334 5.5 2.25l2.25-2.25c-2.3333-2.1667-5.3333-3.0833-7.75-3.0833-4.6667 0-8.6667 2.6667-10.5 6.5l2.625 2c1.0833-3.25 4.1667-5.4167 7.875-5.4167z"
                                fill="#EA4335"
                            />
                            <path
                                d="M1.5003 10.75c-.375 1.125-.5833 2.3333-.5833 3.5833s.2083 2.4583.5833 3.5833l2.625-2c-.25-.8333-.4167-1.6666-.4167-2.4583s.1667-1.625.4167-2.4583l-2.625-2z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12.0003 20.45c-3.7083 0-6.7917-2.1667-7.875-5.4167l-2.625 2c1.8333 3.8334 5.8333 6.5 10.5 6.5 2.4167 0 5.4167-.9166 7.75-3.0833l-2.2083-1.8333c-.9167.5833-2.0834.9166-3.7917.9166z"
                                fill="#34A853"
                            />
                        </svg>
                        <span className="text-gray-500">Google</span>
                    </button>
                </div>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="font-semibold leading-6 text-black hover:text-gray-700 underline underline-offset-2">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
