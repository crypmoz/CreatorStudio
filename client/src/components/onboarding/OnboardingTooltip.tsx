import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useOnboarding } from "@/hooks/use-onboarding";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, ChevronLeft, ChevronRight, X, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

export function OnboardingTooltip() {
  const { 
    isActive, 
    currentStep, 
    steps, 
    progress, 
    skipOnboarding, 
    nextStep, 
    prevStep, 
  } = useOnboarding();
  
  const [location, setLocation] = useLocation();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [tooltipPosition, setTooltipPosition] = useState<"top" | "right" | "bottom" | "left">("bottom");
  const [targetEl, setTargetEl] = useState<Element | null>(null);
  
  // If no active step or not active, don't render
  if (!isActive || !currentStep) return null;
  
  // Calculate progress percentage
  const progressPercentage = Math.round((progress.completedSteps.length / (steps.length - 1)) * 100);
  
  // Effect to position the tooltip relative to the target element
  useEffect(() => {
    if (!currentStep) return;
    
    // Navigate to the appropriate route if specified
    if (currentStep.route && location !== currentStep.route) {
      setLocation(currentStep.route);
    }
    
    // Find the target element
    const targetElement = document.querySelector(currentStep.target);
    if (!targetElement) {
      // If target not found, center in viewport
      setPosition({
        top: window.innerHeight / 2 - 150,
        left: window.innerWidth / 2 - 200,
      });
      setTooltipPosition("bottom");
      return;
    }
    
    setTargetEl(targetElement);
    
    // Get target element position
    const rect = targetElement.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    
    // Position based on the specified position
    let top = 0;
    let left = 0;
    
    // Set tooltip position
    setTooltipPosition(currentStep.position);
    
    // Calculate position based on target and specified position
    switch (currentStep.position) {
      case "top":
        top = rect.top + scrollTop - 10 - 150; // tooltip height + padding
        left = rect.left + scrollLeft + rect.width / 2 - 200; // tooltip width / 2
        break;
      case "right":
        top = rect.top + scrollTop + rect.height / 2 - 75; // tooltip height / 2
        left = rect.right + scrollLeft + 10;
        break;
      case "bottom":
        top = rect.bottom + scrollTop + 10;
        left = rect.left + scrollLeft + rect.width / 2 - 200; // tooltip width / 2
        break;
      case "left":
        top = rect.top + scrollTop + rect.height / 2 - 75; // tooltip height / 2
        left = rect.left + scrollLeft - 10 - 400; // tooltip width + padding
        break;
    }
    
    // Make sure tooltip is within viewport
    if (top < 0) top = 10;
    if (left < 0) left = 10;
    if (left + 400 > window.innerWidth) left = window.innerWidth - 410;
    
    setPosition({ top, left });
    
    // Highlight the target element with a subtle pulsing effect
    if (targetElement && targetElement !== document.body) {
      targetElement.classList.add("onboarding-target");
      
      return () => {
        targetElement.classList.remove("onboarding-target");
      };
    }
  }, [currentStep, location]);
  
  // Determine if we're on the first or last step
  const isFirstStep = currentStep.order === 0;
  const isLastStep = currentStep.order === steps.length - 1;
  
  return (
    <>
      {/* Overlay for modal effect */}
      {(currentStep.id === "welcome" || currentStep.id === "completed") && (
        <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
      )}
      
      {/* Tooltip card */}
      <Card 
        className={cn(
          "fixed z-[60] w-[400px] shadow-lg transition-all duration-300",
          currentStep.id === "welcome" || currentStep.id === "completed" 
            ? "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
            : "transform"
        )}
        style={
          currentStep.id === "welcome" || currentStep.id === "completed" 
            ? {} 
            : { top: `${position.top}px`, left: `${position.left}px` }
        }
      >
        {/* Tooltip arrow */}
        {!(currentStep.id === "welcome" || currentStep.id === "completed") && (
          <div 
            className={cn(
              "absolute w-3 h-3 bg-background rotate-45 z-[1]",
              tooltipPosition === "top" && "bottom-[calc(100%-6px)] left-1/2 -translate-x-1/2",
              tooltipPosition === "right" && "left-[-6px] top-1/2 -translate-y-1/2",
              tooltipPosition === "bottom" && "top-[-6px] left-1/2 -translate-x-1/2",
              tooltipPosition === "left" && "right-[-6px] top-1/2 -translate-y-1/2"
            )}
          />
        )}
        
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{currentStep.title}</CardTitle>
              <Badge variant="outline" className="ml-2">
                +{currentStep.points} pts
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={skipOnboarding} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Progress value={progressPercentage} className="h-2" />
            <span className="text-xs text-muted-foreground">{progressPercentage}%</span>
          </div>
          <CardDescription>{currentStep.description}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col">
            {currentStep.id === "welcome" && (
              <div className="flex flex-col items-center justify-center py-4">
                <Rocket className="h-16 w-16 text-primary mb-2" />
                <p className="text-center text-sm">
                  Complete this tutorial to earn badges and unlock special features!
                </p>
                <div className="flex gap-2 mt-4">
                  <Badge variant="outline" className="py-1">
                    <Award className="h-4 w-4 mr-1 text-yellow-500" />
                    Tutorial Master
                  </Badge>
                  <Badge variant="outline" className="py-1">
                    <Award className="h-4 w-4 mr-1 text-blue-500" />
                    Explorer
                  </Badge>
                </div>
              </div>
            )}
            
            {currentStep.id === "completed" && (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative">
                  <Award className="h-16 w-16 text-yellow-500" />
                  <Badge className="absolute -top-2 -right-2 bg-primary">+{currentStep.points}</Badge>
                </div>
                <h3 className="text-lg font-semibold mt-2">Tutorial Complete!</h3>
                <p className="text-center text-sm mt-1">
                  You've earned {progress.totalPoints} points and {progress.badges.length} badges.
                </p>
                <div className="flex gap-2 mt-4">
                  {progress.badges.map((badge) => (
                    <Badge key={badge} variant="outline" className="py-1">
                      <Award className="h-4 w-4 mr-1 text-yellow-500" />
                      {badge.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={isFirstStep}
            className={isFirstStep ? "invisible" : ""}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          
          <Button onClick={nextStep}>
            {isLastStep ? "Finish" : "Next"}
            {!isLastStep && <ChevronRight className="ml-1 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}