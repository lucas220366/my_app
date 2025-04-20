import { Rocket, Bot, Globe, FileText, Palette, MessageSquare, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import SharedLayout from "@/components/SharedLayout"

const steps = [
  {
    icon: Rocket,
    title: "Create Your Project",
    description: "Start by creating a new project for your AI chatbot. Give it a name and set up the basic details.",
  },
  {
    icon: Bot,
    title: "Design Your AI Avatar",
    description:
      "Create a unique AI avatar for your chatbot. Choose from our pre-designed options or upload your own custom avatar.",
  },
  {
    icon: Globe,
    title: "Train Your AI",
    description:
      "Simply input your website URL, and our system will automatically scrape and analyze your content to train the AI chatbot.",
  },
  {
    icon: FileText,
    title: "Add Custom FAQs",
    description: "Enhance your chatbot's knowledge by adding frequently asked questions and their answers.",
  },
  {
    icon: Palette,
    title: "Customize Appearance",
    description:
      "Tailor the look and feel of your chatbot to match your brand. Adjust colors, fonts, and layout to your liking.",
  },
  {
    icon: MessageSquare,
    title: "Monitor Conversations",
    description:
      "Access and review all chat sessions initiated through your website chatbot for insights and improvements.",
  },
  {
    icon: Code,
    title: "Embed on Your Website",
    description:
      "With a simple code snippet, easily integrate your AI chatbot into your website and start engaging with visitors.",
  },
]

export default function HowItWorksPage() {
  return (
    <SharedLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">How ChatBotYard Works</h1>
        <p className="text-xl text-center text-text-secondary mb-16">
          ChatBotYard is an advanced AI chatbot builder that empowers you to create, train, and deploy intelligent
          chatbots with ease. Follow these simple steps to revolutionize your customer engagement.
        </p>
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-8">
              <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  {index + 1}. {step.title}
                </h2>
                <p className="text-text-secondary">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
            <a href="/auth/register">Get Started Now</a>
          </Button>
        </div>
      </div>
    </SharedLayout>
  )
}

