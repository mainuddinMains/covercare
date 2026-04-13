import { createFileRoute } from '@tanstack/react-router'
import GreetingCard from '@/components/dashboard/GreetingCard'
import InsuranceMetrics from '@/components/dashboard/InsuranceMetrics'
import NearestCare from '@/components/dashboard/NearestCare'
import AiInsight from '@/components/dashboard/AiInsight'
import PlanHealthScore from '@/components/dashboard/PlanHealthScore'
import AlertBanners from '@/components/dashboard/AlertBanners'
import QuickReference from '@/components/dashboard/QuickReference'

export const Route = createFileRoute('/dashboard')({ component: DashboardPage })

function DashboardPage() {
  return (
    <div className="space-y-4 pb-4">
      <GreetingCard />
      <AlertBanners />
      <InsuranceMetrics />
      <NearestCare />
      <AiInsight />
      <PlanHealthScore />
      <QuickReference />
    </div>
  )
}
