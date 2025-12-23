'use client'

import { useActionState } from 'react'
import { signup } from '../actions'
import Link from 'next/link'

const initialState = {
    error: '',
}

export default function SignupPage() {
    const [state, formAction, isPending] = useActionState(signup, initialState)

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
