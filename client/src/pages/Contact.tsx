import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  reason: z.enum(["support", "sales", "billing", "partnerships", "other"], {
    required_error: "Please select a reason for contact",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      reason: "support",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted with data:", data);
    
    // This would normally send data to a backend API
    setTimeout(() => {
      setIsSubmitted(true);
      toast({
        title: "Message sent!",
        description: "We've received your message and will respond soon.",
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about CreatorAIDE? Our team is here to help you succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <ContactCard 
            icon={<Mail className="h-6 w-6 text-primary" />}
            title="Email Us"
            content="support@creatoraide.com"
            subtitle="We typically respond within 24 hours."
          />
          <ContactCard 
            icon={<Phone className="h-6 w-6 text-primary" />}
            title="Call Us"
            content="+1 (555) 123-4567"
            subtitle="Available Monday-Friday, 9am-5pm EST"
          />
          <ContactCard 
            icon={<MapPin className="h-6 w-6 text-primary" />}
            title="Visit Us"
            content="123 Creator Avenue, San Francisco, CA 94107"
            subtitle="By appointment only"
          />
        </div>

        {isSubmitted ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold">Thank You!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your message has been sent successfully. Our team will get back to you as soon as possible.
              </p>
              <Button onClick={() => setIsSubmitted(false)} className="mt-4">
                Send Another Message
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Reason for Contact</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-wrap gap-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="support" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Support
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="sales" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Sales
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="billing" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Billing
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="partnerships" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Partnerships
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="other" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Other
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Subject of your message" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How can we help you?" 
                            className="min-h-[150px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full md:w-auto">
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-2">How quickly will I receive a response?</h3>
              <p className="text-muted-foreground">
                We typically respond to all inquiries within 24 hours during business days.
                For urgent support issues, premium members receive priority assistance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I schedule a demo?</h3>
              <p className="text-muted-foreground">
                Yes! If you're interested in a personalized demo of CreatorAIDE, please select "Sales" 
                as your reason for contact and mention you'd like a demo in your message.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Do you offer custom enterprise solutions?</h3>
              <p className="text-muted-foreground">
                Yes, we provide custom solutions for enterprise clients and agencies managing multiple creators.
                Contact our sales team to discuss your specific requirements.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">I'm having technical issues. What should I do?</h3>
              <p className="text-muted-foreground">
                For technical support, please select "Support" as your reason for contact and provide as much 
                detail as possible about the issue you're experiencing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ContactCard = ({ icon, title, content, subtitle }) => (
  <Card className="p-6 text-center">
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p>{content}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  </Card>
);