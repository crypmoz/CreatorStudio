import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiArrowLeftSLine, RiArrowRightSLine, RiTimeLine, RiTiktokFill, RiInstagramLine } from "react-icons/ri";

interface ScheduledPost {
  id: number;
  title: string;
  thumbnailUrl: string;
  platforms: string[];
  scheduledFor: Date;
}

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  hasEvents: boolean;
  isSelected: boolean;
  events: number;
}

interface CalendarScheduleProps {
  month: string;
  year: number;
  days: CalendarDay[];
  scheduledPosts: ScheduledPost[];
  onScheduleClick: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDayClick: (day: CalendarDay) => void;
}

const CalendarSchedule = ({ 
  month, 
  year, 
  days, 
  scheduledPosts, 
  onScheduleClick, 
  onPrevMonth, 
  onNextMonth,
  onDayClick
}: CalendarScheduleProps) => {
  // Format date to string
  const formatDate = (date: Date | string) => {
    // Ensure date is a valid Date object
    const validDate = date instanceof Date ? date : new Date(date);
    // Check if date is valid
    if (isNaN(validDate.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }).format(validDate);
  };

  // Split date and time
  const splitDateTime = (date: Date | string) => {
    try {
      // Ensure date is a valid Date object
      const validDate = date instanceof Date ? date : new Date(date);
      
      // Check if date is valid
      if (isNaN(validDate.getTime())) {
        return { date: 'Invalid date', time: 'Invalid time' };
      }
      
      const fullDate = formatDate(validDate);
      const parts = fullDate.split(", ");
      const timePart = parts[parts.length - 1];
      const datePart = parts.slice(0, -1).join(", ");
      return { date: datePart, time: timePart };
    } catch (error) {
      console.error("Error formatting date:", error);
      return { date: 'Invalid date', time: 'Invalid time' };
    }
  };

  return (
    <Card className="dashboard-card h-full">
      <CardHeader className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <CardTitle className="text-base font-medium">Cross-Platform Scheduler</CardTitle>
        <Button 
          className="px-4 py-2 bg-[#FF0050] text-white rounded-md text-sm font-medium flex items-center hover:bg-opacity-90 transition-colors"
          onClick={onScheduleClick}
        >
          <i className="ri-add-line mr-1"></i> Schedule
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-700">{month} {year}</h4>
          <div className="flex space-x-2">
            <button 
              className="p-1 text-gray-500 hover:text-gray-700"
              onClick={onPrevMonth}
            >
              <RiArrowLeftSLine />
            </button>
            <button 
              className="p-1 text-gray-500 hover:text-gray-700"
              onClick={onNextMonth}
            >
              <RiArrowRightSLine />
            </button>
          </div>
        </div>
        
        {/* Calendar View */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
            <div key={i} className="text-xs font-medium text-gray-500 py-2">{day}</div>
          ))}
          
          {/* Calendar days */}
          {days.map((day, index) => (
            <div 
              key={index} 
              className={`p-1 h-14 text-xs ${!day.isCurrentMonth ? 'bg-gray-100 opacity-50' : ''} ${day.isSelected ? 'bg-[#FF0050] bg-opacity-10 border border-[#FF0050]' : ''} rounded relative cursor-pointer`}
              onClick={() => onDayClick(day)}
            >
              {day.day}
              {day.hasEvents && !day.isSelected && (
                <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                  <div className="w-1 h-1 bg-[#FF0050] rounded-full"></div>
                </div>
              )}
              {day.isSelected && day.events > 0 && (
                <div className="mt-1 text-xxs bg-[#FF0050] text-white rounded px-1 py-0.5 text-center">
                  {day.events} post{day.events !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Upcoming Posts</h4>
          <div className="space-y-3">
            {scheduledPosts.map((post) => {
              const { date, time } = splitDateTime(post.scheduledFor);
              return (
                <div key={post.id} className="flex p-3 bg-gray-50 rounded-lg border-l-4 border-[#FF0050]">
                  <div className="h-12 w-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={post.thumbnailUrl || "https://via.placeholder.com/80"} 
                      className="object-cover w-full h-full" 
                      alt={post.title} 
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <h5 className="text-sm font-medium">{post.title}</h5>
                      <div className="flex items-center space-x-2">
                        {post.platforms.includes("tiktok") && <RiTiktokFill className="text-sm" />}
                        {post.platforms.includes("instagram") && <RiInstagramLine className={`text-sm ${!post.platforms.includes("tiktok") ? "text-gray-400" : ""}`} />}
                      </div>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <RiTimeLine className="mr-1" />
                      <span>{date} • {time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarSchedule;
