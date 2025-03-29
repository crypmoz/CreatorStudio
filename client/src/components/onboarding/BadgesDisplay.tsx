import { useOnboarding } from "@/hooks/use-onboarding";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, Trophy, Medal, Star, Crown, Rocket } from "lucide-react";

// Define badge icons and descriptions
const badgeData = {
  explorer: {
    icon: <Rocket className="h-6 w-6 text-blue-500" />,
    title: "Explorer",
    description: "Earned by completing the basic onboarding steps and exploring the platform.",
    color: "blue"
  },
  tutorial_master: {
    icon: <Trophy className="h-6 w-6 text-yellow-500" />,
    title: "Tutorial Master",
    description: "Completed the entire platform tutorial.",
    color: "yellow"
  },
  content_creator: {
    icon: <Star className="h-6 w-6 text-green-500" />,
    title: "Content Creator",
    description: "Created your first piece of content.",
    color: "green"
  },
  scheduler_pro: {
    icon: <Medal className="h-6 w-6 text-purple-500" />,
    title: "Scheduler Pro",
    description: "Scheduled posts across multiple platforms.",
    color: "purple"
  },
  algorithm_expert: {
    icon: <Crown className="h-6 w-6 text-orange-500" />,
    title: "Algorithm Expert",
    description: "Achieved a virality score of 80+ on a video.",
    color: "orange"
  }
};

// Type definition for our badge data
type BadgeKey = keyof typeof badgeData;

export function BadgesDisplay() {
  const { progress, steps } = useOnboarding();
  
  // Calculate overall progress 
  const totalPoints = steps.reduce((sum, step) => sum + step.points, 0);
  const progressPercentage = Math.round((progress.totalPoints / totalPoints) * 100);
  
  // Get the user's badges
  const earnedBadges = progress.badges as BadgeKey[];
  const lockedBadges = Object.keys(badgeData).filter(
    (badge) => !progress.badges.includes(badge)
  ) as BadgeKey[];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Your Achievements
        </CardTitle>
        <CardDescription>
          Complete platform activities to earn badges and points
        </CardDescription>
        <div className="flex items-center gap-2 mt-2">
          <Progress value={progressPercentage} className="h-2 flex-1" />
          <span className="text-sm font-medium">{progress.totalPoints} / {totalPoints} pts</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Earned badges */}
          {earnedBadges.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Earned Badges</h3>
              {earnedBadges.map((badge) => (
                <div key={badge} className="flex items-start gap-3 p-2 rounded-lg bg-secondary/30">
                  <div className="mt-1">{badgeData[badge].icon}</div>
                  <div>
                    <h4 className="font-medium">{badgeData[badge].title}</h4>
                    <p className="text-xs text-muted-foreground">{badgeData[badge].description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Locked badges */}
          {lockedBadges.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Badges to Earn</h3>
              {lockedBadges.map((badge) => (
                <div key={badge} className="flex items-start gap-3 p-2 rounded-lg bg-muted/50 opacity-70">
                  <div className="mt-1 grayscale">{badgeData[badge].icon}</div>
                  <div>
                    <h4 className="font-medium">{badgeData[badge].title}</h4>
                    <p className="text-xs text-muted-foreground">{badgeData[badge].description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}