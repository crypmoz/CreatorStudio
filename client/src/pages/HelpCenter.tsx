import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MessageCircleQuestion, Lightbulb, LifeBuoy, Mail, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const faqCategories = {
    general: [
      {
        question: "What is CreatorAIDE?",
        answer: "CreatorAIDE is a comprehensive platform designed for TikTok content creators. It offers AI-powered tools to help creators optimize content, grow their audience, manage community engagement, schedule posts across platforms, and maximize monetization opportunities."
      },
      {
        question: "How does the Algorithm Assistant work?",
        answer: "The Algorithm Assistant uses machine learning to analyze your content along with TikTok trends to predict how well your videos will perform. It provides a 'Virality Score' and specific recommendations to optimize your content for better reach and engagement."
      },
      {
        question: "Is CreatorAIDE only for TikTok creators?",
        answer: "While CreatorAIDE is optimized for TikTok creators, it includes cross-platform tools that allow you to manage and distribute content to other platforms like Instagram, YouTube, Facebook, and Twitter."
      },
      {
        question: "How accurate are the AI predictions?",
        answer: "Our AI models are continuously trained on the latest platform data and creator performance metrics. While no prediction tool is 100% accurate, our system provides reliable insights based on pattern recognition from thousands of successful videos."
      }
    ],
    account: [
      {
        question: "How do I connect my TikTok account?",
        answer: "Go to Account Settings, navigate to the 'Social Profiles' tab, and click on 'Connect TikTok Account'. You'll be guided through a secure authorization process to connect your TikTok account."
      },
      {
        question: "Can I manage multiple TikTok accounts?",
        answer: "Currently, CreatorAIDE supports one TikTok account per user. We're working on multi-account support for future releases."
      },
      {
        question: "How do I update my profile information?",
        answer: "Visit your Account Settings page by clicking on your profile picture in the top-right corner and selecting 'Account Settings'. From there, you can update your profile information, social profiles, and preferences."
      },
      {
        question: "How can I change my password?",
        answer: "In your Account Settings, go to the 'Security' tab where you can update your password. You'll need to enter your current password before setting a new one."
      }
    ],
    contentCreation: [
      {
        question: "How does the AI content generator work?",
        answer: "Our AI content generator uses DeepSeek AI technology to analyze trending topics, your audience preferences, and your past content performance. Based on your inputs and parameters, it generates content ideas, scripts, and optimization suggestions tailored to your creator style."
      },
      {
        question: "Can I edit the AI-generated content?",
        answer: "Yes, all AI-generated content is fully editable. We recommend using the AI output as a starting point that you can customize to match your voice and style."
      },
      {
        question: "How many content ideas can I generate?",
        answer: "The number of content ideas you can generate depends on your subscription plan. Free users receive a limited number of AI generations per month, while premium subscribers get unlimited access."
      },
      {
        question: "What types of content can the platform help me create?",
        answer: "CreatorAIDE helps with various content formats including trends, tutorials, storytelling, challenges, educational content, product reviews, and more. You can specify your content type when generating ideas or drafts."
      }
    ],
    technical: [
      {
        question: "What browsers are supported?",
        answer: "CreatorAIDE works best on Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your browser for optimal performance."
      },
      {
        question: "Is my data secure?",
        answer: "Yes, we take data security seriously. We use encryption for all sensitive data, implement secure authentication methods, and never share your personal information with third parties without your consent. See our Privacy Policy for more details."
      },
      {
        question: "How do I report a bug?",
        answer: "If you encounter any issues, please go to the Help Center and click on 'Report a Problem'. Provide as much detail as possible, including screenshots if applicable, to help our team resolve the issue quickly."
      },
      {
        question: "Does CreatorAIDE work on mobile devices?",
        answer: "Yes, CreatorAIDE is fully responsive and works on mobile devices. We also have plans to release dedicated iOS and Android apps in the future."
      }
    ]
  };
  
  const filteredFaqs = Object.entries(faqCategories).map(([category, questions]) => {
    return {
      category,
      questions: questions.filter(
        faq => 
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    };
  }).filter(category => category.questions.length > 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">Help Center</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions or reach out to our support team for assistance.
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-center mb-10">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search for answers..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="faq">
        <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq" className="space-y-8">
          {searchTerm ? (
            filteredFaqs.length > 0 ? (
              filteredFaqs.map(({category, questions}) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="capitalize">{category} Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {questions.map((faq, index) => (
                        <AccordionItem key={index} value={`${category}-item-${index}`}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <MessageCircleQuestion className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any answers matching your search. Try different keywords or contact our support team.
                </p>
                <Button>Contact Support</Button>
              </div>
            )
          ) : (
            Object.entries(faqCategories).map(([category, questions]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="capitalize">{category} Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {questions.map((faq, index) => (
                      <AccordionItem key={index} value={`${category}-item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="contact">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <LifeBuoy className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>Support Ticket</CardTitle>
                  <CardDescription>Create a support ticket for technical issues</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Our support team typically responds within 24 hours on business days.</p>
                <Button className="w-full">Create Ticket</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Mail className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>Email Us</CardTitle>
                  <CardDescription>Send us an email with your question</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Reach our team directly at support@creatoraide.com</p>
                <Button variant="outline" className="w-full">
                  <a href="mailto:support@creatoraide.com">Send Email</a>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Lightbulb className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>Feature Request</CardTitle>
                  <CardDescription>Suggest new features or improvements</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">We love hearing your ideas on how to make CreatorAIDE better!</p>
                <Button variant="outline" className="w-full">Submit Idea</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="resources">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>User Guides</CardTitle>
                  <CardDescription>Detailed guides for all features</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-primary hover:underline">Getting Started Guide</a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline">Content Creation Tutorial</a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline">Algorithm Optimization Tips</a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline">Monetization Strategies</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>Step-by-step video walkthroughs</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-primary hover:underline">Platform Overview</a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline">Using the AI Content Generator</a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline">Content Scheduling Workflow</a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline">Analytics Deep Dive</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Creator Community</CardTitle>
                <CardDescription>Connect with other creators</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-primary hover:underline">Join Discord Community</a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline">Monthly Webinars</a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline">Success Stories</a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline">Creator Spotlight</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}