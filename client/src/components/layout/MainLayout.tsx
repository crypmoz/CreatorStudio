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

  // If on auth page, render just the auth component
  const isAuthPage = location === "/auth";
  if (isAuthPage) {
    return <>{children}</>;
  }

  // List of public pages that should use the public layout (no sidebar, simplified structure)
  const publicPages = [
    "/", // Landing page
    "/terms-of-use", 
    "/privacy-policy",
    "/help-center",
    "/contact",
    "/pricing",
    "/blog"
  ];
  
  const isPublicPage = publicPages.includes(location);
  
  // For public pages, show a different layout without sidebar
  if (isPublicPage && !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    );
  }
  
  // Determine if sidebar should be shown
  const shouldShowSidebar = !isAuthPage && user;
  
  // Dashboard layout with sidebar for authenticated users
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - only show when authenticated */}
        {shouldShowSidebar && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Show header for authenticated users */}
          {user && <Header toggleSidebar={toggleSidebar} />}
          
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
