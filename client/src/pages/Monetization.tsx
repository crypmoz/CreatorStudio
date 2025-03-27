import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RiMoneyDollarCircleLine, RiShoppingBag3Line, RiHandCoinLine, RiStore3Line, RiBarChartBoxLine } from "react-icons/ri";

const Monetization = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30days");
  
  // Fetch revenue data
  const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ["/api/users/1/revenue"],
  });
  
  // Revenue sources data
  const revenueSources = [
    { name: "Creator Fund", percentage: 45, color: "#FF0050" },
    { name: "Brand Deals", percentage: 30, color: "#00F2EA" },
    { name: "Affiliate Links", percentage: 25, color: "#EE1D52" },
  ];
  
  // Revenue summary
  const revenueSummary = {
    total: "$3,240.85",
    change: "+22%",
    direction: "up" as const,
    projected: "$4,100.00",
  };
  
  // Brand deals
  const brandDeals = [
    {
      brand: "FashionTrends",
      status: "active",
      amount: "$1,200",
      dueDate: new Date(2023, 6, 15),
      logoColor: "#4f46e5"
    },
    {
      brand: "TechGadgets",
      status: "pending",
      amount: "$800",
      dueDate: new Date(2023, 6, 22),
      logoColor: "#0891b2"
    },
    {
      brand: "FitnessPro",
      status: "completed",
      amount: "$950",
      dueDate: new Date(2023, 5, 30),
      logoColor: "#16a34a"
    }
  ];
  
  // Monthly revenue data for chart
  const monthlyRevenue = [
    { month: "Jan", amount: 1200 },
    { month: "Feb", amount: 1450 },
    { month: "Mar", amount: 1320 },
    { month: "Apr", amount: 1850 },
    { month: "May", amount: 2100 },
    { month: "Jun", amount: 2400 },
    { month: "Jul", amount: 3240 }
  ];
  
  // Affiliate links
  const affiliateLinks = [
    {
      product: "Premium Tripod",
      clicks: 845,
      conversions: 52,
      revenue: "$780",
      conversionRate: 6.2
    },
    {
      product: "Lighting Kit",
      clicks: 620,
      conversions: 38,
      revenue: "$570",
      conversionRate: 6.1
    },
    {
      product: "Video Editing App",
      clicks: 1250,
      conversions: 87,
      revenue: "$435",
      conversionRate: 7.0
    }
  ];
  
  // Monetization goals
  const monetizationGoals = [
    {
      title: "Monthly Revenue",
      target: "$5,000",
      current: "$3,240",
      progress: 65,
      color: "#FF0050"
    },
    {
      title: "Brand Partnerships",
      target: "5",
      current: "3",
      progress: 60,
      color: "#00F2EA"
    },
    {
      title: "Affiliate Conversions",
      target: "200",
      current: "177",
      progress: 88,
      color: "#EE1D52"
    }
  ];
  
  // Generate the pie chart for revenue breakdown
  const generatePieSegments = () => {
    const segments = [];
    let currentAngle = 0;
    
    for (const source of revenueSources) {
      const angle = (source.percentage / 100) * 360;
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

  // Find max revenue amount for scaling the chart
  const maxAmount = Math.max(...monthlyRevenue.map(item => item.amount));
  
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Monetization Dashboard</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="creator-fund">Creator Fund</TabsTrigger>
          <TabsTrigger value="brand-deals">Brand Deals</TabsTrigger>
          <TabsTrigger value="affiliate">Affiliate Program</TabsTrigger>
          <TabsTrigger value="goals">Goals & Planning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-semibold">{isLoadingRevenue ? "--" : revenueSummary.total}</p>
                    <p className="text-xs text-green-500">+22% vs last month</p>
                  </div>
                  <div className="p-3 rounded-full bg-[#FF0050] bg-opacity-10">
                    <RiMoneyDollarCircleLine className="text-xl text-[#FF0050]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Brand Deals</p>
                    <p className="text-2xl font-semibold">$2,950</p>
                    <p className="text-xs text-green-500">+15% vs last month</p>
                  </div>
                  <div className="p-3 rounded-full bg-[#00F2EA] bg-opacity-10">
                    <RiShoppingBag3Line className="text-xl text-[#00F2EA]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Creator Fund</p>
                    <p className="text-2xl font-semibold">$1,458</p>
                    <p className="text-xs text-green-500">+8% vs last month</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <RiHandCoinLine className="text-xl text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Affiliate Revenue</p>
                    <p className="text-2xl font-semibold">$810</p>
                    <p className="text-xs text-amber-500">+5% vs last month</p>
                  </div>
                  <div className="p-3 rounded-full bg-amber-100">
                    <RiStore3Line className="text-xl text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <CardTitle className="text-base font-medium">Revenue Breakdown</CardTitle>
                <Select 
                  defaultValue={timeRange}
                  onValueChange={setTimeRange}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-40 h-40">
                    <svg viewBox="0 0 100 100">
                      {pieSegments.map((segment, index) => (
                        <path key={index} d={segment.path} fill={segment.fill} />
                      ))}
                      <circle cx="50" cy="50" r="25" fill="white" />
                    </svg>
                  </div>
                  <div className="ml-6 space-y-3">
                    {revenueSources.map((source, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }}></div>
                        <span className="ml-2 text-sm">{source.name} ({source.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Projected (This Month)</p>
                      <p className="text-lg font-semibold">$4,100.00</p>
                      <p className="text-xs text-gray-500">Based on current growth</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Year-to-Date</p>
                      <p className="text-lg font-semibold">$18,725.50</p>
                      <p className="text-xs text-green-500">+32% vs last year</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="px-6 py-5 border-b border-gray-200">
                <CardTitle className="text-base font-medium">Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80 relative">
                  <div className="absolute bottom-0 left-0 w-full h-64 flex items-end justify-between px-2">
                    {monthlyRevenue.map((item, index) => (
                      <div key={index} className="flex flex-col items-center" style={{ width: `${100 / monthlyRevenue.length}%` }}>
                        <div 
                          className="w-16 bg-gradient-to-t from-[#FF0050] to-[#00F2EA] rounded-t-sm" 
                          style={{ height: `${(item.amount / maxAmount) * 100}%` }}
                        ></div>
                        <span className="text-xs mt-2 text-gray-500">{item.month}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="absolute top-0 left-0 h-64 flex flex-col justify-between text-xs text-gray-500">
                    <span>$5k</span>
                    <span>$4k</span>
                    <span>$3k</span>
                    <span>$2k</span>
                    <span>$1k</span>
                    <span>$0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="px-6 py-5 border-b border-gray-200">
              <CardTitle className="text-base font-medium">Recent Brand Deals</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Brand</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Due Date</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {brandDeals.map((deal, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: deal.logoColor }}>
                              <span className="text-white text-xs font-bold">{deal.brand.charAt(0)}</span>
                            </div>
                            <span className="ml-2 font-medium">{deal.brand}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            deal.status === 'active' ? 'bg-green-100 text-green-800' :
                            deal.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium">{deal.amount}</td>
                        <td className="px-6 py-4 text-gray-500">{format(deal.dueDate, 'MMM d, yyyy')}</td>
                        <td className="px-6 py-4">
                          <Button variant="outline" size="sm">View Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button className="bg-[#FF0050] hover:bg-opacity-90">Find New Brand Deals</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="creator-fund">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Creator Fund Balance</p>
                    <p className="text-2xl font-semibold">$1,458</p>
                    <p className="text-xs text-green-500">+8% vs last month</p>
                  </div>
                  <div className="p-3 rounded-full bg-[#FF0050] bg-opacity-10">
                    <RiHandCoinLine className="text-xl text-[#FF0050]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Average Daily Earnings</p>
                    <p className="text-2xl font-semibold">$47.03</p>
                    <p className="text-xs text-green-500">+12% vs last week</p>
                  </div>
                  <div className="p-3 rounded-full bg-[#00F2EA] bg-opacity-10">
                    <RiBarChartBoxLine className="text-xl text-[#00F2EA]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Next Payout</p>
                    <p className="text-2xl font-semibold">$780</p>
                    <p className="text-xs text-gray-500">Estimated for Jul 15</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <RiMoneyDollarCircleLine className="text-xl text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader className="px-6 py-5 border-b border-gray-200">
              <CardTitle className="text-base font-medium">Creator Fund Performance</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="p-6 bg-gray-100 rounded-full inline-flex items-center justify-center mb-4">
                    <i className="ri-line-chart-line text-3xl text-gray-400"></i>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Daily Earnings Chart</h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    This chart would display your daily Creator Fund earnings over time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="px-6 py-5 border-b border-gray-200">
                <CardTitle className="text-base font-medium">Earnings Factors</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Video Views</span>
                      <span className="text-sm text-gray-500">70% impact</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Watch Time</span>
                      <span className="text-sm text-gray-500">85% impact</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Engagement Rate</span>
                      <span className="text-sm text-gray-500">65% impact</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Follower Growth</span>
                      <span className="text-sm text-gray-500">40% impact</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Optimization Tip</h3>
                  <p className="text-xs text-blue-600">
                    Focus on increasing your average watch time. Videos with 60+ second watch times earn 2.3x more from the Creator Fund.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="px-6 py-5 border-b border-gray-200">
                <CardTitle className="text-base font-medium">Payout History</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">June 2023</p>
                      <p className="text-xs text-gray-500">Processed on Jun 15</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">$685.42</p>
                      <p className="text-xs text-green-500">+12% vs May</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">May 2023</p>
                      <p className="text-xs text-gray-500">Processed on May 15</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">$612.18</p>
                      <p className="text-xs text-green-500">+8% vs Apr</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">April 2023</p>
                      <p className="text-xs text-gray-500">Processed on Apr 15</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">$567.93</p>
                      <p className="text-xs text-amber-500">+3% vs Mar</p>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  View Full History
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="brand-deals">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Deals</p>
                    <p className="text-2xl font-semibold">3</p>
                    <p className="text-xs text-green-500">+1 vs last month</p>
                  </div>
                  <div className="p-3 rounded-full bg-[#FF0050] bg-opacity-10">
                    <RiShoppingBag3Line className="text-xl text-[#FF0050]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Deal Revenue</p>
                    <p className="text-2xl font-semibold">$2,950</p>
                    <p className="text-xs text-green-500">+15% vs last month</p>
                  </div>
                  <div className="p-3 rounded-full bg-[#00F2EA] bg-opacity-10">
                    <RiMoneyDollarCircleLine className="text-xl text-[#00F2EA]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Avg. Deal Value</p>
                    <p className="text-2xl font-semibold">$983</p>
                    <p className="text-xs text-green-500">+5% vs last month</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <RiBarChartBoxLine className="text-xl text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader className="px-6 py-5 border-b border-gray-200">
              <CardTitle className="text-base font-medium">Active & Upcoming Brand Deals</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      <th className="px-6 py-3">Brand</th>
                      <th className="px-6 py-3">Campaign</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Timeline</th>
                      <th className="px-6 py-3">Value</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#4f46e5]">
                            <span className="text-white text-xs font-bold">F</span>
                          </div>
                          <span className="ml-2 font-medium">FashionTrends</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">Summer Collection</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">Jul 1 - Jul 15, 2023</td>
                      <td className="px-6 py-4 font-medium">$1,200</td>
                      <td className="px-6 py-4">
                        <Button variant="outline" size="sm">Manage</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#0891b2]">
                            <span className="text-white text-xs font-bold">T</span>
                          </div>
                          <span className="ml-2 font-medium">TechGadgets</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">New Smartphone Review</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">Pending</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">Jul 22 - Aug 5, 2023</td>
                      <td className="px-6 py-4 font-medium">$800</td>
                      <td className="px-6 py-4">
                        <Button variant="outline" size="sm">Review</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#16a34a]">
                            <span className="text-white text-xs font-bold">F</span>
                          </div>
                          <span className="ml-2 font-medium">FitnessPro</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">Workout Challenge</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Completed</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">Jun 1 - Jun 30, 2023</td>
                      <td className="px-6 py-4 font-medium">$950</td>
                      <td className="px-6 py-4">
                        <Button variant="outline" size="sm">View Report</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Brand Opportunities</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-pink-100">
                            <span className="text-pink-600 text-sm font-bold">B</span>
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium">BeautyGlow</h3>
                            <p className="text-xs text-gray-500">Skincare line promotion</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">$800 - $1,200</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        Looking for content creators to showcase their new summer skincare line with authentic reviews and tutorials.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">beauty</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">skincare</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">tutorial</span>
                        </div>
                        <Button size="sm" className="bg-[#FF0050] hover:bg-opacity-90">Apply</Button>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100">
                            <span className="text-blue-600 text-sm font-bold">T</span>
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium">TravelEscape</h3>
                            <p className="text-xs text-gray-500">Travel accessories showcase</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">$1,500 - $2,000</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        Seeking creators to highlight premium travel accessories in creative ways. Product will be provided.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">travel</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">lifestyle</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">product</span>
                        </div>
                        <Button size="sm" className="bg-[#FF0050] hover:bg-opacity-90">Apply</Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    Browse All Opportunities
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Brand Deal Tips</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-800 mb-2">Optimize Your Media Kit</h3>
                      <p className="text-xs text-blue-600">
                        Keep your media kit updated with your latest statistics and best performing content examples to increase your chances of landing deals.
                      </p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-green-800 mb-2">Negotiation Strategies</h3>
                      <p className="text-xs text-green-600">
                        Don't just accept the first offer. Creators who negotiate can increase their deal value by 15-30% on average.
                      </p>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-amber-800 mb-2">Content Disclosure</h3>
                      <p className="text-xs text-amber-600">
                        Always properly disclose sponsored content with #ad or #sponsored to maintain trust with your audience and comply with regulations.
                      </p>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-6 bg-[#00F2EA] hover:bg-opacity-90">
                    Create Media Kit
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="affiliate">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Affiliate Revenue</p>
                    <p className="text-2xl font-semibold">$810</p>
                    <p className="text-xs text-green-500">+5% vs last month</p>
                  </div>
                  <div className="p-3 rounded-full bg-[#FF0050] bg-opacity-10">
                    <RiStore3Line className="text-xl text-[#FF0050]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Click-Through Rate</p>
                    <p className="text-2xl font-semibold">3.2%</p>
                    <p className="text-xs text-green-500">+0.3% vs last month</p>
                  </div>
                  <div className="p-3 rounded-full bg-[#00F2EA] bg-opacity-10">
                    <i className="ri-cursor-line text-xl text-[#00F2EA]"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Conversion Rate</p>
                    <p className="text-2xl font-semibold">6.5%</p>
                    <p className="text-xs text-green-500">+0.5% vs last month</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <i className="ri-shopping-cart-line text-xl text-purple-600"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader className="px-6 py-5 border-b border-gray-200">
              <CardTitle className="text-base font-medium">Top Performing Links</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3">Clicks</th>
                      <th className="px-6 py-3">Conversions</th>
                      <th className="px-6 py-3">Conversion Rate</th>
                      <th className="px-6 py-3">Revenue</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {affiliateLinks.map((link, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 font-medium">{link.product}</td>
                        <td className="px-6 py-4">{link.clicks.toLocaleString()}</td>
                        <td className="px-6 py-4">{link.conversions}</td>
                        <td className="px-6 py-4">{link.conversionRate}%</td>
                        <td className="px-6 py-4 font-medium">{link.revenue}</td>
                        <td className="px-6 py-4">
                          <Button variant="outline" size="sm">Copy Link</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Recommended Affiliate Products</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="h-32 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">Product Image</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1">Professional Ring Light Kit</h3>
                        <div className="flex items-center mb-2">
                          <span className="text-sm">$89.99</span>
                          <span className="text-xs text-green-500 ml-2">8% commission</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                          18" LED ring light with tripod stand, perfect for TikTok content creators.
                        </p>
                        <Button size="sm" className="w-full bg-[#FF0050] hover:bg-opacity-90">
                          Generate Link
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="h-32 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">Product Image</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1">Wireless Lapel Microphone</h3>
                        <div className="flex items-center mb-2">
                          <span className="text-sm">$59.99</span>
                          <span className="text-xs text-green-500 ml-2">10% commission</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                          High-quality wireless mic for clear audio in your videos.
                        </p>
                        <Button size="sm" className="w-full bg-[#FF0050] hover:bg-opacity-90">
                          Generate Link
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="h-32 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">Product Image</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1">Premium Video Editing Software</h3>
                        <div className="flex items-center mb-2">
                          <span className="text-sm">$19.99/mo</span>
                          <span className="text-xs text-green-500 ml-2">15% commission</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                          Professional editing software with TikTok-optimized templates.
                        </p>
                        <Button size="sm" className="w-full bg-[#FF0050] hover:bg-opacity-90">
                          Generate Link
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="h-32 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">Product Image</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1">Portable Phone Stabilizer</h3>
                        <div className="flex items-center mb-2">
                          <span className="text-sm">$79.99</span>
                          <span className="text-xs text-green-500 ml-2">9% commission</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                          3-axis gimbal for smooth, professional-looking videos.
                        </p>
                        <Button size="sm" className="w-full bg-[#FF0050] hover:bg-opacity-90">
                          Generate Link
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    Browse All Products
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Affiliate Link Generator</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Product URL</label>
                      <Input placeholder="Paste product URL here" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Name (Optional)</label>
                      <Input placeholder="e.g., summer_haul" />
                    </div>
                    
                    <Button className="w-full bg-[#FF0050] hover:bg-opacity-90">
                      Generate Affiliate Link
                    </Button>
                    
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <label className="block text-sm font-medium mb-1">Your Tracking Link</label>
                      <div className="flex">
                        <Input value="https://aff.example/ref=yourid123" readOnly className="rounded-r-none" />
                        <Button variant="secondary" className="rounded-l-none">
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <h3 className="text-sm font-medium text-amber-800 mb-2">Affiliate Tip</h3>
                    <p className="text-xs text-amber-600">
                      When promoting affiliate products, focus on ones you genuinely use. Authentic recommendations convert 3x better than general promotions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="goals">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {monetizationGoals.map((goal, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium mb-2">{goal.title}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-2xl font-semibold">{goal.current}</p>
                    <p className="text-sm text-gray-500">Target: {goal.target}</p>
                  </div>
                  <Progress value={goal.progress} className="h-2" style={{ backgroundColor: `${goal.color}20` }}>
                    <div
                      className="h-full transition-all"
                      style={{ backgroundColor: goal.color }}
                    />
                  </Progress>
                  <p className="text-xs mt-2 text-right">{goal.progress}% complete</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="px-6 py-5 border-b border-gray-200">
                <CardTitle className="text-base font-medium">Revenue Projection</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <div className="p-6 bg-gray-100 rounded-full inline-flex items-center justify-center mb-4">
                      <i className="ri-line-chart-line text-3xl text-gray-400"></i>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Projected Revenue Chart</h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                      This chart would display your projected revenue growth over the next 12 months.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Projected Monthly</p>
                    <p className="text-xl font-semibold">$5,500</p>
                    <p className="text-xs text-green-500">by Dec 2023</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Projected Annual</p>
                    <p className="text-xl font-semibold">$58,000</p>
                    <p className="text-xs text-green-500">for 2023</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="px-6 py-5 border-b border-gray-200">
                <CardTitle className="text-base font-medium">Monetization Strategy</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <i className="ri-funds-line text-lg text-blue-600"></i>
                      </div>
                      <h3 className="ml-2 font-medium">Diversify Revenue Streams</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      Increase your brand deals and affiliate marketing to reduce reliance on Creator Fund.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Current mix: 45/30/25</span>
                      <span className="text-xs text-blue-600">Target: 30/40/30</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <i className="ri-shopping-bag-3-line text-lg text-green-600"></i>
                      </div>
                      <h3 className="ml-2 font-medium">Increase Brand Deals</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      Target 2 new brand partnerships per month with minimum $800 value each.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Current: 1/month</span>
                      <span className="text-xs text-green-600">Target: 3/month</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-amber-100 rounded-full">
                        <i className="ri-store-3-line text-lg text-amber-600"></i>
                      </div>
                      <h3 className="ml-2 font-medium">Optimize Affiliate Links</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      Improve conversion rate by testing different products and placement strategies.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Current: 6.5% conversion</span>
                      <span className="text-xs text-amber-600">Target: 8% conversion</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-6 bg-[#FF0050] hover:bg-opacity-90">
                  Create Custom Strategy
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Monetization;
