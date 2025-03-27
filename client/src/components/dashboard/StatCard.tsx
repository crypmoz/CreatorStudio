import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  changeValue: string | number;
  changeDirection: "up" | "down" | "neutral";
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

const StatCard = ({
  title,
  value,
  changeValue,
  changeDirection,
  icon: Icon,
  iconBgColor,
  iconColor,
}: StatCardProps) => {
  const getChangeColor = () => {
    switch (changeDirection) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getChangeIcon = () => {
    switch (changeDirection) {
      case "up":
        return <i className="ri-arrow-up-s-line"></i>;
      case "down":
        return <i className="ri-arrow-down-s-line"></i>;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-card bg-white rounded-lg shadow p-5">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${iconBgColor}`}>
          <Icon className={`text-xl ${iconColor}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center text-xs">
        <span className={`flex items-center ${getChangeColor()}`}>
          {getChangeIcon()} {changeValue}
        </span>
        <span className="text-gray-500 ml-2">vs last month</span>
      </div>
    </div>
  );
};

export default StatCard;
