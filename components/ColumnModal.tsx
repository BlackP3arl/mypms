'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { COLUMN_COLORS } from '@/lib/utils'

interface ColumnModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (title: string, color: string) => void
  initialTitle?: string
  initialColor?: string
  isEditMode?: boolean
}

export function ColumnModal({
  isOpen,
  onClose,
  onSubmit,
  initialTitle = '',
  initialColor = COLUMN_COLORS[0],
  isEditMode = false,
}: ColumnModalProps) {
  const [title, setTitle] = useState(initialTitle)
  const [color, setColor] = useState(initialColor)

  useEffect(() => {
    setTitle(initialTitle)
    setColor(initialColor)
  }, [initialTitle, initialColor, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSubmit(title, color)
      setTitle('')
      setColor(COLUMN_COLORS[0])
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {isEditMode ? 'Edit Column' : 'Add New Column'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-white/50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Column Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter column title..."
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Column Color
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {COLUMN_COLORS.map((col) => (
                      <motion.button
                        key={col}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setColor(col)}
                        className={`w-14 h-14 rounded-lg transition-all border-2 ${col} ${
                          color === col
                            ? 'border-blue-600 dark:border-blue-400 shadow-lg ring-2 ring-blue-300 dark:ring-blue-500'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-500/50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!title.trim()}
                  >
                    {isEditMode ? 'Update Column' : 'Create Column'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
