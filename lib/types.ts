export interface Task {
  id: string
  title: string
  description: string
  columnId: string
  order: number
  createdAt: string
}

export interface Column {
  id: string
  title: string
  color: string
  order: number
}

export interface Board {
  id: string
  title: string
  columns: Column[]
  tasks: Task[]
  createdAt: string
  updatedAt: string
}

export interface DragItem {
  id: string
  type: 'task'
  columnId: string
}
