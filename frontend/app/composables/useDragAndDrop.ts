// composables/useDragAndDrop.ts

import { ref } from 'vue'

export interface DragDropOptions<T, S> {
  /**
   * Callback when an item is dropped into a new zone
   * @param item // item to drop
   * @param targetState // target state/zone
   * @returns Promise that resolves when the update is complete
   */
  onDrop: (item: T, targetState: S) => Promise<void>
  
  /**
   * Function to get the current state of an item
   * @param item drag/drop item
   * @returns current item state
   */
  getItemState: (item: T) => S
  
  /**
   * Function to get unique identifier of an item
   * @param item // drag/drop item
   * @returns unique item ID
   */
  getItemId: (item: T) => string
  
  /**
   * Optional callback when drag starts
   */
  onDragStart?: (item: T) => void
  
  /**
   * Optional callback when drag ends
   */
  onDragEnd?: (item: T) => void
}

export function useDragAndDrop<T = any, S = string>(options: DragDropOptions<T, S>) {
  const draggedItemId = ref<string | null>(null)
  const draggedItem = ref<T | null>(null)
  
  // Handler for drag start events
  const handleDragStart = (item: T, event?: DragEvent) => {
    const itemId = options.getItemId(item)
    draggedItemId.value = itemId
    draggedItem.value = item
    
    if (event?.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', itemId)
    }
    
    options.onDragStart?.(item)
  }
  
  // Handler for drag-end events
  const handleDragEnd = (item: T) => {
    draggedItemId.value = null
    draggedItem.value = null
    options.onDragEnd?.(item)
  }
  
  // Handler for drop events
  const handleDrop = async (targetState: S) => {
    if (!draggedItem.value) return
    
    const currentState = options.getItemState(draggedItem.value)
    
    // dont do anything if dropped in the same zone
    if (currentState === targetState) {
      draggedItemId.value = null
      draggedItem.value = null
      return
    }
    
    const item = draggedItem.value
    
    try {
      await options.onDrop(item, targetState)
    } finally {
      draggedItemId.value = null
      draggedItem.value = null
    }
  }
  
  // Check if an item is currently being dragged
  const isDragging = (item: T): boolean => {
    return draggedItemId.value === options.getItemId(item)
  }
  
  return {
    draggedItemId,
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    isDragging,
  }
}

// Additional composable for drop zone handling
export function useDropZone() {
  const isDragOver = ref(false)
  
  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
    isDragOver.value = true
  }
  
  const handleDragLeave = (event: DragEvent) => {
    const target = event.target as HTMLElement
    const currentTarget = event.currentTarget as HTMLElement
    
    // Only remove highlight if leaving the container itself
    if (target === currentTarget) {
      isDragOver.value = false
    }
  }
  
  const handleDrop = (event: DragEvent, callback: () => void) => {
    event.preventDefault()
    isDragOver.value = false
    callback()
  }
  
  const resetDragOver = () => {
    isDragOver.value = false
  }
  
  return {
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    resetDragOver,
  }
}