import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Template {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  type: "trending" | "new" | "normal";
}

interface AiSuggestion {
  content: string;
}

interface ContentTemplatesProps {
  templates: Template[];
  aiSuggestions: AiSuggestion[];
  onNewVideoClick: () => void;
  onTemplateClick: (template: Template) => void;
  onViewMoreClick: () => void;
}

const ContentTemplates = ({ 
  templates, 
  aiSuggestions, 
  onNewVideoClick, 
  onTemplateClick,
  onViewMoreClick 
}: ContentTemplatesProps) => {
  return (
    <Card className="dashboard-card h-full">
      <CardHeader className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <CardTitle className="text-base font-medium">Content Creation Hub</CardTitle>
        <Button 
          className="px-4 py-2 bg-[#FF0050] text-white rounded-md text-sm font-medium flex items-center hover:bg-opacity-90 transition-colors"
          onClick={onNewVideoClick}
        >
          <i className="ri-add-line mr-1"></i> New Video
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <h4 className="text-sm font-medium text-gray-500 mb-3">Trending Templates</h4>
        
        {/* Template Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div 
              key={template.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#FF0050] transition-colors cursor-pointer"
              onClick={() => onTemplateClick(template)}
            >
              <div className="h-32 bg-gray-100 relative">
                <img 
                  src={template.thumbnailUrl || "https://via.placeholder.com/500x300"}
                  className="object-cover w-full h-full" 
                  alt={template.title}
                />
                {template.type !== "normal" && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {template.type === "trending" ? "Trending 🔥" : "New ✨"}
                  </div>
                )}
              </div>
              <div className="p-3">
                <h5 className="font-medium text-sm">{template.title}</h5>
                <p className="text-xs text-gray-500 mt-1">{template.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-5">
          <h4 className="text-sm font-medium text-gray-500 mb-3">AI Content Suggestions</h4>
          <div className="space-y-3">
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <i className="ri-lightbulb-line text-amber-500 mr-2"></i>
                <span className="text-sm">"{suggestion.content}"</span>
              </div>
            ))}
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            onClick={onViewMoreClick}
          >
            View More Ideas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentTemplates;
