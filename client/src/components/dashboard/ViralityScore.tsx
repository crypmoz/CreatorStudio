import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OptimizationItem {
  type: "success" | "warning" | "error";
  message: string;
}

interface ViralityScoreProps {
  score: number;
  optimizations: OptimizationItem[];
  onAnalysisClick: () => void;
}

const ViralityScore = ({ score, optimizations, onAnalysisClick }: ViralityScoreProps) => {
  // Calculate the stroke dash offset based on the score (0-100)
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  // Icon for each type of optimization suggestion
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <i className="ri-checkbox-circle-line text-[#00F2EA] mr-2"></i>;
      case "warning":
        return <i className="ri-error-warning-line text-[#EE1D52] mr-2"></i>;
      case "error":
        return <i className="ri-close-circle-line text-[#FF0050] mr-2"></i>;
      default:
        return null;
    }
  };

  return (
    <Card className="dashboard-card overflow-hidden h-full">
      <CardHeader className="px-6 py-5 border-b border-gray-200">
        <CardTitle className="text-base font-medium">Latest Video Performance</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-center">
          <div className="relative w-40 h-40">
            {/* Circular Progress Chart */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Background circle */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="#EEE" strokeWidth="8"/>
              {/* Progress circle */}
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#FF0050" 
                strokeWidth="8" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset} 
                strokeLinecap="round" 
                transform="rotate(-90 50 50)"
              />
              <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="24" fontWeight="bold" fill="#333">{score}</text>
              <text x="50" y="65" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#777">Virality Score</text>
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Optimization Suggestions:</h4>
          <ul className="space-y-2 text-sm">
            {optimizations.map((item, index) => (
              <li key={index} className="flex items-center">
                {getIcon(item.type)}
                <span>{item.message}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-5">
          <Button 
            className="w-full py-2 bg-[#FF0050] text-white hover:bg-opacity-90 transition-colors"
            onClick={onAnalysisClick}
          >
            Get Detailed Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ViralityScore;
