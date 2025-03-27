import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { RiDashboardLine, RiLineChartLine, RiMovieLine, RiCalendar2Line, RiTeamLine, RiMoneyDollarCircleLine, RiUserStarLine, RiRobotLine, RiSettingsLine } from "react-icons/ri";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const [location] = useLocation();
  
  const { data: user } = useQuery<{
    id: number;
    username: string;
    displayName: string;
    handle?: string;
    avatar?: string;
  }>({
    queryKey: ["/api/users/1"],
  });

  const navItems = [
    { path: "/", label: "Dashboard", icon: <RiDashboardLine className="mr-3 text-lg" /> },
    { path: "/algorithm-assistant", label: "Algorithm Assistant", icon: <RiLineChartLine className="mr-3 text-lg" /> },
    { path: "/content-creation", label: "Content Creation", icon: <RiMovieLine className="mr-3 text-lg" /> },
    { path: "/scheduler", label: "Scheduler", icon: <RiCalendar2Line className="mr-3 text-lg" /> },
    { path: "/community", label: "Community Manager", icon: <RiTeamLine className="mr-3 text-lg" /> },
    { path: "/monetization", label: "Monetization", icon: <RiMoneyDollarCircleLine className="mr-3 text-lg" /> },
    { path: "/audience-growth", label: "Audience Growth", icon: <RiUserStarLine className="mr-3 text-lg" /> },
    { path: "/ai-agent", label: "AI Agent", icon: <RiRobotLine className="mr-3 text-lg" /> },
  ];

  // Tailwind class for sidebar on mobile
  const mobileClass = isOpen 
    ? "fixed inset-0 z-40 flex md:hidden" 
    : "hidden md:flex md:w-64 flex-shrink-0 flex-col";

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 md:hidden" 
          onClick={toggleSidebar}
        />
      )}
      
      <div className={`${mobileClass} md:w-64 flex-shrink-0 flex-col bg-white border-r border-gray-200`}>
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="font-heading font-bold text-xl flex items-center">
            <span className="text-[#FF0050]">Creator</span><span className="text-[#00F2EA]">AIDE</span>
          </h1>
        </div>
        <div className="flex-grow flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.path;
              const linkClass = isActive
                ? "flex items-center px-4 py-3 text-sm font-medium rounded-md bg-gradient-to-r from-[#FF0050] to-[#00F2EA] text-white"
                : "flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50";
              
              return (
                <Link key={item.path} href={item.path} className={linkClass}>
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center">
                {user ? (
                  <>
                    <img 
                      className="h-10 w-10 rounded-full" 
                      src={user.avatar || "https://via.placeholder.com/40"} 
                      alt="Profile"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium">{user.displayName}</p>
                      <p className="text-xs text-gray-500">{user.handle}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="ml-3">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-3">
                <button className="text-xs text-[#FF0050] flex items-center hover:underline">
                  <RiSettingsLine className="mr-1" /> Account Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
