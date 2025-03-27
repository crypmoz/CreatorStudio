import { useLocation } from "wouter";
import { RiMenuLine, RiNotification3Line, RiQuestionLine } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [location] = useLocation();
  
  // Get page title based on current location
  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/algorithm-assistant":
        return "Algorithm Assistant";
      case "/content-creation":
        return "Content Creation";
      case "/scheduler":
        return "Scheduler";
      case "/community":
        return "Community Manager";
      case "/monetization":
        return "Monetization";
      case "/audience-growth":
        return "Audience Growth";
      case "/ai-agent":
        return "AI Agent";
      default:
        return "Dashboard";
    }
  };
  
  const { data: user } = useQuery({
    queryKey: ["/api/users/1"],
  });

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-2 text-gray-500"
              onClick={toggleSidebar}
            >
              <RiMenuLine className="text-xl" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <RiNotification3Line className="text-xl" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <RiQuestionLine className="text-xl" />
            </button>
            <div className="md:hidden">
              {user ? (
                <img 
                  className="h-8 w-8 rounded-full" 
                  src={user.avatar || "https://via.placeholder.com/32"} 
                  alt="Profile"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
