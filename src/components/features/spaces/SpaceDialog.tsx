import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSpaceStore } from "@/stores/spaces"
import type { Space } from "@/types/app"

interface SpaceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingSpace?: Space
}

const warmColors = [
  { name: 'Terracotta', value: '#CD853F' },
  { name: 'Sage', value: '#87A96B' },
  { name: 'Peach', value: '#FFDAB9' },
  { name: 'Lavender', value: '#E6E6FA' },
  { name: 'Warm Gray', value: '#D3D3D3' },
  { name: 'Soft Blue', value: '#B0E0E6' },
]

export function SpaceDialog({ open, onOpenChange, editingSpace }: SpaceDialogProps) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(warmColors[0].value)
  const [error, setError] = useState('')
  const { addSpace, updateSpace } = useSpaceStore()

  useEffect(() => {
    if (editingSpace) {
      setName(editingSpace.name)
      setColor(editingSpace.color)
    } else {
      setName('')
      setColor(warmColors[0].value)
    }
    setError('')
  }, [editingSpace, open])

  const validate = () => {
    if (!name.trim()) {
      setError('Space name is required')
      return false
    }
    if (name.length > 50) {
      setError('Space name must be 50 characters or less')
      return false
    }
    return true
  }

  const handleSubmit = () => {
    if (!validate()) return
    if (editingSpace) {
      updateSpace(editingSpace.id, { name: name.trim(), color })
    } else {
      addSpace(name.trim(), color)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingSpace ? 'Edit Space' : 'Create New Space'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter space name"
              autoFocus
              maxLength={50}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Color</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {warmColors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full border-2 ${color === c.value ? 'border-primary' : 'border-gray-300'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Preview</label>
            <div className="flex items-center gap-2 mt-2">
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm">{name || 'Space Name'}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editingSpace ? 'Save Changes' : 'Create Space'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}