import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Pages
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import AlgorithmAssistant from "@/pages/AlgorithmAssistant";
import ContentCreation from "@/pages/ContentCreation";
import Scheduler from "@/pages/Scheduler";
import CommunityManager from "@/pages/CommunityManager";
import Monetization from "@/pages/Monetization";
import AudienceGrowth from "@/pages/AudienceGrowth";
import AIAgent from "@/pages/AIAgent";
import AccountSettings from "@/pages/AccountSettings";
import AuthPage from "@/pages/auth-page";
import TermsOfUse from "@/pages/TermsOfUse";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import MainLayout from "@/components/layout/MainLayout";

// Setup Auth Request Interceptor
import { setupAuthInterceptor } from "./lib/queryClient";
setupAuthInterceptor();

function Router() {
  return (
    <Switch>
      {/* Auth Routes */}
      <Route path="/auth" component={AuthPage} />

      {/* Legal Pages - Public */}
      <Route path="/terms-of-use" component={TermsOfUse} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />

      {/* Protected Routes */}
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/algorithm-assistant" component={AlgorithmAssistant} />
      <ProtectedRoute path="/content-creation" component={ContentCreation} />
      <ProtectedRoute path="/scheduler" component={Scheduler} />
      <ProtectedRoute path="/community" component={CommunityManager} />
      <ProtectedRoute path="/monetization" component={Monetization} />
      <ProtectedRoute path="/audience-growth" component={AudienceGrowth} />
      <ProtectedRoute path="/ai-agent" component={AIAgent} />
      <ProtectedRoute path="/account-settings" component={AccountSettings} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MainLayout>
          <Router />
        </MainLayout>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
