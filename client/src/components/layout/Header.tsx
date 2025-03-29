import { useLocation } from "wouter";
import { RiMenuLine, RiNotification3Line, RiQuestionLine } from "react-icons/ri";
import { useAuth } from "@/hooks/use-auth";
import { UserDropdown } from "@/components/user-dropdown";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [location] = useLocation();
  const { user } = useAuth();
  
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
      case "/auth":
        return "Authentication";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-2 text-[#FF0050] hover:text-[#EE1D52]"
              onClick={toggleSidebar}
            >
              <RiMenuLine className="text-xl" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <button className="p-2 text-[#FF0050] hover:text-[#EE1D52]">
                  <RiNotification3Line className="text-xl" />
                </button>
                <button className="p-2 text-[#00F2EA] hover:text-[#00D2CA]">
                  <RiQuestionLine className="text-xl" />
                </button>
                <UserDropdown />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
