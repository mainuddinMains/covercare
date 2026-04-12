import { createFileRoute } from '@tanstack/react-router'
import AppointmentGuide from '@/components/AppointmentGuide'

export const Route = createFileRoute('/guide')({ component: GuidePage })

function GuidePage() {
  return <AppointmentGuide />
}
