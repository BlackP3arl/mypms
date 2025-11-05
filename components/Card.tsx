'use client'

import { Task } from '@/lib/types'
import { motion } from 'framer-motion'
import { Trash2, Edit2, Sparkles } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { formatDate } from '@/lib/utils'

interface CardProps {
  task: Task
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
  onGeneratePrompt?: (task: Task) => void
}

export function Card({ task, onDelete, onEdit, onGeneratePrompt }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group"
    >
      <div
        {...attributes}
        {...listeners}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg dark:hover:shadow-xl transition-all cursor-grab active:cursor-grabbing p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 group-hover:border-blue-300 dark:group-hover:border-blue-600 ${
          isDragging ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-xl' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white flex-1 line-clamp-2 text-sm leading-5">
            {task.title}
          </h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
            {onGeneratePrompt && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onGeneratePrompt(task)
                }}
                className="p-1.5 hover:bg-yellow-50 rounded transition-colors"
                title="Generate Claude Code prompt"
              >
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(task)
              }}
              className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
              title="Edit task"
            >
              <Edit2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(task.id)
              }}
              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(task.createdAt)}
          </span>
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </motion.div>
  )
}
