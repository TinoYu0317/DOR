'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Disc, ArrowUp, Mic, Paperclip } from 'lucide-react'
import { createSessionFromInput } from '@/app/app/actions'

export function UniversalInputBar() {
    const [isFocused, setIsFocused] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    return (
        <>
            <motion.div
                initial={false}
                animate={isFocused ? {
                    bottom: 'auto',
                    top: '15vh',
                    y: 0
                } : {
                    bottom: '2rem',
                    top: 'auto',
                    y: 0
                }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                className="fixed left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
            >
                <motion.div
                    layout
                    className={`pointer-events-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 ring-1 ring-black/5 overflow-hidden transition-all duration-500 will-change-transform ${isFocused ? 'w-full max-w-3xl min-h-[120px]' : 'w-full max-w-xl min-h-[64px]'}`}
                    onHoverStart={() => !isFocused && setIsFocused(false)} // Just a trigger placeholder
                >
                    <form
                        action={(formData) => {
                            setIsSubmitting(true)
                            createSessionFromInput(formData)
                        }}
                        className="relative w-full h-full flex flex-col"
                        onSubmit={() => setIsSubmitting(true)}
                    >

                        <div className="flex items-center px-4 py-3 gap-3 w-full h-full relative grow">
                            <div className="flex items-center justify-center">
                                {isSubmitting ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                    >
                                        <Disc className="w-6 h-6 text-gray-400" />
                                    </motion.div>
                                ) : (
                                    <div className="relative flex items-center justify-center">
                                        {isFocused ? (
                                            <Disc className="w-6 h-6 text-black transition-colors" />
                                        ) : (
                                            <>
                                                <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-blue-500 scale-150"></span>
                                                <Disc className="w-6 h-6 text-blue-600 transition-colors" />
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <input
                                name="input"
                                type="text"
                                placeholder="What's on your mind?"
                                autoComplete="off"
                                className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 placeholder:text-gray-400 h-full py-2 font-medium"
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => !inputValue && setIsFocused(false)}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                autoFocus={false}
                            />

                            <div className="flex items-center gap-2 text-gray-400">
                                {inputValue ? (
                                    <button type="submit" className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors cursor-pointer">
                                        <ArrowUp className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <>
                                        <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"><Mic className="w-5 h-5" /></button>
                                        <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"><Paperclip className="w-5 h-5" /></button>
                                    </>
                                )}
                            </div>
                        </div>

                        {isFocused && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="px-14 pb-4 text-xs text-gray-400 flex gap-4 border-t border-gray-100 pt-3 mt-auto"
                            >
                                <span>Press Enter to submit</span>
                                <span>Shift + Enter for new line</span>
                            </motion.div>
                        )}

                    </form>
                </motion.div>
            </motion.div>

            {/* Click backdrop to unfocus */}
            {isFocused && (
                <div className="fixed inset-0 z-40 bg-white/50 backdrop-blur-sm" onClick={() => !inputValue && setIsFocused(false)} />
            )}
        </>
    )
}
