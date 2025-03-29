import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleUpgradeClick = (planName: string) => {
    if (!user) {
      setLocation('/auth');
      return;
    }
    
    // This would typically call a payment processing API
    console.log(`Upgrading to ${planName} plan (${billingPeriod} billing)`);
  };

  const plans = [
    {
      name: "Free",
      description: "Basic tools for casual creators and beginners",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        { name: "Limited AI content generation (5/month)", included: true },
        { name: "Basic analytics dashboard", included: true },
        { name: "Content scheduler (up to 10 posts)", included: true },
        { name: "Community management tools", included: true },
        { name: "Single platform connection", included: true },
        { name: "Advanced virality prediction", included: false },
        { name: "Monetization tools", included: false },
        { name: "Unlimited content creation", included: false },
        { name: "Multi-platform integration", included: false },
        { name: "Priority support", included: false },
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Creator",
      description: "Everything serious creators need to grow their audience",
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      features: [
        { name: "Enhanced AI content generation (50/month)", included: true },
        { name: "Advanced analytics dashboard", included: true },
        { name: "Content scheduler (unlimited posts)", included: true },
        { name: "Enhanced community management", included: true },
        { name: "Multi-platform connection (up to 3)", included: true },
        { name: "Advanced virality prediction", included: true },
        { name: "Basic monetization tools", included: true },
        { name: "Unlimited content creation", included: false },
        { name: "Priority TikTok algorithm analysis", included: false },
        { name: "Priority support", included: false },
      ],
      cta: "Upgrade Now",
      popular: true
    },
    {
      name: "Professional",
      description: "Advanced tools for professional content creators",
      monthlyPrice: 49.99,
      yearlyPrice: 499.99,
      features: [
        { name: "Unlimited AI content generation", included: true },
        { name: "Professional analytics suite", included: true },
        { name: "Advanced content scheduler with team collaboration", included: true },
        { name: "Premium community management", included: true },
        { name: "Multi-platform connection (unlimited)", included: true },
        { name: "Real-time virality prediction", included: true },
        { name: "Advanced monetization tools", included: true },
        { name: "White-label content export", included: true },
        { name: "Priority TikTok algorithm analysis", included: true },
        { name: "24/7 priority support", included: true },
      ],
      cta: "Go Professional",
      popular: false
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground text-lg">
          Choose the plan that best fits your needs. Upgrade or downgrade at any time.
        </p>
        
        <div className="flex items-center justify-center mt-8 space-x-2">
          <Label htmlFor="billing-toggle">Monthly</Label>
          <Switch
            id="billing-toggle"
            checked={billingPeriod === "yearly"}
            onCheckedChange={(checked) => setBillingPeriod(checked ? "yearly" : "monthly")}
          />
          <Label htmlFor="billing-toggle" className="flex items-center">
            Yearly
            <span className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded-full font-medium">
              Save 15%
            </span>
          </Label>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`flex flex-col ${plan.popular ? 
              'border-primary shadow-lg relative' : 
              'border-border'}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-3">
                <span className="bg-primary text-white text-xs px-3 py-1 rounded-full font-medium">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <p className="text-4xl font-bold">
                  ${billingPeriod === "monthly" ? 
                    plan.monthlyPrice.toFixed(2) : 
                    plan.yearlyPrice.toFixed(2)}
                </p>
                <p className="text-muted-foreground">
                  per {billingPeriod === "monthly" ? "month" : "year"}
                </p>
              </div>
              
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mr-2 shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground"}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleUpgradeClick(plan.name)}
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left mt-8">
          <div>
            <h3 className="font-semibold text-lg mb-2">Can I change plans later?</h3>
            <p className="text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes to your subscription will be reflected immediately.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Is there a free trial?</h3>
            <p className="text-muted-foreground">
              We offer a 14-day free trial of the Creator plan so you can explore all the features before committing.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
            <p className="text-muted-foreground">
              We accept all major credit cards, PayPal, and Apple Pay for subscription payments.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">How do I cancel my subscription?</h3>
            <p className="text-muted-foreground">
              You can cancel your subscription at any time from your Account Settings. You'll continue to have access until the end of your billing period.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-16 text-center bg-gray-50 dark:bg-gray-900 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-3">Need a custom plan for your team?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          We offer custom enterprise solutions for agencies and large creator teams with specialized needs.
        </p>
        <Button variant="outline" size="lg">Contact Sales</Button>
      </div>
    </div>
  );
}