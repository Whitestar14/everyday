"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Plus, MoreHorizontal, Edit3, Trash2, ChevronDown, ChevronRight } from "lucide-react"
import { TaskItem } from "@/components/features/tasks/TaskItem"
import { useSpaceStore } from "@/stores/spaces"
import { useTaskStore } from "@/stores/tasks"

// Warm color palette for spaces
const WARM_COLORS = [
  { name: "Terracotta", value: "#CD853F" },
  { name: "Sage", value: "#B2AC88" },
  { name: "Peach", value: "#FFDAB9" },
  { name: "Lavender", value: "#E6E6FA" },
  { name: "Cream", value: "#FFF8DC" },
]

export function LibraryPage() {
  const { spaces, selectedSpaceId, selectSpace, addSpace, updateSpace, deleteSpace, addProject, getSpaceProjects } = useSpaceStore()
  const { getLibraryTasks, removeTask } = useTaskStore()

  const [newSpaceDialogOpen, setNewSpaceDialogOpen] = useState(false)
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false)
  const [editSpaceDialogOpen, setEditSpaceDialogOpen] = useState(false)
  const [projectsExpanded, setProjectsExpanded] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  // New space form state
  const [newSpaceName, setNewSpaceName] = useState("")
  const [newSpaceColor, setNewSpaceColor] = useState(WARM_COLORS[0].value)

  // New project form state
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectSpaceId, setNewProjectSpaceId] = useState(selectedSpaceId || "")

  // Edit space form state
  const [editSpaceName, setEditSpaceName] = useState("")
  const [editSpaceColor, setEditSpaceColor] = useState("")

  const selectedSpace = spaces.find(s => s.id === selectedSpaceId)
  const spaceProjects = selectedSpace ? getSpaceProjects(selectedSpace.id) : []
  const libraryTasks = useMemo(() => {
    return getLibraryTasks(selectedSpaceId || undefined, selectedProjectId || undefined)
  }, [getLibraryTasks, selectedSpaceId, selectedProjectId])

  const spaceTaskCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    spaces.forEach(space => {
      counts[space.id] = getLibraryTasks(space.id).length
    })
    return counts
  }, [spaces, getLibraryTasks])

  const handleCreateSpace = () => {
    if (newSpaceName.trim()) {
      addSpace(newSpaceName.trim(), newSpaceColor)
      setNewSpaceName("")
      setNewSpaceColor(WARM_COLORS[0].value)
      setNewSpaceDialogOpen(false)
    }
  }

  const handleCreateProject = () => {
    if (newProjectName.trim() && newProjectSpaceId) {
      addProject(newProjectName.trim(), newProjectSpaceId)
      setNewProjectName("")
      setNewProjectSpaceId(selectedSpaceId || "")
      setNewProjectDialogOpen(false)
    }
  }

  const handleEditSpace = () => {
    if (selectedSpace && editSpaceName.trim()) {
      updateSpace(selectedSpace.id, { name: editSpaceName.trim(), color: editSpaceColor })
      setEditSpaceDialogOpen(false)
    }
  }

  const handleDeleteSpace = () => {
    if (selectedSpace) {
      deleteSpace(selectedSpace.id)
    }
  }

  const handleEditTask = (task: any) => {
    // Open edit sheet - assuming TaskEditSheet exists
    // For now, placeholder
    console.log("Edit task", task)
  }

  const handleDeleteTask = (taskId: string) => {
    removeTask(taskId)
  }

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-border bg-background/50 p-4">
        <div className="space-y-2">
          {spaces.map((space) => (
            <motion.button
              key={space.id}
              onClick={() => {
                selectSpace(space.id)
                setSelectedProjectId(null)
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                selectedSpaceId === space.id
                  ? "bg-accent/20 border border-accent/40"
                  : "hover:bg-accent/10"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: space.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{space.name}</p>
                <p className="text-xs text-muted-foreground">
                  {spaceTaskCounts[space.id] || 0} tasks
                </p>
              </div>
            </motion.button>
          ))}
        </div>
        <Dialog open={newSpaceDialogOpen} onOpenChange={setNewSpaceDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full mt-4" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Space
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Space</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="space-name">Name</Label>
                <Input
                  id="space-name"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  placeholder="e.g., Work, Personal"
                />
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex gap-2 mt-2">
                  {WARM_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewSpaceColor(color.value)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newSpaceColor === color.value ? "border-foreground" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewSpaceDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSpace}>Create Space</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Right Panel */}
      <div className="flex-1 p-6">
        {selectedSpace ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: selectedSpace.color }}
                />
                <h1 className="text-2xl font-bold">{selectedSpace.name}</h1>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setEditSpaceName(selectedSpace.name)
                      setEditSpaceColor(selectedSpace.color)
                      setEditSpaceDialogOpen(true)
                    }}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Space
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDeleteSpace} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Space
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Projects Section */}
            {spaceProjects.length > 0 && (
              <Collapsible open={projectsExpanded} onOpenChange={setProjectsExpanded}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="mb-4 p-0 h-auto">
                    <div className="flex items-center gap-2">
                      {projectsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      <span className="text-sm font-medium">Projects ({spaceProjects.length})</span>
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mb-6">
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={selectedProjectId === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedProjectId(null)}
                    >
                      All Tasks
                    </Button>
                    {spaceProjects.map((project) => (
                      <Button
                        key={project.id}
                        variant={selectedProjectId === project.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedProjectId(project.id)}
                      >
                        {project.name}
                      </Button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Tasks List */}
            <div className="space-y-2">
              <AnimatePresence>
                {libraryTasks.length > 0 ? (
                  libraryTasks.map((task, index) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      index={index}
                      allowCompletion={false}
                      isCompleting={false}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <p className="text-muted-foreground text-lg">No tasks in this space yet</p>
                    <p className="text-muted-foreground/70 text-sm mt-2">
                      Move tasks here from the Inbox to organize them
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground text-lg">Select a space to view tasks</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Space Dialog */}
      <Dialog open={editSpaceDialogOpen} onOpenChange={setEditSpaceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Space</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-space-name">Name</Label>
              <Input
                id="edit-space-name"
                value={editSpaceName}
                onChange={(e) => setEditSpaceName(e.target.value)}
              />
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex gap-2 mt-2">
                {WARM_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setEditSpaceColor(color.value)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      editSpaceColor === color.value ? "border-foreground" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSpaceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSpace}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Project Dialog */}
      <Dialog open={newProjectDialogOpen} onOpenChange={setNewProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="project-name">Name</Label>
              <Input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g., Website Redesign"
              />
            </div>
            <div>
              <Label htmlFor="project-space">Space</Label>
              <Select value={newProjectSpaceId} onValueChange={setNewProjectSpaceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a space" />
                </SelectTrigger>
                <SelectContent>
                  {spaces.map((space) => (
                    <SelectItem key={space.id} value={space.id}>
                      {space.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewProjectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
