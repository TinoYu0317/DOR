'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { updateNode } from '@/app/session/[id]/actions'
import { X, Check } from 'lucide-react'

export function BubbleMap({ nodes, session }: { nodes: any[], session: any }) {
    const [selectedNode, setSelectedNode] = useState<any>(null)

    // Drawer state
    const [editTitle, setEditTitle] = useState('')
    const [editGist, setEditGist] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const handleNodeClick = (node: any) => {
        setSelectedNode(node)
        setEditTitle(node.title || '')
        setEditGist(node.gist || '')
    }

    const handleSave = async () => {
        if (!selectedNode) return
        setIsSaving(true)
        try {
            await updateNode(session.id, selectedNode.id, editTitle, editGist)
            setSelectedNode(null)
        } catch (e) {
            console.error(e)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="w-full h-full flex items-center justify-center p-10 overflow-auto">
            <div className="flex flex-wrap justify-center items-center gap-8 max-w-5xl">
                {nodes.map((node, i) => (
                    <motion.div
                        key={node.id}
                        layoutId={`node-${node.id}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1, type: 'spring', bounce: 0.5 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleNodeClick(node)}
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center p-6 cursor-pointer hover:shadow-xl hover:border-blue-200 transition-all text-center relative group"
                    >
                        <div className="absolute inset-2 rounded-full border border-gray-50 opacity-50 pointer-events-none"></div>

                        <h3 className="text-sm font-medium text-gray-800 line-clamp-3 leading-tight group-hover:text-blue-600 transition-colors select-none">
                            {node.title || 'Untitled'}
                        </h3>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedNode && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                            onClick={() => setSelectedNode(null)}
                        />
                        <motion.div
                            initial={{ x: '100%', opacity: 0.5 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-white z-50 shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Edit Node</h2>
                                <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-black">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-8 flex-1 overflow-auto space-y-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Title</label>
                                    <input
                                        value={editTitle}
                                        onChange={e => setEditTitle(e.target.value)}
                                        className="w-full text-3xl font-bold text-gray-900 border-none outline-none placeholder:text-gray-200 bg-transparent"
                                        placeholder="Node Title"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Content</label>
                                    <textarea
                                        value={editGist}
                                        onChange={e => setEditGist(e.target.value)}
                                        className="w-full h-80 text-lg text-gray-600 leading-8 border-none outline-none resize-none placeholder:text-gray-200 bg-transparent font-serif"
                                        placeholder="Capture the essence..."
                                    />
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <span className="text-xs text-gray-400">Last updated today</span>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all font-medium disabled:opacity-50 hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-black/20"
                                >
                                    {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Check className="w-4 h-4" />}
                                    <span>Save</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
