import SharedLayout from "@/components/SharedLayout"

export default function TermsAndConditionsPage() {
  return (
    <SharedLayout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        <p className="mb-4">Last updated: [Date]</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using ChatBotYard's website and services, you agree to be bound by these Terms and
            Conditions. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p>
            ChatBotYard provides AI-powered chatbot creation and management services. We reserve the right to modify,
            suspend, or discontinue any part of our services at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account information and for all activities
            that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
          <p>
            You retain ownership of any content you create or upload to our services. By using our services, you grant
            us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your content
            for the purpose of providing and improving our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Use our services for any illegal purposes</li>
            <li>Upload or transmit any content that infringes on intellectual property rights</li>
            <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
            <li>Use our services to distribute spam or malicious software</li>
            <li>Engage in any activity that disrupts or interferes with our services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Payment and Subscription</h2>
          <p>
            Certain features of our services may require payment. You agree to pay all fees associated with your use of
            our services. We reserve the right to change our pricing and subscription models at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your account and access to our services at our sole discretion,
            without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other
            users, us, or third parties, or for any other reason.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
          <p>
            Our services are provided "as is" without any warranties, expressed or implied. We do not guarantee that our
            services will be uninterrupted, secure, or error-free.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, ChatBotYard shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, or any loss of profits or revenues.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
          <p>
            We may update these Terms and Conditions from time to time. We will notify you of any changes by posting the
            new Terms and Conditions on this page and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
          <p>If you have any questions about these Terms and Conditions, please contact us at [contact email].</p>
        </section>
      </div>
    </SharedLayout>
  )
}

