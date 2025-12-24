'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Disc, ArrowUp, Mic, Paperclip, Sparkles, Bot, Check, ChevronDown } from 'lucide-react'
import { createSessionFromInput } from '@/app/app/actions'

export function UniversalInputBar() {
    const [isFocused, setIsFocused] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [model, setModel] = useState<'gemini' | 'chatgpt'>('gemini')
    const [showModelMenu, setShowModelMenu] = useState(false)

    return (
        <div className="w-full relative z-20">
            <div
                className={`bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-gray-200 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300 ${isFocused ? 'shadow-md ring-black/10 dark:ring-white/10' : ''}`}
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
                        <div className="relative flex items-center justify-center shrink-0">
                            {/* Model Switcher Trigger */}
                            <button
                                type="button"
                                onClick={() => setShowModelMenu(!showModelMenu)}
                                className="relative group flex items-center justify-center outline-none"
                            >
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                                    ${showModelMenu ? 'bg-gray-100 dark:bg-white/10' : ''}
                                `}>
                                    {isSubmitting ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                        >
                                            <Disc className="w-6 h-6 text-gray-400" />
                                        </motion.div>
                                    ) : model === 'gemini' ? (
                                        <Sparkles
                                            className={`w-5 h-5 transition-all text-gray-900 dark:text-white ${isFocused ? 'scale-110' : 'opacity-70'} dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`}
                                        />
                                    ) : (
                                        <Bot
                                            className={`w-5 h-5 transition-all text-gray-900 dark:text-white ${isFocused ? 'scale-110' : 'opacity-70'} dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`}
                                        />
                                    )}
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {showModelMenu && (
                                    <>
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 z-40 bg-transparent"
                                            onClick={() => setShowModelMenu(false)}
                                        />

                                        {/* Menu */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15, ease: "easeOut" }}
                                            className="absolute bottom-full left-0 mb-3 w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col p-1.5"
                                        >
                                            <div className="px-2 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                                Select Model
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => { setModel('gemini'); setShowModelMenu(false); }}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${model === 'gemini' ? 'bg-blue-50/50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                            >
                                                <Sparkles className="w-4 h-4" />
                                                <span className="flex-1 text-left font-medium">Gemini 2.0</span>
                                                {model === 'gemini' && <Check className="w-3.5 h-3.5" />}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => { setModel('chatgpt'); setShowModelMenu(false); }}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${model === 'chatgpt' ? 'bg-green-50/50 dark:bg-emerald-500/10 text-green-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                            >
                                                <Bot className="w-4 h-4" />
                                                <span className="flex-1 text-left font-medium">ChatGPT</span>
                                                {model === 'chatgpt' && <Check className="w-3.5 h-3.5" />}
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
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
