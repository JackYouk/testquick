import { Separator } from "@/components/ui/separator"
import { SupportForm } from "./support-form"
import FAQ from "./faq"
import { Mail, PhoneCall } from "lucide-react"

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Support</h3>
        <p className="text-sm text-muted-foreground">
          Find answers in the FAQ or reach out to a representative of our team.
        </p>
      </div>
      <Separator />



      <FAQ />

      <h2 className="text-2xl font-semibold">
        Contact Us Directly
      </h2>
      <div className="flex flex-col pb-6">
        <a href="mailto:support@testquick.org" className="underline cursor-pointer mb-4 flex items-center">
          <Mail className="mr-2" /> support@testquick.org
        </a>
        <a href="tel:5105080618" className="underline cursor-pointer flex items-center">
          <PhoneCall className="mr-2" /> 5105080618
        </a>
      </div>

      <h2 className="text-2xl font-semibold">
        Support Form
      </h2>
      <SupportForm />

    </div>
  )
}
