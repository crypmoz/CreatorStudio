import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RevenueSource {
  name: string;
  percentage: number;
  color: string;
}

interface RevenueSummary {
  total: string;
  change: string;
  direction: "up" | "down" | "neutral";
  projected: string;
}

interface RevenueChartProps {
  revenueSources: RevenueSource[];
  summary: RevenueSummary;
  onViewReportsClick: () => void;
}

const RevenueChart = ({ revenueSources, summary, onViewReportsClick }: RevenueChartProps) => {
  const [timeRange, setTimeRange] = useState("30days");
  
  // Calculate total for the pie chart
  const total = revenueSources.reduce((acc, source) => acc + source.percentage, 0);
  
  // Generate the stroke paths for the pie chart
  const generatePieSegments = () => {
    const segments = [];
    let currentAngle = 0;
    
    for (const source of revenueSources) {
      const angle = (source.percentage / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      // Calculate the SVG arc path
      const startX = 50 + 45 * Math.cos((startAngle - 90) * Math.PI / 180);
      const startY = 50 + 45 * Math.sin((startAngle - 90) * Math.PI / 180);
      const endX = 50 + 45 * Math.cos((endAngle - 90) * Math.PI / 180);
      const endY = 50 + 45 * Math.sin((endAngle - 90) * Math.PI / 180);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      segments.push({
        path: `M 50 50 L ${startX} ${startY} A 45 45 0 ${largeArcFlag} 1 ${endX} ${endY} Z`,
        fill: source.color
      });
      
      currentAngle += angle;
    }
    
    return segments;
  };
  
  const pieSegments = generatePieSegments();

  return (
    <Card className="dashboard-card h-full">
      <CardHeader className="px-6 py-5 border-b border-gray-200">
        <CardTitle className="text-base font-medium">Monetization Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-500">Revenue Streams</h4>
          <Select 
            defaultValue={timeRange}
            onValueChange={(value) => setTimeRange(value)}
          >
            <SelectTrigger className="text-xs border-gray-300 rounded-md w-36 h-8">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Revenue Chart */}
        <div className="h-48 relative mb-6">
          {/* Simple Pie Chart for Revenue Breakdown */}
          <div className="flex items-center">
            <div className="w-32 h-32">
              <svg viewBox="0 0 100 100">
                {pieSegments.map((segment, index) => (
                  <path key={index} d={segment.path} fill={segment.fill} />
                ))}
                <circle cx="50" cy="50" r="25" fill="white" />
              </svg>
            </div>
            <div className="ml-4 space-y-3">
              {revenueSources.map((source, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }}></div>
                  <span className="ml-2 text-xs">{source.name} ({source.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Total Revenue</p>
              <p className="text-lg font-semibold">{summary.total}</p>
              <p className={`text-xs ${summary.direction === "up" ? "text-green-500" : "text-red-500"}`}>
                {summary.change} vs last month
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Projected (This Month)</p>
              <p className="text-lg font-semibold">{summary.projected}</p>
              <p className="text-xs text-gray-500">Based on current growth</p>
            </div>
          </div>
          
          <Button 
            className="w-full py-2 mt-5 bg-[#FF0050] text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors"
            onClick={onViewReportsClick}
          >
            View Detailed Reports
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
