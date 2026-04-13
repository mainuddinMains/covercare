import { createFileRoute } from '@tanstack/react-router'
import GlossaryBrowser from '@/components/glossary/GlossaryBrowser'

export const Route = createFileRoute('/learn')({ component: LearnPage })

function LearnPage() {
  return <GlossaryBrowser />
}
