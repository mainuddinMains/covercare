import { createFileRoute } from '@tanstack/react-router'
import PlanFinderFlow from '@/components/plans/PlanFinderFlow'

export const Route = createFileRoute('/plans')({ component: PlansPage })

function PlansPage() {
  return <PlanFinderFlow />
}
