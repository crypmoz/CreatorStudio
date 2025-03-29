import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { 
  TrendingUp, 
  Calendar, 
  MessageCircle, 
  DollarSign, 
  Users, 
  BrainCircuit, 
  ArrowRight, 
  Check,
  BarChart4
} from "lucide-react";

export default function Landing() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    if (user) {
      setLocation('/dashboard');
    } else {
      setLocation('/auth');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">CreatorAIDE</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/pricing">
              <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Pricing</span>
            </Link>
            <Link href="/help-center">
              <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Help</span>
            </Link>
            <Link href={user ? "/" : "/auth"}>
              <Button variant="outline">{user ? "Dashboard" : "Login"}</Button>
            </Link>
            {!user && (
              <Button onClick={() => setLocation('/auth')}>Sign Up Free</Button>
            )}
          </nav>
          <div className="md:hidden">
            <Button variant="outline" size="sm" onClick={() => setLocation('/auth')}>
              {user ? "Dashboard" : "Login"}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-gray-50 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Elevate Your TikTok Content with
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-primary to-cyan-400"> AI-Powered Tools</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                The all-in-one platform for TikTok creators to optimize content, 
                grow audience, and increase engagement using advanced AI technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={handleGetStarted}>
                  Get Started Free
                </Button>
                <Button size="lg" variant="outline" onClick={() => setLocation('/pricing')}>
                  View Pricing
                </Button>
              </div>
              <div className="mt-8 flex items-center text-sm text-muted-foreground">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>No credit card required for free plan</span>
              </div>
            </div>
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
              <p className="text-muted-foreground">Platform Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">All-in-One Creator Platform</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive suite of tools helps you create, optimize, and monetize your TikTok content.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<TrendingUp className="h-10 w-10 text-primary" />}
              title="Algorithm Assistant"
              description="Predict content performance with our AI-powered algorithm analyzer. Get actionable recommendations to increase your virality score."
            />
            <FeatureCard 
              icon={<BrainCircuit className="h-10 w-10 text-primary" />}
              title="AI Content Creation"
              description="Generate trending content ideas, engaging captions, and viral hooks tailored to your niche and audience preferences."
            />
            <FeatureCard 
              icon={<Calendar className="h-10 w-10 text-primary" />}
              title="Cross-Platform Scheduler"
              description="Schedule posts across multiple platforms with optimized posting times based on when your audience is most active."
            />
            <FeatureCard 
              icon={<MessageCircle className="h-10 w-10 text-primary" />}
              title="Community Manager"
              description="Efficiently manage comments and messages. Get AI-suggested responses to engage your audience effectively."
            />
            <FeatureCard 
              icon={<DollarSign className="h-10 w-10 text-primary" />}
              title="Monetization Tools"
              description="Track revenue streams, find brand deal opportunities, and optimize content for better monetization potential."
            />
            <FeatureCard 
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Audience Growth"
              description="Analyze your audience demographics and behavior to tailor content strategy for maximum growth and engagement."
            />
          </div>
        </div>
      </section>

      {/* Analytics Preview Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Data-Driven Content Optimization</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our powerful analytics dashboard provides deep insights into your content performance, 
                audience engagement, and growth opportunities.
              </p>
              <ul className="space-y-4">
                <FeatureItem text="Virality prediction score for each content piece" />
                <FeatureItem text="Audience demographic breakdown and behavior analysis" />
                <FeatureItem text="Engagement metrics with trend visualization" />
                <FeatureItem text="Revenue tracking and monetization opportunities" />
              </ul>
              <Button className="mt-8" onClick={handleGetStarted}>
                Try Analytics Tools <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
              <BarChart4 className="h-16 w-16 text-primary/50" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Creators</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hear what content creators are saying about how CreatorAIDE has transformed their TikTok strategy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              content="CreatorAIDE's algorithm assistant helped me increase my average views by 300%. The content suggestions are incredibly accurate for my audience."
              author="Sarah J."
              role="Lifestyle Creator, 1.2M Followers"
            />
            <TestimonialCard 
              content="The scheduling tools save me hours every week. I can plan my content calendar across multiple platforms and the AI helps me optimize posting times."
              author="Mike T."
              role="Gaming Content Creator, 650K Followers"
            />
            <TestimonialCard 
              content="Since using CreatorAIDE, I've seen a 40% increase in engagement and landed two major brand deals through the monetization tools. Worth every penny!"
              author="Elena K."
              role="Beauty Influencer, 2.5M Followers"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Content Strategy?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join thousands of creators who are leveraging AI to grow their audience and maximize engagement.
          </p>
          <Button size="lg" onClick={handleGetStarted}>
            Get Started Free
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required. Start with our free plan and upgrade anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">CreatorAIDE</h3>
              <p className="text-sm text-muted-foreground">
                The AI-powered platform for TikTok creators to optimize content and grow their audience.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/pricing"><span className="text-muted-foreground hover:text-foreground cursor-pointer">Pricing</span></Link></li>
                <li><Link href="/help-center"><span className="text-muted-foreground hover:text-foreground cursor-pointer">Help Center</span></Link></li>
                <li><span className="text-muted-foreground hover:text-foreground cursor-pointer">Updates</span></li>
                <li><span className="text-muted-foreground hover:text-foreground cursor-pointer">Roadmap</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-muted-foreground hover:text-foreground cursor-pointer">Blog</span></li>
                <li><span className="text-muted-foreground hover:text-foreground cursor-pointer">Community</span></li>
                <li><span className="text-muted-foreground hover:text-foreground cursor-pointer">Tutorials</span></li>
                <li><span className="text-muted-foreground hover:text-foreground cursor-pointer">Creator Stories</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-muted-foreground hover:text-foreground cursor-pointer">About Us</span></li>
                <li><span className="text-muted-foreground hover:text-foreground cursor-pointer">Careers</span></li>
                <li><Link href="/terms-of-use"><span className="text-muted-foreground hover:text-foreground cursor-pointer">Terms of Use</span></Link></li>
                <li><Link href="/privacy-policy"><span className="text-muted-foreground hover:text-foreground cursor-pointer">Privacy Policy</span></Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CreatorAIDE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border-2 hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-primary/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative z-10">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

const FeatureItem = ({ text }) => (
  <li className="flex items-start">
    <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
    <span>{text}</span>
  </li>
);

const TestimonialCard = ({ content, author, role }) => (
  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border">
    <p className="mb-4 italic">&ldquo;{content}&rdquo;</p>
    <div>
      <p className="font-semibold">{author}</p>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  </div>
);