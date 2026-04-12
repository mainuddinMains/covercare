import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { usePreferencesStore } from '@/store/appStore'
import { translations } from '@/lib/i18n'
import { Send } from 'lucide-react'

interface Props {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled }: Props) {
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]
  const [value, setValue] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  function handleSubmit() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (ref.current) ref.current.style.height = 'auto'
    ref.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  return (
    <div className="flex items-end gap-2">
      <textarea
        ref={ref}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={t.chat_placeholder}
        rows={1}
        disabled={disabled}
        className="flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
      />
      <Button
        size="icon"
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        aria-label={t.chat_send}
        className="h-8 w-8 shrink-0 rounded-lg"
      >
        <Send size={14} />
      </Button>
    </div>
  )
}
