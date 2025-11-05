'use client'

import { Column as ColumnType, Task } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card } from './Card'
import { getColorClass } from '@/lib/utils'
import { useState } from 'react'

interface ColumnProps {
  column: ColumnType
  tasks: Task[]
  onAddTask: () => void
  onDeleteTask: (id: string) => void
  onEditTask: (task: Task) => void
  onDeleteColumn: (id: string) => void
  onEditColumn: (column: ColumnType) => void
}

export function Column({
  column,
  tasks,
  onAddTask,
  onDeleteTask,
  onEditTask,
  onDeleteColumn,
  onEditColumn,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  const [isHovering, setIsHovering] = useState(false)

  return (
    <motion.div
      layout
      className="flex-shrink-0 w-80 sm:w-96"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div
        className={`h-full rounded-xl transition-all duration-200 ${getColorClass(column.color)} border-2 ${
          isOver
            ? 'border-blue-400 dark:border-blue-500 shadow-xl dark:shadow-2xl'
            : 'border-current/20 dark:border-current/30 shadow-md dark:shadow-lg'
        } flex flex-col backdrop-blur-sm`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-current/20 dark:border-current/30 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl">
              {column.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </p>
          </div>
          {isHovering && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex gap-1"
            >
              <button
                onClick={() => onEditColumn(column)}
                className="p-2 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-lg transition-colors"
                title="Edit column"
              >
                <Edit2 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={() => onDeleteColumn(column.id)}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Delete column"
              >
                <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Tasks Container */}
        <div
          ref={setNodeRef}
          className={`flex-1 overflow-y-auto p-4 space-y-3 transition-all duration-200 min-h-[300px] ${
            isOver ? 'bg-white/60 dark:bg-gray-800/60' : ''
          }`}
        >
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence mode="popLayout">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <Card
                    key={task.id}
                    task={task}
                    onDelete={onDeleteTask}
                    onEdit={onEditTask}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-12 text-gray-400 dark:text-gray-500"
                >
                  <p className="text-sm text-center font-medium">
                    {isOver ? '✨ Drop here' : 'No tasks yet'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </SortableContext>
        </div>

        {/* Add Task Button */}
        <div className="p-4 border-t border-current/20 dark:border-current/30">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddTask}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md dark:hover:shadow-xl transition-all border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
