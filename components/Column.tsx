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
  onGeneratePrompt?: (task: Task) => void
}

export function Column({
  column,
  tasks,
  onAddTask,
  onDeleteTask,
  onEditTask,
  onDeleteColumn,
  onEditColumn,
  onGeneratePrompt,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  const [isHovering, setIsHovering] = useState(false)

  return (
    <motion.div
      layout
      className="flex-shrink-0 w-96"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div
        className={`h-full rounded-xl transition-all duration-200 ${getColorClass(column.color)} border-2 ${
          isOver ? 'border-blue-400 shadow-xl' : 'border-current/10 shadow-sm'
        } flex flex-col`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Header */}
        <div className="p-4 border-b border-current/10 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 text-lg">{column.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
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
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                title="Edit column"
              >
                <Edit2 className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => onDeleteColumn(column.id)}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                title="Delete column"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Tasks Container */}
        <div
          ref={setNodeRef}
          className={`flex-1 overflow-y-auto p-4 space-y-3 transition-all duration-200 ${
            isOver ? 'bg-white/50' : ''
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
                    onGeneratePrompt={onGeneratePrompt}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-8 text-gray-400"
                >
                  <p className="text-sm text-center">
                    {isOver ? 'Drop here' : 'No tasks yet'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </SortableContext>
        </div>

        {/* Add Task Button */}
        <div className="p-4 border-t border-current/10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddTask}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white hover:shadow-md transition-all border border-gray-200 text-gray-700 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
