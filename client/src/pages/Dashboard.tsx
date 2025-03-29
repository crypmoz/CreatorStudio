import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  RiEyeLine, 
  RiUserFollowLine, 
  RiHeart3Line, 
  RiMoneyDollarCircleLine 
} from "react-icons/ri";

import StatCard from "@/components/dashboard/StatCard";
import ViralityScore from "@/components/dashboard/ViralityScore";
import EngagementChart from "@/components/dashboard/EngagementChart";
import ContentTemplates from "@/components/dashboard/ContentTemplates";
import CalendarSchedule from "@/components/dashboard/CalendarSchedule";
import CommentsList from "@/components/dashboard/CommentsList";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { useLocation } from "wouter";

const Dashboard = () => {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const userId = user?.id;

  // Fetch analytics data
  const { data: analytics, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: [`/api/users/${userId}/analytics`],
    enabled: !!userId,
  });

  // Fetch content templates
  const { data: templates, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ["/api/content-templates"],
  });

  // Fetch scheduled posts
  const { data: scheduledPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: [`/api/users/${userId}/scheduled-posts`],
    enabled: !!userId,
  });

  // Fetch comments
  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: ["/api/videos/1/comments"], // This will be changed later to be user-specific
  });

  // Fetch revenue data
  const { data: revenue, isLoading: isLoadingRevenue } = useQuery({
    queryKey: [`/api/users/${userId}/revenue`],
    enabled: !!userId,
  });

  // Handler functions
  const handleAnalysisClick = () => {
    setLocation("/algorithm-assistant");
  };

  const handleNewVideoClick = () => {
    setLocation("/content-creation");
  };

  const handleScheduleClick = () => {
    setLocation("/scheduler");
  };

  const handleTemplateClick = (template: any) => {
    toast({
      title: "Template Selected",
      description: `You selected the "${template.title}" template.`,
    });
  };

  const handleViewMoreIdeasClick = () => {
    setLocation("/content-creation");
  };

  const handleViewAllCommentsClick = () => {
    setLocation("/community");
  };

  const handleReplyComment = (commentId: number) => {
    toast({
      title: "Reply to Comment",
      description: `You're replying to comment #${commentId}.`,
    });
  };

  const handleViewReportsClick = () => {
    setLocation("/monetization");
  };

  // Preparing calendar data
  const calendarDays = Array.from({ length: 14 }, (_, i) => ({
    day: i + 1,
    isCurrentMonth: true,
    hasEvents: [2, 6, 8].includes(i + 1),
    isSelected: i + 1 === 8,
    events: i + 1 === 8 ? 2 : 0
  }));

  // Preparing optimization suggestions
  const optimizationSuggestions = [
    { type: "success", message: "Your hook is effective (first 3 seconds)" },
    { type: "warning", message: "Video length (45s) is shorter than optimal (60-90s)" },
    { type: "warning", message: "Try adding 2-3 more trending hashtags" }
  ];

  // Engagement chart data
  const chartData = [
    { label: "Mon", value: 30 },
    { label: "Tue", value: 45 },
    { label: "Wed", value: 80 },
    { label: "Thu", value: 60 },
    { label: "Fri", value: 75 },
    { label: "Sat", value: 90 },
    { label: "Sun", value: 50 }
  ];

  // Metrics data for engagement chart
  const engagementMetrics = [
    { 
      label: "Avg. Watch Time", 
      value: "18.2s", 
      change: { value: "+5.3%", direction: "up" } 
    },
    { 
      label: "Comments/View", 
      value: "2.4%", 
      change: { value: "+1.7%", direction: "up" } 
    },
    { 
      label: "Shares/View", 
      value: "3.8%", 
      change: { value: "-0.5%", direction: "down" } 
    }
  ];

  // AI content suggestions
  const aiSuggestions = [
    { content: "5 Underrated Features Most TikTok Users Don't Know" },
    { content: "My Morning Routine: What Actually Works vs Hype" }
  ];

  // Engagement insights
  const engagementInsights = [
    { label: "Avg. Response Time", value: "3.2 hrs", target: "Target: < 2 hrs" },
    { label: "Response Rate", value: "78%", changePercentage: 5 }
  ];

  // Revenue sources
  const revenueSources = [
    { name: "Creator Fund", percentage: 45, color: "#FF0050" },
    { name: "Brand Deals", percentage: 30, color: "#00F2EA" },
    { name: "Affiliate Links", percentage: 25, color: "#EE1D52" }
  ];

  // Revenue summary
  const revenueSummary = {
    total: "$3,240.85",
    change: "+22%",
    direction: "up" as const,
    projected: "$4,100.00"
  };

  return (
    <div className="dashboard-overview">
      {/* Overview Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Views"
            value={isLoadingAnalytics ? "..." : analytics?.totalViews.toLocaleString() || "0"}
            changeValue="12.5%"
            changeDirection="up"
            icon={RiEyeLine}
            iconBgColor="bg-[#FF0050] bg-opacity-10"
            iconColor="text-[#FF0050]"
          />
          
          <StatCard
            title="Followers"
            value={isLoadingAnalytics ? "..." : analytics?.followers.toLocaleString() || "0"}
            changeValue="8.3%"
            changeDirection="up"
            icon={RiUserFollowLine}
            iconBgColor="bg-[#00F2EA] bg-opacity-10"
            iconColor="text-[#00F2EA]"
          />
          
          <StatCard
            title="Engagement"
            value={isLoadingAnalytics ? "..." : `${analytics?.engagement}%` || "0%"}
            changeValue="2.1%"
            changeDirection="down"
            icon={RiHeart3Line}
            iconBgColor="bg-[#EE1D52] bg-opacity-10"
            iconColor="text-[#EE1D52]"
          />
          
          <StatCard
            title="Est. Revenue"
            value={isLoadingAnalytics ? "..." : `$${analytics?.estimatedRevenue.toLocaleString()}` || "$0"}
            changeValue="15.3%"
            changeDirection="up"
            icon={RiMoneyDollarCircleLine}
            iconBgColor="bg-[#FF0050] bg-opacity-10"
            iconColor="text-[#FF0050]"
          />
        </div>
      </div>

      {/* Algorithm Assistant Section */}
      <div className="mb-8" data-section="algorithm-assistant">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Algorithm Assistant</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Virality Score Card */}
          <div className="lg:col-span-1">
            <ViralityScore 
              score={78} 
              optimizations={optimizationSuggestions}
              onAnalysisClick={handleAnalysisClick}
            />
          </div>

          {/* Engagement Metrics Chart */}
          <div className="lg:col-span-2">
            <EngagementChart 
              chartData={chartData}
              metrics={engagementMetrics}
            />
          </div>
        </div>
      </div>

      {/* Content & Scheduling Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Content Creation Hub */}
        <div data-section="content-creation">
          <ContentTemplates 
            templates={isLoadingTemplates ? [] : templates || []}
            aiSuggestions={aiSuggestions}
            onNewVideoClick={handleNewVideoClick}
            onTemplateClick={handleTemplateClick}
            onViewMoreClick={handleViewMoreIdeasClick}
          />
        </div>

        {/* Cross-Platform Scheduler */}
        <div data-section="scheduler">
          <CalendarSchedule 
            month="June"
            year={2023}
            days={calendarDays}
            scheduledPosts={isLoadingPosts ? [] : scheduledPosts || []}
            onScheduleClick={handleScheduleClick}
            onPrevMonth={() => {}}
            onNextMonth={() => {}}
            onDayClick={() => {}}
          />
        </div>
      </div>

      {/* Community & Monetization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Community Manager */}
        <div data-section="community-manager">
          <CommentsList 
            comments={isLoadingComments ? [] : comments || []}
            insights={engagementInsights}
            onViewAllClick={handleViewAllCommentsClick}
            onReplyClick={handleReplyComment}
          />
        </div>

        {/* Monetization Dashboard */}
        <div data-section="monetization">
          <RevenueChart 
            revenueSources={revenueSources}
            summary={revenueSummary}
            onViewReportsClick={handleViewReportsClick}
          />
        </div>
      </div>
      
      {/* AI Agent Section */}
      <div className="mt-8" data-section="ai-agent">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Agent</h2>
        <div className="bg-gradient-to-r from-[#00F2EA]/10 to-[#FF0050]/10 rounded-lg p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-4 rounded-full bg-gradient-to-r from-[#00F2EA] to-[#FF0050] text-white">
              <RiMoneyDollarCircleLine className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-medium">Your Personal AI Assistant</h3>
              <p className="text-gray-600 mt-1">Generate content ideas, create captions, analyze trends, and more with our AI-powered assistant.</p>
            </div>
            <button 
              onClick={() => setLocation("/ai-agent")}
              className="px-4 py-2 bg-gradient-to-r from-[#00F2EA] to-[#FF0050] text-white rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              Open AI Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
