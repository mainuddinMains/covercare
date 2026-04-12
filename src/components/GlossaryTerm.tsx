import { useState, useRef, useEffect } from 'react'
import { GLOSSARY, type GlossaryEntry } from '@/lib/glossary'
import { X } from 'lucide-react'

interface Props {
  term: string
}

export default function GlossaryTerm({ term }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  const key = term.toLowerCase()
  const entry: GlossaryEntry | undefined = GLOSSARY[key]
  if (!entry) return <>{term}</>

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <span ref={ref} className="relative inline">
      <button
        onClick={() => setOpen(!open)}
        className="cursor-help border-b border-dashed border-primary/40 font-medium text-primary transition-colors hover:border-primary hover:text-primary/80"
        aria-expanded={open}
        aria-label={`Definition: ${entry.term}`}
      >
        {term}
      </button>

      {open && (
        <span className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg border border-border bg-popover p-3 text-left shadow-lg">
          <span className="mb-1 block text-xs font-bold text-foreground">
            {entry.term}
          </span>
          <span className="mb-1.5 block text-xs leading-relaxed text-foreground/80">
            {entry.simple}
          </span>
          {entry.example && (
            <span className="block text-[10px] leading-relaxed text-muted-foreground italic">
              {entry.example}
            </span>
          )}
          <span className="mt-1.5 block text-[10px] leading-relaxed text-muted-foreground">
            {entry.definition}
          </span>
          <button
            onClick={() => setOpen(false)}
            className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X size={12} />
          </button>
        </span>
      )}
    </span>
  )
}
