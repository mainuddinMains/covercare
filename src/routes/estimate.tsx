import { createFileRoute } from '@tanstack/react-router'
import CostEstimator from '@/components/CostEstimator'

export const Route = createFileRoute('/estimate')({ component: EstimatePage })

function EstimatePage() {
  return <CostEstimator />
}
