import { createFileRoute } from '@tanstack/react-router'
import ChatWindow from '@/components/ChatWindow'

export const Route = createFileRoute('/chat')({ component: ChatPage })

function ChatPage() {
  return <ChatWindow />
}
