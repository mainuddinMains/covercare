import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { fetchServerSentEvents, useChat } from '@tanstack/ai-react'
import { Button } from '@/components/ui/button'
import ChatInput from './ChatInput'
import { CLIENT_TOOLS, TOOL_LABELS } from '@/lib/ai/tools'
import { buildSystemPrompt } from '@/lib/ai/system-prompt'
import { useInsuranceStore, usePreferencesStore } from '@/store/appStore'
import { useSession } from '@/lib/auth-client'
import { isAuthed } from '@/lib/sync'
import {
  getConversations,
  getConversationMessages,
  saveConversation,
  deleteConversation,
} from '@/lib/server/user-data'
import { translations } from '@/lib/i18n'
import { Link } from '@tanstack/react-router'
import { RotateCcw, Loader2, Compass, History } from 'lucide-react'
import ToolResult from './chat/ToolResult'
import ConversationList from './ConversationList'
import LanguageToggle from './LanguageToggle'

function AssistantAvatar() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary">
      <Compass size={14} className="text-primary-foreground" />
    </div>
  )
}

interface ConversationSummary {
  id: string
  title: string
  updatedAt: Date
}

function deriveTitle(messages: Array<{ role: string; parts: Array<any> }>): string {
  const firstUser = messages.find((m) => m.role === 'user')
  if (!firstUser) return 'New conversation'
  const text = firstUser.parts
    .filter((p: any) => p.type === 'text')
    .map((p: any) => p.content)
    .join(' ')
  return text.slice(0, 50) || 'New conversation'
}

