import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import AlgorithmAssistant from "@/pages/AlgorithmAssistant";
import ContentCreation from "@/pages/ContentCreation";
import Scheduler from "@/pages/Scheduler";
import CommunityManager from "@/pages/CommunityManager";
import Monetization from "@/pages/Monetization";
import AudienceGrowth from "@/pages/AudienceGrowth";
import AIAgent from "@/pages/AIAgent";
import MainLayout from "@/components/layout/MainLayout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/algorithm-assistant" component={AlgorithmAssistant} />
      <Route path="/content-creation" component={ContentCreation} />
      <Route path="/scheduler" component={Scheduler} />
      <Route path="/community" component={CommunityManager} />
      <Route path="/monetization" component={Monetization} />
      <Route path="/audience-growth" component={AudienceGrowth} />
      <Route path="/ai-agent" component={AIAgent} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <Router />
      </MainLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
