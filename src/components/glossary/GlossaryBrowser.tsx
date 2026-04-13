import { useState, useMemo, useRef } from 'react'
import { Search, X, ChevronDown, ChevronUp, BookOpen } from 'lucide-react'
import { GLOSSARY, CATEGORIES, type GlossaryCategory, type GlossaryTerm } from '@/lib/glossary'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, '')
}

function TermCard({ term }: { term: GlossaryTerm }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold">{term.term}</p>
          <p className="text-[11px] text-muted-foreground">{term.category}</p>
        </div>
        {open ? (
          <ChevronUp size={15} className="shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown size={15} className="shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="border-t px-4 py-3 space-y-2.5">
          <p className="text-sm leading-relaxed">{term.definition}</p>
          <div className="rounded-lg bg-muted/50 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Example</p>
            <p className="text-xs leading-relaxed text-foreground/80">{term.example}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function GlossaryBrowser() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | null>(null)
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const filtered = useMemo(() => {
    const q = normalize(query)
    return GLOSSARY.filter((t) => {
      const matchesCategory = !activeCategory || t.category === activeCategory
      const matchesQuery =
        !q ||
        normalize(t.term).includes(q) ||
        normalize(t.definition).includes(q)
      return matchesCategory && matchesQuery
    }).sort((a, b) => a.term.localeCompare(b.term))
  }, [query, activeCategory])

  const grouped = useMemo(() => {
    const map: Record<string, GlossaryTerm[]> = {}
    for (const term of filtered) {
      const letter = term.term[0].toUpperCase()
      if (!map[letter]) map[letter] = []
      map[letter].push(term)
    }
    return map
  }, [filtered])

  const presentLetters = Object.keys(grouped).sort()

  function scrollToLetter(letter: string) {
    letterRefs.current[letter]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const isFiltering = !!query || !!activeCategory

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold">Healthcare Glossary</p>
            <p className="text-[11px] text-muted-foreground">{GLOSSARY.length} terms with plain-language definitions and real examples</p>
          </div>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms or definitions..."
            className="w-full rounded-lg border bg-muted/40 py-2 pl-9 pr-9 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
              !activeCategory
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {!isFiltering && (
        <div className="flex flex-wrap gap-1.5 px-0.5">
          {ALPHABET.map((letter) => {
            const available = !!grouped[letter]
            return (
              <button
                key={letter}
                type="button"
                disabled={!available}
                onClick={() => available && scrollToLetter(letter)}
                className={`h-7 w-7 rounded-md text-xs font-semibold transition-colors ${
                  available
                    ? 'bg-muted text-foreground hover:bg-primary hover:text-primary-foreground'
                    : 'text-muted-foreground/30 cursor-default'
                }`}
              >
                {letter}
              </button>
            )
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
          No terms match your search.
        </div>
      ) : (
        <div className="space-y-6">
          {presentLetters.map((letter) => (
            <div
              key={letter}
              ref={(el) => { letterRefs.current[letter] = el }}
            >
              {!query && (
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-0.5">
                  {letter}
                </p>
              )}
              <div className="space-y-2">
                {grouped[letter].map((term) => (
                  <TermCard key={term.term} term={term} />
                ))}
              </div>
            </div>
          ))}
          <p className="text-center text-[11px] text-muted-foreground pb-2">
            Showing {filtered.length} of {GLOSSARY.length} terms
          </p>
        </div>
      )}
    </div>
  )
}
