'use client'

import { useState, useEffect, useCallback } from 'react'
import { Board, Column, Task } from './types'

const BOARD_STORAGE_KEY = 'pms_board'
const DEFAULT_COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-100', order: 0 },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100', order: 1 },
  { id: 'completed', title: 'Completed', color: 'bg-green-100', order: 2 },
]

export function useBoard() {
  const [board, setBoard] = useState<Board | null>(null)
  const [mounted, setMounted] = useState(false)

  const createNewBoard = useCallback(() => {
    const newBoard: Board = {
      id: 'board-1',
      title: 'My Project',
      columns: DEFAULT_COLUMNS,
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setBoard(newBoard)
    localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(newBoard))
  }, [])

  // Initialize board from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(BOARD_STORAGE_KEY)
    if (stored) {
      try {
        setBoard(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse board data:', e)
        createNewBoard()
      }
    } else {
      createNewBoard()
    }
    setMounted(true)
  }, [createNewBoard])

  const saveBoard = useCallback((updatedBoard: Board) => {
    const boardToSave = {
      ...updatedBoard,
      updatedAt: new Date().toISOString(),
    }
    setBoard(boardToSave)
    localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(boardToSave))
  }, [])

  const addTask = useCallback(
    (title: string, description: string, columnId: string) => {
      if (!board) return

      const newTask: Task = {
        id: `task-${Date.now()}`,
        title,
        description,
        columnId,
        order: board.tasks.filter((t) => t.columnId === columnId).length,
        createdAt: new Date().toISOString(),
      }

      saveBoard({
        ...board,
        tasks: [...board.tasks, newTask],
      })

      return newTask
    },
    [board, saveBoard]
  )

  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      if (!board) return

      saveBoard({
        ...board,
        tasks: board.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        ),
      })
    },
    [board, saveBoard]
  )

  const deleteTask = useCallback(
    (taskId: string) => {
      if (!board) return

      saveBoard({
        ...board,
        tasks: board.tasks.filter((t) => t.id !== taskId),
      })
    },
    [board, saveBoard]
  )

  const moveTask = useCallback(
    (taskId: string, targetColumnId: string, newOrder: number) => {
      if (!board) return

      const task = board.tasks.find((t) => t.id === taskId)
      if (!task) return

      const updatedTasks = board.tasks
        .map((t) => {
          if (t.id === taskId) {
            return { ...t, columnId: targetColumnId, order: newOrder }
          }
          // Reorder tasks in the target column
          if (t.columnId === targetColumnId && t.order >= newOrder && t.id !== taskId) {
            return { ...t, order: t.order + 1 }
          }
          // Reorder tasks in the source column
          if (t.columnId === task.columnId && t.order > task.order && t.id !== taskId) {
            return { ...t, order: t.order - 1 }
          }
          return t
        })
        .sort((a, b) => {
          if (a.columnId !== b.columnId) {
            return board.columns.findIndex((c) => c.id === a.columnId) -
              board.columns.findIndex((c) => c.id === b.columnId)
          }
          return a.order - b.order
        })

      saveBoard({
        ...board,
        tasks: updatedTasks,
      })
    },
    [board, saveBoard]
  )

  const addColumn = useCallback(
    (title: string, color: string) => {
      if (!board) return

      const newColumn: Column = {
        id: `col-${Date.now()}`,
        title,
        color,
        order: board.columns.length,
      }

      saveBoard({
        ...board,
        columns: [...board.columns, newColumn],
      })

      return newColumn
    },
    [board, saveBoard]
  )

  const updateColumn = useCallback(
    (columnId: string, updates: Partial<Column>) => {
      if (!board) return

      saveBoard({
        ...board,
        columns: board.columns.map((col) =>
          col.id === columnId ? { ...col, ...updates } : col
        ),
      })
    },
    [board, saveBoard]
  )

  const deleteColumn = useCallback(
    (columnId: string) => {
      if (!board) return

      saveBoard({
        ...board,
        columns: board.columns.filter((c) => c.id !== columnId),
        tasks: board.tasks.filter((t) => t.columnId !== columnId),
      })
    },
    [board, saveBoard]
  )

  return {
    board,
    mounted,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addColumn,
    updateColumn,
    deleteColumn,
    saveBoard,
  }
}

export function useAIPromptGenerator() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generatePrompt = useCallback(
    async (taskTitle: string): Promise<string | null> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/generate-prompt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ taskTitle }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to generate prompt')
        }

        const data = await response.json()
        return data.prompt
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
        console.error('Error generating prompt:', err)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { generatePrompt, loading, error }
}