export default function ChatWindow() {
  const profile = useInsuranceStore((s) => s.profile)
  const { simpleMode, locale } = usePreferencesStore()
  const { data: session } = useSession()
  const t = translations[locale]
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const userScrolledUp = useRef(false)

  // Conversation state
  const [conversationId, setConversationId] = useState<string>(crypto.randomUUID())
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const loadedConvoRef = useRef<string | null>(null)

  const systemPrompt = useMemo(
    () => buildSystemPrompt(profile, simpleMode),
    [profile, simpleMode],
  )

  const connection = useMemo(() => fetchServerSentEvents('/api/chat'), [])
  const body = useMemo(() => ({ context: systemPrompt }), [systemPrompt])

  const { messages, sendMessage, isLoading, clear, setMessages } = useChat({
    connection,
    tools: CLIENT_TOOLS,
    body,
    onFinish: () => {
      if (!isAuthed()) return
      const currentMessages = messagesRef.current
      if (currentMessages.length === 0) return

      const title = deriveTitle(currentMessages)
      saveConversation({
        data: {
          id: conversationIdRef.current,
          title,
          messages: currentMessages.map((m) => ({
            id: m.id,
            role: m.role,
            parts: JSON.stringify(m.parts),
            createdAt: new Date().toISOString(),
          })),
        },
      }).then(() => {
        refreshConversations()
      }).catch(() => {})
    },
  })

  // Keep refs in sync for use inside onFinish callback
  const messagesRef = useRef(messages)
  messagesRef.current = messages
  const conversationIdRef = useRef(conversationId)
  conversationIdRef.current = conversationId

  const refreshConversations = useCallback(() => {
    if (!isAuthed()) return
    getConversations()
      .then((data) => {
        setConversations(
          data.map((c) => ({
            id: c.id,
            title: c.title,
            updatedAt: new Date(c.updatedAt),
          })),
        )
      })
      .catch(() => {})
  }, [])

  // Load conversation list on mount for authenticated users
  useEffect(() => {
    const realUser = session && !session.user.isAnonymous
    if (realUser) {
      refreshConversations()
    }
  }, [session, refreshConversations])

  useEffect(() => {
    if (!userScrolledUp.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    userScrolledUp.current = distanceFromBottom > 80
  }

  function handleNewConversation() {
    clear()
    setConversationId(crypto.randomUUID())
    loadedConvoRef.current = null
  }

  async function handleSelectConversation(id: string) {
    if (id === loadedConvoRef.current) return
    try {
      const data = await getConversationMessages({ data: { conversationId: id } })
      const uiMessages = data.map((m: any) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        parts: JSON.parse(m.parts),
      }))
      setMessages(uiMessages)
      setConversationId(id)
      loadedConvoRef.current = id
    } catch {
      // If loading fails, stay on current conversation
    }
  }

  async function handleDeleteConversation(id: string) {
    try {
      await deleteConversation({ data: { id } })
      setConversations((prev) => prev.filter((c) => c.id !== id))
      // If we deleted the active conversation, start fresh
      if (id === conversationId) {
        handleNewConversation()
      }
    } catch {
      // If delete fails, leave the list as-is
    }
  }

  const isEmpty = messages.length === 0
  const locationLabel = profile.city || profile.zip || ''
  const suggestions = [
    t.suggestion_clinics(locationLabel || 'near me'),
    t.suggestion_dental,
    t.suggestion_medicaid,
    t.suggestion_cardiologist(profile.stateCode || ''),
  ]

  const showSuggestions = isEmpty || (!isLoading && messages.length > 0 && messages[messages.length - 1]?.role === 'assistant')
  const canShowHistory = session && !session.user.isAnonymous

  // Show conversation history panel
  if (showHistory) {
    return (
      <div className="flex h-full flex-col">
        <ConversationList
          conversations={conversations}
          activeId={loadedConvoRef.current}
          onSelect={handleSelectConversation}
          onDelete={handleDeleteConversation}
          onClose={() => setShowHistory(false)}
        />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 transition-colors hover:text-primary"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Compass size={14} className="text-primary-foreground" />
          </div>
          <span className="font-heading text-lg font-semibold">CareCompass</span>
        </Link>
        <div className="flex items-center gap-1">
          <LanguageToggle />
          {canShowHistory && (
            <Button variant="ghost" size="sm" onClick={() => setShowHistory(true)}>
              <History size={14} className="mr-1.5" />
              {t.chat_history}
            </Button>
          )}
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleNewConversation}>
              <RotateCcw size={14} className="mr-1.5" />
              {t.chat_new_convo}
            </Button>
          )}
        </div>
      </div>

      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 space-y-4 overflow-y-auto pb-4">
        {/* Welcome state */}
        {isEmpty && (
          <div className="flex gap-3">
            <AssistantAvatar />
            <div className="flex-1 rounded-2xl rounded-tl-md border border-border bg-card p-4">
              <p className="text-sm leading-relaxed text-foreground">
                {t.chat_welcome}
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => {
          if (msg.role === 'user') {
            return (
              <div
                key={msg.id}
                className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground"
              >
                {msg.parts
                  .filter((p) => p.type === 'text')
                  .map((p, i) => (
                    <span key={i}>{p.content}</span>
                  ))}
              </div>
            )
          }

          return (
            <div key={msg.id} className="flex gap-3">
              <AssistantAvatar />
              <div className="min-w-0 flex-1 space-y-2">
                {msg.parts.map((part, i) => {
                  if (part.type === 'text') {
                    return (
                      <div
                        key={i}
                        className="rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3 text-sm"
                      >
                        <div className="prose prose-sm max-w-none text-foreground prose-p:leading-relaxed prose-strong:text-primary prose-ul:my-1 prose-li:my-0">
                          <Markdown remarkPlugins={[remarkGfm]}>
                            {part.content}
                          </Markdown>
                        </div>
                      </div>
                    )
                  }
                  if (part.type === 'tool-call') {
                    const isDone =
                      part.state === 'input-complete' &&
                      part.output !== undefined
                    const label = TOOL_LABELS[part.name] ?? part.name

                    if (isDone) {
                      const ui = (
                        <ToolResult
                          name={part.name}
                          output={part.output}
                        />
                      )
                      if (ui) return <div key={i}>{ui}</div>
                      return null
                    }

                    return (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                      >
                        <Loader2 size={10} className="animate-spin" />
                        {label}
                      </span>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {isLoading &&
          (messages.length === 0 ||
            messages[messages.length - 1]?.role === 'user') && (
            <div className="flex gap-3">
              <AssistantAvatar />
              <div className="rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

        {/* Suggestion chips */}
        {showSuggestions && (
          <div className="flex flex-wrap gap-2 pl-10">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                disabled={isLoading}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="rounded-xl border border-border bg-card p-2">
        <ChatInput
          onSend={(text) => sendMessage(text)}
          disabled={isLoading}
        />
      </div>
    </div>
  )
}
