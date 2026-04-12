import { useState, useRef, useEffect } from 'react'
import type { Message } from '@/lib/types'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import { Button } from '@/components/ui/button'
import { useInsuranceStore, usePreferencesStore } from '@/store/appStore'
import { translations } from '@/lib/i18n'
import { RotateCcw } from 'lucide-react'

export default function ChatWindow() {
  const profile = useInsuranceStore((s) => s.profile)
  const { simpleMode, locale } = usePreferencesStore()
  const t = translations[locale]

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t.chat_welcome },
  ])
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(content: string) {
    const userMsg: Message = { role: 'user', content }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setStreaming(true)

    const profileContext =
      profile.insuranceType || profile.planName
        ? `Insurance: ${profile.planName || profile.insuranceType}, Location: ${profile.city || profile.zip || 'unknown'}`
        : undefined

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.filter((m) => m.role !== 'system'),
          profileContext,
          simpleMode,
        }),
      })

      if (!res.ok || !res.body) {
        throw new Error('Chat request failed')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '' },
      ])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta?.content
            if (delta) {
              assistantContent += delta
              const captured = assistantContent
              setMessages((prev) => {
                const copy = [...prev]
                copy[copy.length - 1] = {
                  role: 'assistant',
                  content: captured,
                }
                return copy
              })
            }
          } catch {
            // skip unparseable lines
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          content:
            'Sorry, I had trouble connecting. Please try again or call your insurance company directly.',
        },
      ])
    } finally {
      setStreaming(false)
    }
  }

  function reset() {
    setMessages([{ role: 'assistant', content: t.chat_welcome }])
  }

  const showSuggestions = messages.length <= 1
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
        <h1 className="text-lg font-semibold">{t.nav_chat}</h1>
        {messages.length > 1 && (
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw size={14} className="mr-1.5" />
            {t.chat_new_convo}
          </Button>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {showSuggestions && (
          <div className="flex flex-wrap gap-2 pt-2">
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
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={sendMessage} disabled={streaming} />
    </div>
  )
}
