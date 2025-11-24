import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSpaceStore } from "@/stores/spaces"
import type { Project } from "@/types/app"

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  project?: Project
  initialSpaceId?: string
}

export function ProjectDialog({
  open,
  onOpenChange,
  mode,
  project,
  initialSpaceId,
}: ProjectDialogProps) {
  const { spaces, addProject, updateProject } = useSpaceStore()
  const [name, setName] = useState("")
  const [selectedSpaceId, setSelectedSpaceId] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      if (mode === "edit" && project) {
        setName(project.name)
        setSelectedSpaceId(project.spaceId)
      } else {
        setName("")
        setSelectedSpaceId(initialSpaceId || "")
      }
      setError("")
    }
  }, [open, mode, project, initialSpaceId])

  const handleSubmit = () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError("Project name is required")
      return
    }
    if (trimmedName.length > 50) {
      setError("Project name must be 50 characters or less")
      return
    }
    if (!selectedSpaceId) {
      setError("Please select a space")
      return
    }

    if (mode === "create") {
      addProject(trimmedName, selectedSpaceId)
    } else if (project) {
      updateProject(project.id, { name: trimmedName, spaceId: selectedSpaceId })
    }

    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {mode === "create" ? "Create Project" : "Edit Project"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === "create"
              ? "Add a new project to organize your tasks."
              : "Update the details of this project."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-sm font-medium text-foreground">
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Enter project name"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="space" className="text-right text-sm font-medium text-foreground">
              Space
            </label>
            <Select value={selectedSpaceId} onValueChange={setSelectedSpaceId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a space" />
              </SelectTrigger>
              <SelectContent>
                {spaces.map((space) => (
                  <SelectItem key={space.id} value={space.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: space.color }}
                      />
                      {space.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 col-span-4 text-center">
              {error}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
            {mode === "create" ? "Create Project" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
