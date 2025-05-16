import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { getIcon } from '../utils/iconUtils'

const PlusIcon = getIcon('Plus')
const CircleIcon = getIcon('Circle')
const CheckCircleIcon = getIcon('CheckCircle')
const TrashIcon = getIcon('Trash')
const EditIcon = getIcon('Edit')
const InfoIcon = getIcon('Info')
const XIcon = getIcon('X')
const FlagIcon = getIcon('Flag')
const CalendarIcon = getIcon('Calendar')
const SaveIcon = getIcon('Save')
const FilterIcon = getIcon('Filter')
const AlertCircleIcon = getIcon('AlertCircle')
const CheckIcon = getIcon('Check')

const priorityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
}

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" }
]

const MainFeature = ({ updateStats }) => {
  // Load tasks from localStorage or set default
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  })
  
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState('all')
  const [detailsTaskId, setDetailsTaskId] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  
  // Update localStorage when tasks change
  useEffect(() => {
    // Save tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks))
    
    // Update stats
    // Only call updateStats if it exists and is a function
    if (typeof updateStats === 'function') {
      updateStats({
        total: tasks.length,
        completed: tasks.filter(task => task.completed).length
      })
    }
  }, [tasks]) // Remove updateStats from dependency array to prevent infinite loop
  
  const validateForm = (task) => {
    const errors = {}
    if (!task.title.trim()) {
      errors.title = "Title is required"
    }
    
    return errors
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTask(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }
  
  const handleAddTask = () => {
    const errors = validateForm(newTask)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    const task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
      createdAt: new Date().toISOString()
    }
    
    setTasks(prev => [task, ...prev])
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    })
    
    toast.success("Task added successfully")
  }
  
  const handleToggleComplete = (id) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, completed: !task.completed } 
          : task
      )
    )
  }
  
  const handleDelete = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id))
    toast.success("Task deleted")
  }
  
  const handleEdit = (task) => {
    setEditingTask(task)
  }
  
  const handleUpdateTask = () => {
    const errors = validateForm(editingTask)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    setTasks(prev => 
      prev.map(task => 
        task.id === editingTask.id 
          ? { ...editingTask } 
          : task
      )
    )
    
    setEditingTask(null)
    toast.success("Task updated successfully")
  }
  
  const toggleDetails = (id) => {
    setDetailsTaskId(detailsTaskId === id ? null : id)
  }
  
  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  return (
    <div className="space-y-8">
      {/* Task Input Form */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 border border-primary/20 dark:border-primary/30"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <PlusIcon className="text-primary" />
          <span>Add New Task</span>
        </h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
              placeholder="What needs to be done?"
              className={`rounded-xl ${formErrors.title ? 'border-red-500 dark:border-red-500' : ''}`}
            />
            {formErrors.title && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircleIcon size={14} />
                {formErrors.title}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                Due Date (Optional)
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                  className="rounded-xl pl-10"
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" size={16} />
              </div>
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium mb-1">
                Priority
              </label>
              <div className="relative">
                <select
                  id="priority"
                  name="priority"
                  value={newTask.priority}
                  onChange={handleInputChange}
                  className="rounded-xl pl-10 appearance-none"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
                <FlagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" size={16} />
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              placeholder="Add details about this task..."
              rows="3"
              className="rounded-xl"
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleAddTask}
              className="btn-primary flex items-center gap-2"
            >
              <PlusIcon size={16} />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Task List */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Your Tasks</h2>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-xl pl-10 pr-8 py-2 appearance-none border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800"
              >
                <option value="all">All Tasks</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" size={16} />
            </div>
          </div>
        </div>
        
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-surface-100 dark:bg-surface-800 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <InfoIcon className="w-8 h-8 text-surface-400" />
            </div>
            <h3 className="text-lg font-medium mb-1">No tasks found</h3>
            <p className="text-surface-500 dark:text-surface-400">
              {filter === 'all' 
                ? "Add a task to get started" 
                : filter === 'active' 
                  ? "No active tasks" 
                  : "No completed tasks"}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            <AnimatePresence>
              {filteredTasks.map(task => (
                <motion.li
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`border rounded-xl p-4 transition-all ${
                    task.completed 
                      ? 'bg-surface-100 dark:bg-surface-800 border-surface-200 dark:border-surface-700' 
                      : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800'
                  } ${
                    task.id === detailsTaskId ? 'shadow-soft' : ''
                  }`}
                >
                  {editingTask && editingTask.id === task.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                        className={`rounded-xl ${formErrors.title ? 'border-red-500 dark:border-red-500' : ''}`}
                      />
                      {formErrors.title && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircleIcon size={14} />
                          {formErrors.title}
                        </p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="relative">
                          <input
                            type="date"
                            value={editingTask.dueDate}
                            onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
                            className="rounded-xl pl-10"
                          />
                          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" size={16} />
                        </div>
                        
                        <div className="relative">
                          <select
                            value={editingTask.priority}
                            onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                            className="rounded-xl pl-10 appearance-none"
                          >
                            {priorities.map(priority => (
                              <option key={priority.value} value={priority.value}>{priority.label}</option>
                            ))}
                          </select>
                          <FlagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" size={16} />
                        </div>
                      </div>
                      
                      <textarea
                        value={editingTask.description}
                        onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                        placeholder="Add details about this task..."
                        rows="3"
                        className="rounded-xl"
                      ></textarea>
                      
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingTask(null)}
                          className="btn-outline flex items-center gap-1"
                        >
                          <XIcon size={16} />
                          <span>Cancel</span>
                        </button>
                        <button
                          onClick={handleUpdateTask}
                          className="btn-primary flex items-center gap-1"
                        >
                          <SaveIcon size={16} />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <button 
                          onClick={() => handleToggleComplete(task.id)}
                          className="mt-0.5 flex-shrink-0 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full transition-transform hover:scale-110"
                          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                        >
                          {task.completed ? (
                            <CheckCircleIcon className="text-primary" />
                          ) : (
                            <CircleIcon className="text-surface-400" />
                          )}
                        </button>
                        
                        <div className="flex-grow">
                          <div className="flex flex-wrap gap-2 justify-between">
                            <h3 
                              className={`font-medium ${
                                task.completed ? 'line-through text-surface-500 dark:text-surface-400' : ''
                              }`}
                            >
                              {task.title}
                            </h3>
                            
                            <div className="flex gap-2 items-center">
                              <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </span>
                              
                              <div className="flex shrink-0">
                                <button
                                  onClick={() => handleEdit(task)}
                                  className="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full transition-colors"
                                  aria-label="Edit task"
                                >
                                  <EditIcon size={16} className="text-surface-500" />
                                </button>
                                <button
                                  onClick={() => handleDelete(task.id)}
                                  className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors"
                                  aria-label="Delete task"
                                >
                                  <TrashIcon size={16} className="text-red-500" />
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {task.dueDate && (
                            <p className="text-sm text-surface-500 dark:text-surface-400 flex items-center gap-1 mt-1">
                              <CalendarIcon size={14} />
                              Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                            </p>
                          )}
                          
                          {(task.description || detailsTaskId === task.id) && (
                            <button
                              onClick={() => toggleDetails(task.id)}
                              className="text-sm text-primary hover:text-primary-dark mt-2 flex items-center gap-1"
                            >
                              <span>{detailsTaskId === task.id ? 'Hide details' : 'Show details'}</span>
                            </button>
                          )}
                          
                          <AnimatePresence>
                            {detailsTaskId === task.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-3 text-sm text-surface-600 dark:text-surface-400 bg-surface-50 dark:bg-surface-700/50 p-3 rounded-lg"
                              >
                                {task.description ? (
                                  <p className="whitespace-pre-line">{task.description}</p>
                                ) : (
                                  <p className="italic">No description provided</p>
                                )}
                                <p className="text-xs mt-2 text-surface-500">
                                  Created: {format(new Date(task.createdAt), 'MMM d, yyyy')}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
        
        {filteredTasks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700 text-sm text-surface-500 dark:text-surface-400 flex justify-between items-center">
            <p>
              {filteredTasks.filter(task => task.completed).length} of {filteredTasks.length} tasks completed
            </p>
            
            {filter === 'completed' && filteredTasks.length > 0 && (
              <button
                onClick={() => {
                  setTasks(prev => prev.filter(task => !task.completed))
                  toast.success("Completed tasks cleared")
                }}
                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                Clear completed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MainFeature