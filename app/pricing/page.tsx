import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import SharedLayout from "@/components/SharedLayout"

const plans = [
  {
    name: "Basic",
    price: "$29",
    features: ["1,000 chatbot interactions/month", "Basic AI training", "Email support", "Website integration"],
  },
  {
    name: "Pro",
    price: "$99",
    features: [
      "10,000 chatbot interactions/month",
      "Advanced AI training",
      "Priority email support",
      "Website & app integration",
      "Custom branding",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Unlimited chatbot interactions",
      "Advanced AI training & customization",
      "24/7 phone & email support",
      "Multi-platform integration",
      "Custom branding & features",
      "Dedicated account manager",
    ],
  },
]

export default function PricingPage() {
  return (
    <SharedLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Simple, Transparent Pricing</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="border border-gray-200 rounded-lg p-6 flex flex-col hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-2xl font-semibold mb-4">{plan.name}</h2>
              <p className="text-4xl font-bold mb-6">
                {plan.price}
                <span className="text-sm font-normal">/month</span>
              </p>
              <ul className="mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center mb-2">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full">
                <Link href="/auth/register">Choose {plan.name}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </SharedLayout>
  )
}

