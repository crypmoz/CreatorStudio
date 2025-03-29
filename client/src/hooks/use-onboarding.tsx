import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";

// Define the type for onboarding steps
export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector for the target element
  position: "top" | "right" | "bottom" | "left";
  order: number;
  points: number;
  isCompleted: boolean;
  route?: string; // Optional route to navigate to
};

// Define the type for onboarding progress
export type OnboardingProgress = {
  currentStep: string | null;
  completedSteps: string[];
  totalPoints: number;
  badges: string[];
  isEnabled: boolean;
  lastActive: Date | null;
};

// Types for context
type OnboardingContextType = {
  steps: OnboardingStep[];
  progress: OnboardingProgress;
  currentStep: OnboardingStep | null;
  isActive: boolean;
  startOnboarding: () => void;
  skipOnboarding: () => void;
  completeStep: (stepId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepId: string) => void;
};

// Initial onboarding steps
const initialSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to CreatorAIDE!",
    description: "Let's get you started with a quick tour of the platform. You'll earn points and badges as you go!",
    target: "body",
    position: "top",
    order: 0,
    points: 10,
    isCompleted: false,
  },
  {
    id: "dashboard",
    title: "Your Dashboard",
    description: "This is your central hub where you can see all your stats and quick access to key features.",
    target: ".dashboard-overview",
    position: "bottom",
    order: 1,
    points: 15,
    isCompleted: false,
    route: "/",
  },
  {
    id: "algorithm-assistant",
    title: "Algorithm Assistant",
    description: "Understand how TikTok's algorithm works and get personalized recommendations to boost your videos.",
    target: "[data-section='algorithm-assistant']",
    position: "right",
    order: 2,
    points: 20,
    isCompleted: false,
    route: "/algorithm-assistant",
  },
  {
    id: "content-creation",
    title: "Content Creation Hub",
    description: "Create, edit, and manage your content with AI assistance - from ideation to publishing.",
    target: "[data-section='content-creation']",
    position: "left",
    order: 3,
    points: 25,
    isCompleted: false,
    route: "/content-creation",
  },
  {
    id: "scheduler",
    title: "Cross-Platform Scheduler",
    description: "Schedule your content across multiple platforms at optimal times for maximum engagement.",
    target: "[data-section='scheduler']",
    position: "top",
    order: 4,
    points: 20,
    isCompleted: false,
    route: "/scheduler",
  },
  {
    id: "community-manager",
    title: "Community Manager",
    description: "Manage comments, messages, and interactions across all your social platforms.",
    target: "[data-section='community-manager']",
    position: "bottom",
    order: 5,
    points: 15,
    isCompleted: false,
    route: "/community",
  },
  {
    id: "monetization",
    title: "Monetization Dashboard",
    description: "Track your earnings, find brand deals, and explore new revenue opportunities.",
    target: "[data-section='monetization']",
    position: "right",
    order: 6,
    points: 25,
    isCompleted: false,
    route: "/monetization",
  },
  {
    id: "ai-agent",
    title: "AI Agent",
    description: "Your personal AI assistant to help with content ideas, caption writing, and more.",
    target: "[data-section='ai-agent']",
    position: "left",
    order: 7,
    points: 30,
    isCompleted: false,
    route: "/ai-agent",
  },
  {
    id: "completed",
    title: "All Done!",
    description: "Congratulations! You've completed the tutorial and earned your first badge. Keep exploring to earn more!",
    target: "body",
    position: "top",
    order: 8,
    points: 50,
    isCompleted: false,
  },
];

// Initial progress
const initialProgress: OnboardingProgress = {
  currentStep: "welcome",
  completedSteps: [],
  totalPoints: 0,
  badges: [],
  isEnabled: true,
  lastActive: null,
};

// Create the context
const OnboardingContext = createContext<OnboardingContextType | null>(null);

