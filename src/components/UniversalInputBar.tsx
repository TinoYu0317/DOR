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
        <div className="w-full relative z-20">
            <div
                className={`bg-white dark:bg-[#1a1a1a] rounded-[2rem] shadow-sm border border-gray-200 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300 ${isFocused ? 'shadow-md ring-black/10 dark:ring-white/10' : ''}`}
            >
                <form
                    action={(formData) => {
                        setIsSubmitting(true)
                        createSessionFromInput(formData)
                    }}
                    className="relative w-full flex flex-col"
                    onSubmit={() => setIsSubmitting(true)}
                >
                    <div className="flex items-center px-4 py-3 gap-3 w-full relative">
                        <div className="flex items-center justify-center shrink-0">
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
                                        <Disc className="w-6 h-6 text-black dark:text-white transition-colors" />
                                    ) : (
                                        <Disc className="w-6 h-6 text-blue-600 dark:text-blue-400 transition-colors" />
                                    )}
                                </div>
                            )}
                        </div>

                        <input
                            name="input"
                            type="text"
                            placeholder="What's on your mind?"
                            autoComplete="off"
                            className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-400 h-full py-2 font-medium"
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => !inputValue && setIsFocused(false)}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            autoFocus={false}
                        />

                        <div className="flex items-center gap-2 text-gray-400 shrink-0">
                            {inputValue ? (
                                <button type="submit" className="p-2 rounded-full bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity cursor-pointer">
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                            ) : (
                                <>
                                    <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"><Mic className="w-5 h-5" /></button>
                                    <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"><Paperclip className="w-5 h-5" /></button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Helper text - minimal and stable */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isFocused ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <div className="px-14 pb-3 text-xs text-gray-400 dark:text-gray-500 flex gap-4">
                            <span>Press Enter to submit</span>
                            <span>Shift + Enter for new line</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
