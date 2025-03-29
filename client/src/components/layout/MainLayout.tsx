import { useState } from "react";
import { useLocation } from "wouter";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "@/hooks/use-auth";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // If on auth page or user not authenticated, don't show sidebar
  const isAuthPage = location === "/auth";
  const shouldShowSidebar = !isAuthPage && user;

  if (isAuthPage) {
    return <>{children}</>;
  }

  // For legal pages (terms, privacy policy), show a different layout
  const isLegalPage = location === "/terms-of-use" || location === "/privacy-policy";
  
  if (isLegalPage) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - only show when authenticated */}
        {shouldShowSidebar && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
