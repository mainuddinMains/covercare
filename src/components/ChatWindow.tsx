import { useEffect, useMemo, useRef } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { fetchServerSentEvents, useChat } from '@tanstack/ai-react'
import { Button } from '@/components/ui/button'
import ChatInput from './ChatInput'
import { CLIENT_TOOLS, TOOL_LABELS } from '@/lib/ai/tools'
import { buildSystemPrompt } from '@/lib/ai/system-prompt'
import { useInsuranceStore, usePreferencesStore } from '@/store/appStore'
import { translations } from '@/lib/i18n'
import { RotateCcw, Loader2 } from 'lucide-react'

export default function ChatWindow() {
  const profile = useInsuranceStore((s) => s.profile)
  const { simpleMode, locale } = usePreferencesStore()
  const t = translations[locale]
  const bottomRef = useRef<HTMLDivElement>(null)

  const systemPrompt = useMemo(
    () => buildSystemPrompt(profile, simpleMode),
    [profile, simpleMode],
  )

  const connection = useMemo(() => fetchServerSentEvents('/api/chat'), [])
  const body = useMemo(() => ({ context: systemPrompt }), [systemPrompt])

  const { messages, sendMessage, isLoading, clear } = useChat({
    connection,
    tools: CLIENT_TOOLS,
    body,
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const showSuggestions = messages.length === 0
  const locationLabel = profile.city || profile.zip || ''
  const suggestions = [
    t.suggestion_clinics(locationLabel || 'near me'),
    t.suggestion_dental,
    t.suggestion_medicaid,
    t.suggestion_cardiologist(profile.stateCode || 'my state'),
  ]

  return (
    <div className="flex h-[calc(100svh-8rem)] flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="font-heading text-xl font-semibold">{t.nav_chat}</h1>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clear}>
            <RotateCcw size={14} className="mr-1.5" />
            {t.chat_new_convo}
          </Button>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        {showSuggestions && (
          <>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                {t.chat_welcome}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.role === 'user'
                ? 'ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground'
                : 'max-w-[85%] text-sm'
            }
          >
            {msg.role === 'user' ? (
              msg.parts
                .filter((p) => p.type === 'text')
                .map((p, i) => <span key={i}>{p.content}</span>)
            ) : (
              <div className="space-y-2">
                {msg.parts.map((part, i) => {
                  if (part.type === 'text') {
                    return (
                      <div key={i} className="prose prose-sm max-w-none text-foreground prose-strong:text-primary">
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {part.content}
                        </Markdown>
                      </div>
                    )
                  }
                  if (part.type === 'tool-call') {
                    const isDone =
                      part.state === 'input-complete' &&
                      part.output !== undefined
                    const label =
                      TOOL_LABELS[part.name] ?? part.name
                    return (
                      <span
                        key={i}
                        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${
                          isDone
                            ? 'bg-muted text-muted-foreground'
                            : 'animate-pulse bg-primary/10 text-primary'
                        }`}
                      >
                        {!isDone && (
                          <Loader2 size={12} className="animate-spin" />
                        )}
                        {label}
                      </span>
                    )
                  }
                  return null
                })}
              </div>
            )}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <ChatInput
        onSend={(text) => sendMessage(text)}
        disabled={isLoading}
      />
    </div>
  )
}
