import { GLOSSARY_REGEX } from '@/lib/glossary'
import GlossaryTerm from './GlossaryTerm'

interface Props {
  content: string
}

export default function RichMessage({ content }: Props) {
  const lines = content.split('\n')

  return (
    <div className="space-y-1 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (!line.trim()) return <br key={i} />

        const isBullet = /^\s*[-*]\s/.test(line)
        const cleaned = isBullet ? line.replace(/^\s*[-*]\s/, '') : line

        // Bold markdown
        const boldParts = cleaned.split(/\*\*(.*?)\*\*/g)
        const rendered = boldParts.map((part, j) => {
          if (j % 2 === 1) {
            return (
              <strong key={j} className="font-semibold">
                {highlightGlossary(part)}
              </strong>
            )
          }
          return <span key={j}>{highlightGlossary(part)}</span>
        })

        if (isBullet) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
              <span>{rendered}</span>
            </div>
          )
        }

        return <p key={i}>{rendered}</p>
      })}
    </div>
  )
}

function highlightGlossary(text: string) {
  const parts = text.split(GLOSSARY_REGEX)
  if (parts.length === 1) return text

  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <GlossaryTerm key={i} term={part} />
    }
    return part
  })
}
