import { createFileRoute } from '@tanstack/react-router'
import InsuranceProfileForm from '@/components/InsuranceProfileForm'
import AccessibilityPanel from '@/components/AccessibilityPanel'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/profile')({ component: ProfilePage })

function ProfilePage() {
  return (
    <div className="space-y-6">
      <InsuranceProfileForm />
      <Separator />
      <AccessibilityPanel />
    </div>
  )
}
