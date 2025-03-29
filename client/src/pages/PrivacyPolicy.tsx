import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-10 w-full max-w-5xl mx-auto">
      <Card className="w-full shadow-md">
        <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/5 border-b">
          <CardTitle className="text-2xl md:text-3xl font-bold text-center">Privacy Policy</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Last Updated: March 29, 2023
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-6">
              <section>
                <p className="mb-4">
                  At CreatorAIDE, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
                  and safeguard your information when you use our platform. Please read this privacy policy carefully. 
                  If you do not agree with the terms of this privacy policy, please do not access the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                <h3 className="text-lg font-medium mt-4 mb-2">Personal Data</h3>
                <p>We may collect personally identifiable information, such as:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Profile picture</li>
                  <li>Social media account information (when you connect your accounts)</li>
                  <li>Payment information (processed securely through our payment processors)</li>
                </ul>

                <h3 className="text-lg font-medium mt-4 mb-2">Content Data</h3>
                <p>
                  When you use our platform to create, analyze, or schedule content, we collect:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Content drafts, ideas, and published materials</li>
                  <li>Content metadata (including titles, descriptions, tags)</li>
                  <li>Images, videos, and other media files you upload</li>
                  <li>AI-generated content and analytics</li>
                </ul>

                <h3 className="text-lg font-medium mt-4 mb-2">Usage Data</h3>
                <p>
                  We automatically collect certain information when you access or use our service:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Device information (browser type, operating system, device type)</li>
                  <li>IP address and location information</li>
                  <li>Access times and dates</li>
                  <li>Pages viewed and features used</li>
                  <li>Actions taken within the application</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                <p>We use your personal information for various purposes, including to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process payments and manage your account</li>
                  <li>Communicate with you about our services, updates, and support</li>
                  <li>Personalize your experience and deliver tailored content recommendations</li>
                  <li>Develop new features and services based on user behavior and feedback</li>
                  <li>Analyze usage patterns to optimize our platform</li>
                  <li>Detect, prevent, and address technical issues or fraudulent activities</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Third-Party Integrations</h2>
                <p>
                  Our platform integrates with various third-party services, particularly social media platforms like TikTok. 
                  When you connect your social media accounts:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>We may receive information from these platforms according to their privacy policies and your privacy settings</li>
                  <li>We use this data to analyze your content performance, schedule posts, and provide analytics</li>
                  <li>Your use of these third-party services is governed by their respective terms and privacy policies</li>
                </ul>
                <p className="mt-2">
                  Our platform uses the TikTok API services. Your use of CreatorAIDE in connection with the TikTok API 
                  services is subject to the <a href="https://www.tiktok.com/legal/page/global/privacy-policy/en" className="text-primary underline">TikTok Privacy Policy</a>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. AI Technology and Content Analysis</h2>
                <p>
                  CreatorAIDE uses artificial intelligence technology to analyze content, generate recommendations, 
                  and provide insights:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Content submitted for AI analysis is processed to identify patterns, trends, and optimization opportunities</li>
                  <li>We may use anonymized patterns from content analysis to improve our AI models</li>
                  <li>AI-generated content suggestions are based on your inputs, industry trends, and platform algorithms</li>
                </ul>
                <p className="mt-2">
                  Our AI systems utilize DeepSeek's technology, and your data processing is subject to their security and 
                  privacy standards as well. We've selected this provider based on their robust privacy practices.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Data Sharing and Disclosure</h2>
                <p>We may share your information in the following circumstances:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><span className="font-medium">Service Providers:</span> With third-party vendors who provide services on our behalf (payment processors, analytics providers, AI technology partners, hosting services)</li>
                  <li><span className="font-medium">Business Transfers:</span> In connection with a merger, acquisition, or sale of assets</li>
                  <li><span className="font-medium">Legal Requirements:</span> To comply with applicable law, regulation, legal process, or governmental request</li>
                  <li><span className="font-medium">Protection:</span> To enforce our Terms of Use, protect the rights, safety, or property of CreatorAIDE, our users, or others</li>
                </ul>
                <p className="mt-2">
                  We do not sell your personal information to third parties for marketing purposes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal data against 
                  unauthorized or unlawful processing, accidental loss, destruction, or damage. These measures include:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Encryption of sensitive data</li>
                  <li>Regular security assessments and penetration testing</li>
                  <li>Strict access controls for our personnel</li>
                  <li>Regular backup procedures</li>
                  <li>Continuous monitoring for suspicious activities</li>
                </ul>
                <p className="mt-2">
                  However, no method of transmission over the Internet or electronic storage is 100% secure. 
                  While we strive to use commercially acceptable means to protect your information, we cannot guarantee 
                  its absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
                <p>
                  We retain your personal information for as long as needed to provide you with our services and as 
                  necessary to comply with our legal obligations, resolve disputes, and enforce our agreements. 
                  If you delete your account, we may retain certain information as required by law or for legitimate 
                  business purposes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. International Data Transfers</h2>
                <p>
                  We may transfer, store, and process your information in countries other than your own. Our servers 
                  may be located outside your country of residence. By using our Service, you consent to the transfer 
                  of your data internationally.
                </p>
                <p className="mt-2">
                  For users in the European Economic Area (EEA), we comply with applicable data protection laws when 
                  transferring your personal information outside the EEA. We may use standard contractual clauses approved 
                  by the European Commission or rely on alternative legal bases.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Your Privacy Rights</h2>
                <p>
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Rectify inaccurate or incomplete personal data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Restrict or object to the processing of your personal data</li>
                  <li>Data portability (receiving your data in a structured, commonly used format)</li>
                  <li>Withdraw consent where processing is based on consent</li>
                </ul>
                <p className="mt-2">
                  To exercise these rights, please contact us using the information in the "Contact Us" section. We will 
                  respond to your request within the timeframe required by applicable law.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Children's Privacy</h2>
                <p>
                  Our Service is not directed to individuals under the age of 16. We do not knowingly collect personal 
                  information from children. If you become aware that a child has provided us with personal information, 
                  please contact us. If we discover that we have collected personal information from a child without 
                  parental consent, we will take steps to delete that information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Cookies and Tracking Technologies</h2>
                <p>
                  We use cookies and similar tracking technologies to track activity on our Service and hold certain 
                  information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
                </p>
                <p className="mt-2">
                  We use cookies for:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Essential functionality (session management, authentication)</li>
                  <li>Analytics and performance (understanding how users interact with our Service)</li>
                  <li>Personalization (remembering your preferences)</li>
                </ul>
                <p className="mt-2">
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
                  However, if you do not accept cookies, you may not be able to use some portions of our Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">12. Changes to This Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                  Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy 
                  Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on 
                  this page.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">13. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <p className="mt-2 font-medium">
                  Email: privacy@creatoraide.com<br />
                  Address: 123 Creator Avenue, San Francisco, CA 94107
                </p>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}