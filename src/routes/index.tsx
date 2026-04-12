import { createFileRoute } from '@tanstack/react-router'
import ChatWindow from '@/components/ChatWindow'

export const Route = createFileRoute('/')({ component: ChatPage })

function ChatPage() {
  return <ChatWindow />
}
