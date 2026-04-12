import { MessageCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePreferencesStore } from '@/store/appStore'
import { translations } from '@/lib/i18n'

interface ConversationSummary {
  id: string
  title: string
  updatedAt: Date
}

interface ConversationListProps {
  conversations: ConversationSummary[]
  activeId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onClose: () => void
}

function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
  onDelete,
  onClose,
}: ConversationListProps) {
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold">{t.chat_history}</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          {t.conversation_back}
        </Button>
      </div>

      {conversations.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {t.chat_no_history}
        </p>
      ) : (
        <div className="flex-1 space-y-1 overflow-y-auto">
          {conversations.map((c) => (
            <div
              key={c.id}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                c.id === activeId
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted'
              }`}
            >
              <button
                onClick={() => {
                  onSelect(c.id)
                  onClose()
                }}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <MessageCircle size={16} className="shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(c.updatedAt)}
                  </p>
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(c.id)
                }}
                className="shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                aria-label={t.chat_delete}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
