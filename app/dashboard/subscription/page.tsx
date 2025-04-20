"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Check, X, Zap } from "lucide-react"
import UserLayout from "@/components/layouts/UserLayout"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

const plans = [
  {
    name: "Free",
    price: 0,
    features: [
      { name: "5 AI Avatars per month", included: true },
      { name: "Basic customization options", included: true },
      { name: "Standard support", included: true },
      { name: "Access to tutorials", included: true },
      { name: "Advanced editing tools", included: false },
      { name: "Unlimited AI Avatars", included: false },
    ],
  },
  {
    name: "Pro",
    price: 9.99,
    features: [
      { name: "50 AI Avatars per month", included: true },
      { name: "Advanced customization options", included: true },
      { name: "Priority support", included: true },
      { name: "Access to tutorials", included: true },
      { name: "Advanced editing tools", included: true },
      { name: "Unlimited AI Avatars", included: false },
    ],
  },
  {
    name: "Enterprise",
    price: 29.99,
    features: [
      { name: "Unlimited AI Avatars", included: true },
      { name: "Full customization suite", included: true },
      { name: "24/7 Premium support", included: true },
      { name: "Access to tutorials", included: true },
      { name: "Advanced editing tools", included: true },
      { name: "API access", included: true },
    ],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
}

export default function SubscriptionPage() {
  const [activePlan, setActivePlan] = useState("Pro")
  const { toast } = useToast()

  const handleUpgrade = useCallback(
    (planName: string) => {
      setActivePlan(planName)
      toast({
        title: "Plan Updated",
        description: `You've successfully upgraded to the ${planName} plan.`,
        duration: 3000,
      })
    },
    [toast],
  )

  const PlanCard = ({ plan }: { plan: (typeof plans)[0] }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
      <motion.div
        key={plan.name}
        variants={itemVariants}
        className={`bg-white p-6 rounded-lg shadow-lg transition-all duration-300 ${
          plan.name === activePlan ? "ring-4 ring-primary" : ""
        } ${isHovered ? "transform scale-105" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h2 className="text-2xl font-bold text-text-primary mb-4">{plan.name}</h2>
        <p className="text-4xl font-bold text-primary mb-6">
          ${plan.price}
          <span className="text-sm font-normal text-text-secondary">/month</span>
        </p>
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <motion.li
              key={index}
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {feature.included ? (
                <Check className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <X className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span className={feature.included ? "text-text-primary" : "text-text-secondary"}>{feature.name}</span>
            </motion.li>
          ))}
        </ul>
        {isHovered && plan.name !== activePlan && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 p-1 rounded-full"
          >
            <Zap size={16} />
          </motion.div>
        )}
        <Button
          className={`w-full ${
            plan.name === activePlan ? "bg-green-500 hover:bg-green-600" : "bg-primary hover:bg-primary/90"
          } text-white transition-all duration-300`}
          onClick={() => handleUpgrade(plan.name)}
        >
          {plan.name === activePlan ? "Current Plan" : "Upgrade"}
        </Button>
      </motion.div>
    )
  }

  return (
    <UserLayout>
      <motion.div
        className="max-w-6xl mx-auto space-y-12 px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-2 text-center">
          <motion.h1
            className="text-2xl font-bold text-text-primary mb-6"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Choose Your Perfect Plan
          </motion.h1>
          <motion.p
            className="text-base text-text-secondary"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          >
            Unlock the full potential of AI-powered Chat Bots
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 md:grid-cols-3"
        >
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </motion.div>
      </motion.div>
    </UserLayout>
  )
}

