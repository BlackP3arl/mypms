'use client'

import { Task } from '@/lib/types'
import { motion } from 'framer-motion'
import { Trash2, Edit2 } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { formatDate } from '@/lib/utils'

interface CardProps {
  task: Task
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

export function Card({ task, onDelete, onEdit }: CardProps) {
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
        className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing p-4 border border-gray-100 hover:border-blue-200 group-hover:border-blue-200 ${
          isDragging ? 'ring-2 ring-blue-500' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 flex-1 line-clamp-2 text-sm leading-5">
            {task.title}
          </h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 hover:bg-blue-50 rounded transition-colors"
              title="Edit task"
            >
              <Edit2 className="w-4 h-4 text-blue-500" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 hover:bg-red-50 rounded transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {formatDate(task.createdAt)}
          </span>
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </motion.div>
  )
}
