import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ChartDataPoint {
  label: string;
  value: number;
}

interface EngagementMetric {
  label: string;
  value: string | number;
  change: {
    value: string;
    direction: "up" | "down";
  };
}

interface EngagementChartProps {
  chartData: ChartDataPoint[];
  metrics: EngagementMetric[];
}

const EngagementChart = ({ chartData, metrics }: EngagementChartProps) => {
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days">("30days");
  
  // Find max value for scaling
  const maxValue = Math.max(...chartData.map(item => item.value));

  return (
    <Card className="dashboard-card h-full">
      <CardHeader className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <CardTitle className="text-base font-medium">Engagement Metrics</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={timeRange === "7days" ? "default" : "secondary"} 
            size="sm"
            className={`rounded-full text-xs ${timeRange === "7days" ? "bg-[#FF0050] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            onClick={() => setTimeRange("7days")}
          >
            7 Days
          </Button>
          <Button 
            variant={timeRange === "30days" ? "default" : "secondary"} 
            size="sm"
            className={`rounded-full text-xs ${timeRange === "30days" ? "bg-[#FF0050] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            onClick={() => setTimeRange("30days")}
          >
            30 Days
          </Button>
          <Button 
            variant={timeRange === "90days" ? "default" : "secondary"} 
            size="sm"
            className={`rounded-full text-xs ${timeRange === "90days" ? "bg-[#FF0050] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            onClick={() => setTimeRange("90days")}
          >
            90 Days
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Chart Visualization */}
        <div className="h-72 relative">
          {/* Chart Bars */}
          <div className="absolute bottom-0 left-0 w-full h-56 flex items-end justify-between px-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex flex-col items-center" style={{ width: `${100 / chartData.length}%` }}>
                <div 
                  className="chart-bar w-10 bg-gradient-to-t from-[#FF0050] to-[#00F2EA] rounded-t-sm" 
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                ></div>
                <span className="text-xs mt-2 text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
          
          {/* Y-axis labels */}
          <div className="absolute top-0 left-0 h-56 flex flex-col justify-between text-xs text-gray-500">
            <span>100k</span>
            <span>75k</span>
            <span>50k</span>
            <span>25k</span>
            <span>0</span>
          </div>
        </div>
        
        {/* Metrics Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <p className="text-sm font-medium text-gray-500">{metric.label}</p>
              <p className="text-xl font-semibold">{metric.value}</p>
              <p className={`text-xs ${metric.change.direction === "up" ? "text-green-500" : "text-red-500"}`}>
                {metric.change.value} {metric.change.direction === "up" ? "↑" : "↓"}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementChart;
