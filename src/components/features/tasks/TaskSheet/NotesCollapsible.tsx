import React from 'react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface NotesCollapsibleProps {
  notes: string
  setNotes: (v: string) => void
  notesOpen: boolean
  setNotesOpen: (v: boolean) => void
}

export const NotesCollapsible: React.FC<NotesCollapsibleProps> = ({ notes, setNotes, notesOpen, setNotesOpen }) => {
  return (
    <Collapsible open={notesOpen} onOpenChange={setNotesOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground px-2">
          {notesOpen ? <ChevronDown className="mr-1 h-4 w-4" /> : <ChevronRight className="mr-1 h-4 w-4" />}
          {notesOpen ? 'Hide notes' : 'Add notes'}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent asChild>
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.2 }}>
          <Textarea aria-label="Notes" id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" className="mt-2 min-h-[24px] text-sm resize-y" />
        </motion.div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default NotesCollapsible
