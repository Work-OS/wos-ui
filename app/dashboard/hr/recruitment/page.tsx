import type { Metadata } from "next"
import { RecruitmentSection } from "@/components/dashboard/hr/recruitment"

export const metadata: Metadata = { title: "Recruitment" }

export default function RecruitmentPage() {
  return (
    <div className="p-6 animate-in fade-in duration-300">
      <RecruitmentSection />
    </div>
  )
}
