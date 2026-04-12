import { createFileRoute } from '@tanstack/react-router'
import HospitalFinder from '@/components/HospitalFinder'

export const Route = createFileRoute('/hospitals')({ component: HospitalsPage })

function HospitalsPage() {
  return <HospitalFinder />
}
