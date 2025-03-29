import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export default function TermsOfUse() {
  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-10 w-full max-w-5xl mx-auto">
      <Card className="w-full shadow-md">
        <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/5 border-b">
          <CardTitle className="text-2xl md:text-3xl font-bold text-center">Terms of Use</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Last Updated: March 29, 2023
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-6">
              <section>
                <p className="mb-4">
                  Welcome to CreatorAIDE. These Terms of Use govern your use of our platform, 
                  including any associated services, features, content, and websites provided by CreatorAIDE 
                  (collectively, the "Service"). Please read these Terms carefully before using the Service.
                </p>
                <p className="mb-4">
                  By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to 
                  these Terms, you may not access or use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">1. Account Registration</h2>
                <p className="mb-2">
                  To use certain features of the Service, you must register for an account. When you register, 
                  you agree to provide accurate, current, and complete information about yourself. You are 
                  responsible for maintaining the confidentiality of your account credentials and for all activities 
                  that occur under your account.
                </p>
                <p>
                  You must notify CreatorAIDE immediately of any unauthorized use of your account or any other 
                  breach of security. CreatorAIDE will not be liable for any loss or damage arising from your 
                  failure to protect your account credentials.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Subscription and Payment</h2>
                <p className="mb-2">
                  Some features of the Service require a paid subscription. By subscribing to a paid plan, you agree 
                  to pay the applicable fees as they become due. All payments are non-refundable except as required 
                  by law or as explicitly stated in these Terms.
                </p>
                <p className="mb-2">
                  CreatorAIDE reserves the right to change subscription fees upon reasonable notice. Such notice may 
                  be provided within the Service, by email, or by other reasonable means.
                </p>
                <p>
                  If your payment method fails or your account is past due, we may restrict or suspend your access to 
                  the Service until payment is received.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Content</h2>
                <p className="mb-2">
                  "Content" refers to any information, text, graphics, photos, videos, or other materials uploaded, 
                  downloaded, or appearing on the Service.
                </p>
                <h3 className="text-lg font-medium mt-4 mb-2">User Content</h3>
                <p className="mb-2">
                  You retain ownership rights in the content you create and post on the Service ("User Content"). 
                  By posting User Content, you grant CreatorAIDE a worldwide, non-exclusive, royalty-free license 
                  (with the right to sublicense) to use, copy, reproduce, process, adapt, modify, publish, transmit, 
                  display, and distribute such User Content in any and all media or distribution methods for the purpose 
                  of providing, improving, and promoting the Service.
                </p>
                <p className="mb-2">
                  You represent and warrant that: (1) you own the User Content or have the right to use and grant us 
                  the rights and license as provided in these Terms, and (2) the posting of your User Content does not 
                  violate the privacy rights, publicity rights, copyrights, contract rights, intellectual property rights, 
                  or any other rights of any person.
                </p>
                <h3 className="text-lg font-medium mt-4 mb-2">AI-Generated Content</h3>
                <p className="mb-2">
                  The Service may generate content using artificial intelligence ("AI-Generated Content") based on 
                  your inputs or instructions. While you may use AI-Generated Content for your personal or business 
                  purposes as permitted by your subscription plan, CreatorAIDE retains ownership of the underlying 
                  AI models, algorithms, and technology.
                </p>
                <p>
                  You are responsible for reviewing AI-Generated Content before using it and for ensuring that any 
                  content you publish complies with all applicable laws and regulations.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Prohibited Uses</h2>
                <p className="mb-2">You agree not to use the Service to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 mb-4">
                  <li>Violate any applicable law, regulation, or these Terms</li>
                  <li>Infringe the intellectual property rights of any party</li>
                  <li>Harass, abuse, or harm another person or entity</li>
                  <li>Publish or share content that is defamatory, obscene, or hateful</li>
                  <li>Publish or share content that promotes discrimination or violence</li>
                  <li>Impersonate any person or entity or falsely represent your affiliation</li>
                  <li>Engage in any activity that interferes with or disrupts the Service</li>
                  <li>Access or attempt to access the Service by any means other than the interface provided by CreatorAIDE</li>
                  <li>Circumvent, disable, or otherwise interfere with security-related features of the Service</li>
                  <li>Use the Service for any illegal or unauthorized purpose</li>
                </ul>
                <p>
                  CreatorAIDE reserves the right to investigate and take appropriate action against anyone who 
                  violates these prohibitions, including removing content, suspending or terminating accounts, 
                  and reporting violators to law enforcement authorities.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Third-Party Services and Social Media Platforms</h2>
                <p className="mb-2">
                  The Service integrates with third-party services and social media platforms like TikTok, Instagram, 
                  and others ("Third-Party Services"). When you connect your accounts with these Third-Party Services, 
                  you are bound by their respective terms of service and privacy policies in addition to these Terms.
                </p>
                <p className="mb-2">
                  CreatorAIDE is not responsible for the content, policies, or practices of any Third-Party Services. 
                  Your interactions with Third-Party Services are solely between you and the third party.
                </p>
                <p>
                  You acknowledge that CreatorAIDE may access, store, and disclose your account information and 
                  User Content as required to provide integration with Third-Party Services in accordance with 
                  the Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Intellectual Property Rights</h2>
                <p className="mb-2">
                  The Service and its original content (excluding User Content), features, and functionality are and 
                  will remain the exclusive property of CreatorAIDE and its licensors. The Service is protected by 
                  copyright, trademark, and other laws of both the United States and foreign countries.
                </p>
                <p className="mb-2">
                  CreatorAIDE's trademarks and trade dress may not be used in connection with any product or service 
                  without the prior written consent of CreatorAIDE.
                </p>
                <p>
                  You acknowledge that all intellectual property rights in the Service and its underlying technology 
                  (including AI models and algorithms) belong to CreatorAIDE or its licensors.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Termination</h2>
                <p className="mb-2">
                  CreatorAIDE may terminate or suspend your account and access to the Service at any time, with or 
                  without cause, and with or without notice. Upon termination, your right to use the Service will 
                  immediately cease.
                </p>
                <p className="mb-2">
                  You may terminate your account at any time by following the instructions on the Service or by 
                  contacting CreatorAIDE's support team.
                </p>
                <p>
                  All provisions of these Terms that by their nature should survive termination shall survive 
                  termination, including, without limitation, ownership provisions, warranty disclaimers, 
                  indemnity, and limitations of liability.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Disclaimer of Warranties</h2>
                <p className="mb-2">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS 
                  OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
                  PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
                </p>
                <p className="mb-2">
                  CreatorAIDE does not warrant that the Service will function uninterrupted, secure, or available 
                  at any particular time or location; that any errors or defects will be corrected; or that the 
                  Service is free of viruses or other harmful components.
                </p>
                <p>
                  CreatorAIDE does not warrant or make any representations concerning the accuracy, reliability, 
                  or effectiveness of AI-Generated Content, analytics, or optimization suggestions provided through 
                  the Service. These are provided for informational purposes only, and you are solely responsible 
                  for evaluating and verifying their appropriateness for your intended use.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Limitation of Liability</h2>
                <p className="mb-2">
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL CREATORAIDE, ITS AFFILIATES, 
                  DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, 
                  SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF 
                  PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, THAT RESULT FROM THE USE OF, OR INABILITY 
                  TO USE, THE SERVICE.
                </p>
                <p className="mb-2">
                  IN NO EVENT WILL CREATORAIDE'S TOTAL LIABILITY TO YOU FOR ALL DAMAGES, LOSSES, OR CAUSES OF ACTION 
                  EXCEED THE AMOUNT YOU HAVE PAID TO CREATORAIDE IN THE LAST SIX (6) MONTHS, OR, IF GREATER, ONE 
                  HUNDRED DOLLARS ($100).
                </p>
                <p>
                  THESE LIMITATIONS OF LIABILITY APPLY REGARDLESS OF THE LEGAL THEORY ON WHICH THE CLAIM IS BASED, 
                  INCLUDING BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER BASIS, 
                  AND EVEN IF CREATORAIDE HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Indemnification</h2>
                <p>
                  You agree to defend, indemnify, and hold harmless CreatorAIDE, its affiliates, licensors, and 
                  service providers, and its and their respective officers, directors, employees, contractors, 
                  agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, 
                  damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' 
                  fees) arising out of or relating to your violation of these Terms or your use of the Service, 
                  including, but not limited to, your User Content, any use of the Service other than as expressly 
                  authorized in these Terms, or your use of any information obtained from the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Governing Law and Dispute Resolution</h2>
                <p className="mb-2">
                  These Terms shall be governed by and construed in accordance with the laws of the State of 
                  California, without regard to its conflict of law provisions.
                </p>
                <p className="mb-2">
                  Any dispute arising from or relating to these Terms or the Service shall be resolved by binding 
                  arbitration under the rules of the American Arbitration Association, except that you may assert 
                  claims in small claims court if your claims qualify.
                </p>
                <p>
                  The arbitration will be conducted in San Francisco, California, and judgment on the arbitration 
                  award may be entered in any court having jurisdiction thereof. The arbitrator has exclusive 
                  authority to resolve any dispute relating to the interpretation, applicability, or enforceability 
                  of this binding arbitration agreement.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">12. Changes to Terms</h2>
                <p>
                  CreatorAIDE reserves the right to modify or replace these Terms at any time. We will provide 
                  reasonable notice of any changes, such as by posting the updated Terms on this page with a new 
                  "Last Updated" date, through the Service, or by other reasonable means. Your continued use of 
                  the Service after any such changes constitutes your acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">13. Contact Information</h2>
                <p>
                  If you have any questions about these Terms, please contact us:
                </p>
                <p className="mt-2 font-medium">
                  Email: legal@creatoraide.com<br />
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