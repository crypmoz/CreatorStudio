import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: number;
  username: string;
  avatarUrl: string;
  content: string;
  likes: number;
  timestamp: Date;
}

interface EngagementInsight {
  label: string;
  value: string | number;
  target?: string;
  changePercentage?: number;
}

interface CommentsListProps {
  comments: Comment[];
  insights: EngagementInsight[];
  onViewAllClick: () => void;
  onReplyClick: (commentId: number) => void;
}

const CommentsList = ({ comments, insights, onViewAllClick, onReplyClick }: CommentsListProps) => {
  return (
    <Card className="dashboard-card h-full">
      <CardHeader className="px-6 py-5 border-b border-gray-200">
        <CardTitle className="text-base font-medium">Community Manager</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-500">Recent Comments</h4>
          <button 
            className="text-xs text-[#FF0050] font-medium"
            onClick={onViewAllClick}
          >
            View All
          </button>
        </div>
        
        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex">
              <img 
                className="h-8 w-8 rounded-full" 
                src={comment.avatarUrl || "https://via.placeholder.com/32"} 
                alt={comment.username} 
              />
              <div className="ml-3">
                <div className="flex items-center">
                  <h5 className="text-sm font-medium">{comment.username}</h5>
                  <span className="ml-2 text-xs text-gray-500">
                    {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500 space-x-4">
                  <span className="flex items-center"><i className="ri-heart-line mr-1"></i> {comment.likes}</span>
                  <button 
                    className="text-[#FF0050]"
                    onClick={() => onReplyClick(comment.id)}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-5 pt-5 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-500">Engagement Insights</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">{insight.label}</p>
                <p className="text-lg font-semibold">{insight.value}</p>
                {insight.target && (
                  <p className="text-xs text-amber-500">{insight.target}</p>
                )}
                {insight.changePercentage !== undefined && (
                  <p className={`text-xs ${insight.changePercentage >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {insight.changePercentage >= 0 ? "+" : ""}{insight.changePercentage}% vs last month
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentsList;