// Provider component
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [steps, setSteps] = useState<OnboardingStep[]>(initialSteps);
  const [progress, setProgress] = useState<OnboardingProgress>(initialProgress);
  const [isActive, setIsActive] = useState<boolean>(false);

  // Get the current step object
  const currentStep = steps.find(step => step.id === progress.currentStep) || null;

  // Load progress from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedProgress = localStorage.getItem(`onboarding-progress-${user.id}`);
      if (savedProgress) {
        try {
          const parsed = JSON.parse(savedProgress);
          setProgress(parsed);
          
          // Auto-start if there was an active session
          if (parsed.isEnabled && parsed.currentStep && !parsed.completedSteps.includes('completed')) {
            setIsActive(true);
          }
        } catch (error) {
          console.error("Failed to parse onboarding progress:", error);
        }
      } else {
        // First time user, show welcome modal
        setIsActive(true);
      }
    }
  }, [user]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (user && progress) {
      localStorage.setItem(`onboarding-progress-${user.id}`, JSON.stringify({
        ...progress,
        lastActive: new Date()
      }));
    }
  }, [progress, user]);

  // Start the onboarding process
  const startOnboarding = () => {
    setProgress({
      ...initialProgress,
      isEnabled: true,
      lastActive: new Date()
    });
    setIsActive(true);
  };

  // Skip onboarding
  const skipOnboarding = () => {
    setIsActive(false);
    setProgress({
      ...progress,
      isEnabled: false
    });
    toast({
      title: "Onboarding skipped",
      description: "You can restart the tutorial anytime from your account settings.",
    });
  };

  // Complete a step
  const completeStep = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (!step || progress.completedSteps.includes(stepId)) return;

    // Mark as completed and award points
    const updatedCompletedSteps = [...progress.completedSteps, stepId];
    const totalPoints = progress.totalPoints + step.points;
    
    // Check if any badges should be awarded
    let newBadges = [...progress.badges];
    
    // Award badges based on points or specific completions
    if (totalPoints >= 100 && !newBadges.includes('explorer')) {
      newBadges.push('explorer');
      toast({
        title: "Badge Earned: Explorer!",
        description: "You earned 100 points by exploring the platform.",
      });
    }
    
    if (updatedCompletedSteps.length === steps.length - 1) {
      newBadges.push('tutorial_master');
      toast({
        title: "Badge Earned: Tutorial Master!",
        description: "You've completed the entire tutorial.",
      });
    }

    // Update progress
    setProgress({
      ...progress,
      completedSteps: updatedCompletedSteps,
      totalPoints,
      badges: newBadges,
    });

    // Show toast for completing the step
    toast({
      title: `${step.points} points earned!`,
      description: `You completed: ${step.title}`,
    });
  };

  // Move to the next step
  const nextStep = () => {
    if (!currentStep) return;
    
    // Complete current step if not already completed
    if (!progress.completedSteps.includes(currentStep.id)) {
      completeStep(currentStep.id);
    }
    
    // Find the next step
    const currentOrder = currentStep.order;
    const nextStep = steps.find(step => step.order === currentOrder + 1);
    
    if (nextStep) {
      setProgress({
        ...progress,
        currentStep: nextStep.id,
      });
    } else {
      // No more steps, complete onboarding
      setIsActive(false);
      setProgress({
        ...progress,
        currentStep: null,
      });
      
      toast({
        title: "Onboarding Complete!",
        description: `Congratulations! You earned ${progress.totalPoints} points and ${progress.badges.length} badges.`,
      });
    }
  };

  // Move to the previous step
  const prevStep = () => {
    if (!currentStep) return;
    
    const currentOrder = currentStep.order;
    const prevStep = steps.find(step => step.order === currentOrder - 1);
    
    if (prevStep) {
      setProgress({
        ...progress,
        currentStep: prevStep.id,
      });
    }
  };

  // Go to a specific step
  const goToStep = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return;
    
    setProgress({
      ...progress,
      currentStep: stepId,
    });
  };

  return (
    <OnboardingContext.Provider
      value={{
        steps,
        progress,
        currentStep,
        isActive,
        startOnboarding,
        skipOnboarding,
        completeStep,
        nextStep,
        prevStep,
        goToStep,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

// Hook for consuming the context
export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}