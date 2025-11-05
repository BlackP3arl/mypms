'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { Board as BoardType, Task, Column as ColumnType } from '@/lib/types'
import { useBoard } from '@/lib/hooks'
import { Column } from './Column'
import { Card } from './Card'
import { TaskModal } from './TaskModal'
import { ColumnModal } from './ColumnModal'
import { ThemeToggle } from './ThemeToggle'
import { COLUMN_COLORS } from '@/lib/utils'

export function Board() {
  const { board, mounted, addTask, updateTask, deleteTask, moveTask, addColumn, updateColumn, deleteColumn } = useBoard()

  const [activeId, setActiveId] = useState<string | null>(null)
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [columnModalOpen, setColumnModalOpen] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingColumn, setEditingColumn] = useState<ColumnType | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor)
  )

  if (!mounted || !board) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400" />
      </div>
    )
  }

  const handleAddTask = (columnId: string) => {
    setSelectedColumnId(columnId)
    setEditingTask(null)
    setTaskModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setSelectedColumnId(task.columnId)
    setTaskModalOpen(true)
  }

  const handleTaskSubmit = (title: string, description: string) => {
    if (editingTask) {
      updateTask(editingTask.id, { title, description })
    } else if (selectedColumnId) {
      addTask(title, description, selectedColumnId)
    }
  }

  const handleAddColumn = () => {
    setEditingColumn(null)
    setColumnModalOpen(true)
  }

  const handleEditColumn = (column: ColumnType) => {
    setEditingColumn(column)
    setColumnModalOpen(true)
  }

  const handleColumnSubmit = (title: string, color: string) => {
    if (editingColumn) {
      updateColumn(editingColumn.id, { title, color })
    } else {
      addColumn(title, color)
    }
  }

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)

    const { active, over } = event

    if (!over) return

    const activeTask = board.tasks.find((t) => t.id === active.id)
    if (!activeTask) return

    const overColumnId = over.id as string
    if (overColumnId === activeTask.columnId) return

    // Find the target index
    const tasksInTargetColumn = board.tasks.filter((t) => t.columnId === overColumnId)
    const newOrder = tasksInTargetColumn.length

    moveTask(activeTask.id, overColumnId, newOrder)
  }

  const activeTask = activeId ? board.tasks.find((t) => t.id === activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Theme Toggle */}
        <ThemeToggle />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
              {board.title}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Organize and manage your tasks with ease
            </p>
          </div>

          {/* Columns */}
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 scrollbar-thin">
            <AnimatePresence mode="popLayout">
              {board.columns.map((column) => {
                const columnTasks = board.tasks
                  .filter((t) => t.columnId === column.id)
                  .sort((a, b) => a.order - b.order)

                return (
                  <Column
                    key={column.id}
                    column={column}
                    tasks={columnTasks}
                    onAddTask={() => handleAddTask(column.id)}
                    onDeleteTask={deleteTask}
                    onEditTask={handleEditTask}
                    onDeleteColumn={deleteColumn}
                    onEditColumn={handleEditColumn}
                  />
                )
              })}
            </AnimatePresence>

            {/* Add Column Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-shrink-0"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddColumn}
                className="h-full min-h-[24rem] w-72 sm:w-80 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium group backdrop-blur-sm"
              >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                <span>Add Column</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div className="opacity-100">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 w-80 border border-gray-200 dark:border-gray-700 rotate-3">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {activeTask.title}
              </h3>
              {activeTask.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                  {activeTask.description}
                </p>
              )}
            </div>
          </div>
        ) : null}
      </DragOverlay>

      {/* Modals */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleTaskSubmit}
        initialTitle={editingTask?.title}
        initialDescription={editingTask?.description}
        isEditMode={!!editingTask}
      />

      <ColumnModal
        isOpen={columnModalOpen}
        onClose={() => setColumnModalOpen(false)}
        onSubmit={handleColumnSubmit}
        initialTitle={editingColumn?.title}
        initialColor={editingColumn?.color || COLUMN_COLORS[0]}
        isEditMode={!!editingColumn}
      />
    </DndContext>
  )
}
