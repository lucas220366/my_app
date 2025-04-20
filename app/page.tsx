"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  MessageSquare,
  Zap,
  Upload,
  Globe,
  BotIcon as Robot,
  FileText,
  Sparkles,
  Shield,
  Users,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: <Robot className="h-8 w-8 text-primary" />,
    title: "AI Avatar Generation",
    description: "Create unique, personalized AI avatars for your chatbot to give it a distinct personality.",
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: "Website Crawling & AI Training",
    description: "Our AI crawls your website to learn about your business, ensuring accurate and contextual responses.",
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "Knowledge File Uploads",
    description: "Easily upload additional documents to expand your chatbot's knowledge base and capabilities.",
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Lightning-Fast Setup",
    description: "Get your AI chatbot up and running in minutes with our intuitive, user-friendly interface.",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: "AI-Powered Conversations",
    description: "Engage customers with intelligent, context-aware chatbots that understand and respond naturally.",
  },
  {
    icon: <Upload className="h-8 w-8 text-primary" />,
    title: "Easy Website Integration",
    description: "Seamlessly add your AI chatbot to your website with a simple code snippet or widget.",
  },
]

const testimonials = [
  {
    quote: "ChatBotYard transformed our customer service. We've seen a 40% increase in customer satisfaction!",
    author: "Sarah Johnson",
    company: "TechCorp Inc.",
  },
  {
    quote: "The AI-powered responses are incredibly accurate. It's like having a 24/7 expert support team.",
    author: "Michael Chen",
    company: "Innovate Solutions",
  },
  {
    quote: "Easy to set up and customize. ChatBotYard has significantly reduced our response times.",
    author: "Emily Rodriguez",
    company: "Startup Dynamo",
  },
]

export default function LandingPage() {
  const controls = useAnimation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 100
      if (show) {
        setIsVisible(true)
        controls.start({ opacity: 1, y: 0 })
      } else {
        setIsVisible(false)
        controls.start({ opacity: 0, y: 20 })
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [controls])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background-white to-background">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">ChatBotYard</span>
          </Link>
          <div className="space-x-4">
            <Link href="/how-it-works" className="text-text-primary hover:text-primary transition-colors">
              How it Works
            </Link>
            <Link href="/pricing" className="text-text-primary hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="text-text-primary hover:text-primary transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="text-text-primary hover:text-primary transition-colors">
              Contact Us
            </Link>
            <Link href="/auth" className="text-text-primary hover:text-primary transition-colors">
              Log In
            </Link>
            <Button asChild>
              <Link href="/auth/register">Sign Up Free</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <motion.h1
              className="text-5xl font-bold text-text-primary"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              AI Customer Service Chatbot for Your Business
            </motion.h1>
            <motion.p
              className="text-xl text-text-secondary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create intelligent, conversational experiences that delight your customers and boost your business. Our
              AI-powered chatbot is trained on your data, connected to your systems, and ready to support your clients
              24/7.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex gap-4"
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
                <Link href="/auth/register">
                  Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/how-it-works">How it Works</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <Image
              src="https://www.chatlab.com/staticimg/hero-illustration-static-en.png"
              alt="ChatBot Platform Demo"
              width={800}
              height={600}
              className="w-full h-auto"
              priority
            />
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Supercharge Your Customer Interactions</h2>
          <p className="text-xl text-text-secondary mb-8">
            Harness the power of AI to provide instant, personalized support 24/7
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:border-primary transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">{feature.title}</h3>
              <p className="text-text-secondary">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-6">Trusted by Innovative Businesses</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <p className="text-text-secondary mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold text-text-primary">{testimonial.author}</p>
                <p className="text-sm text-text-secondary">{testimonial.company}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary text-white rounded-lg p-8 mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Customer Experience?</h2>
            <p className="text-xl mb-6">
              Join thousands of businesses already using ChatBotYard to delight their customers.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth/register">
                Start Your Free 7-Day Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-6">Why Choose ChatBotYard?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">Enterprise-Grade Security</h3>
              <p className="text-text-secondary">
                Your data is protected with state-of-the-art encryption and security measures.
              </p>
            </div>
            <div>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">Dedicated Support Team</h3>
              <p className="text-text-secondary">
                Our experts are always ready to help you get the most out of ChatBotYard.
              </p>
            </div>
            <div>
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">Continuous Innovation</h3>
              <p className="text-text-secondary">We're constantly improving our AI to keep you ahead of the curve.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex justify-center space-x-4">
              <Link href="/privacy" className="text-text-secondary hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-text-secondary hover:text-primary">
                Terms of Use
              </Link>
            </div>
            <div className="flex space-x-6">
              <Link href="https://twitter.com/chatbotyard" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5 text-gray-600 hover:text-primary transition-colors" />
              </Link>
              <Link href="https://instagram.com/chatbotyard" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5 text-gray-600 hover:text-primary transition-colors" />
              </Link>
              <Link href="https://facebook.com/chatbotyard" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5 text-gray-600 hover:text-primary transition-colors" />
              </Link>
              <Link href="https://linkedin.com/company/chatbotyard" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5 text-gray-600 hover:text-primary transition-colors" />
              </Link>
            </div>
            <div className="text-center text-text-secondary">
              <p>&copy; 2025 ChatBotYard. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      <motion.div className="fixed bottom-4 right-4" initial={{ opacity: 0, y: 20 }} animate={controls}>
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-primary hover:bg-primary/90 text-white rounded-full p-3"
        >
          <ArrowRight className="h-6 w-6 rotate-[-90deg]" />
        </Button>
      </motion.div>
    </div>
  )
}

