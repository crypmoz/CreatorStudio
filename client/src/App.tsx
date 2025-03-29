import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import ErrorBoundary from "@/components/error-boundary";
import { SEOHead } from "@/components/seo/SEOHead";

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
import HelpCenter from "@/pages/HelpCenter";
import Contact from "@/pages/Contact";
import Pricing from "@/pages/Pricing";
import Blog from "@/pages/Blog";
import Landing from "@/pages/Landing";
import MainLayout from "@/components/layout/MainLayout";

// Setup Auth Request Interceptor
import { setupAuthInterceptor } from "./lib/queryClient";
setupAuthInterceptor();

function Router() {
  const { user } = useAuth();
  
  return (
    <Switch>
      {/* Public Landing Page for Non-Authenticated Users */}
      <Route path="/" component={() => {
        // If user is not authenticated, show Landing page, otherwise redirect to Dashboard
        return !user ? <Landing /> : <Dashboard />;
      }} />
      
      {/* Auth Routes */}
      <Route path="/auth" component={AuthPage} />

      {/* Public Pages */}
      <Route path="/terms-of-use" component={TermsOfUse} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/help-center" component={HelpCenter} />
      <Route path="/contact" component={Contact} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/blog" component={Blog} />
      
      {/* Protected Routes */}
      <ProtectedRoute path="/dashboard" component={Dashboard} />
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
    <ErrorBoundary>
      <SEOHead />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MainLayout>
            <Router />
          </MainLayout>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
