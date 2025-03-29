import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Search, 
  User, 
  BookOpen,
  ArrowRight,
  ChevronRight,
  Hash
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BLOG_POSTS = [
  {
    id: 1,
    title: "10 TikTok Trends That Will Dominate 2025",
    excerpt: "Discover the upcoming TikTok trends that are set to take over the platform in 2025 and how you can leverage them early.",
    coverImage: "https://placehold.co/600x400/e2e8f0/1e293b?text=Blog+Image",
    author: "Emma Johnson",
    date: "Mar 15, 2025",
    readTime: "5 min read",
    category: "Trends",
    tags: ["tiktok", "trends", "creator-tips"]
  },
  {
    id: 2,
    title: "How to Use AI to 10x Your Content Creation Process",
    excerpt: "Learn how artificial intelligence can help streamline your content creation workflow and generate more engaging TikTok videos.",
    coverImage: "https://placehold.co/600x400/e2e8f0/1e293b?text=Blog+Image",
    author: "James Miller",
    date: "Mar 10, 2025",
    readTime: "8 min read",
    category: "AI Tools",
    tags: ["ai", "content-creation", "productivity"]
  },
  {
    id: 3,
    title: "The Complete Guide to TikTok Monetization in 2025",
    excerpt: "A comprehensive breakdown of all the ways to monetize your TikTok content, from brand deals to the Creator Fund and beyond.",
    coverImage: "https://placehold.co/600x400/e2e8f0/1e293b?text=Blog+Image",
    author: "Sophia Zhang",
    date: "Mar 5, 2025",
    readTime: "12 min read",
    category: "Monetization",
    tags: ["monetization", "creator-economy", "brand-deals"]
  },
  {
    id: 4,
    title: "5 Algorithm Changes That Will Impact Your TikTok Growth",
    excerpt: "TikTok's algorithm is constantly evolving. Here are the latest changes and how they'll affect your content strategy.",
    coverImage: "https://placehold.co/600x400/e2e8f0/1e293b?text=Blog+Image",
    author: "Alex Rivera",
    date: "Feb 28, 2025",
    readTime: "6 min read",
    category: "Algorithm",
    tags: ["algorithm", "growth", "strategy"]
  },
  {
    id: 5,
    title: "How Top Creators Are Using Analytics to Drive Growth",
    excerpt: "Learn how successful TikTok creators are leveraging data and analytics to make better content decisions and grow their audience.",
    coverImage: "https://placehold.co/600x400/e2e8f0/1e293b?text=Blog+Image",
    author: "David Chen",
    date: "Feb 22, 2025",
    readTime: "9 min read",
    category: "Analytics",
    tags: ["analytics", "growth", "case-studies"]
  },
  {
    id: 6,
    title: "The Ultimate Cross-Platform Content Strategy for 2025",
    excerpt: "Maximize your impact by learning how to effectively adapt and repurpose your TikTok content across multiple social platforms.",
    coverImage: "https://placehold.co/600x400/e2e8f0/1e293b?text=Blog+Image",
    author: "Olivia Williams",
    date: "Feb 15, 2025",
    readTime: "10 min read",
    category: "Strategy",
    tags: ["cross-platform", "content-strategy", "multi-channel"]
  }
];

const EBOOKS = [
  {
    id: 1,
    title: "The TikTok Creator Playbook",
    excerpt: "The essential guide to building a successful TikTok presence from scratch.",
    coverImage: "https://placehold.co/300x400/e2e8f0/1e293b?text=eBook+Cover",
    pages: 45
  },
  {
    id: 2,
    title: "Monetization Mastery",
    excerpt: "Turn your TikTok account into a sustainable income stream with these proven strategies.",
    coverImage: "https://placehold.co/300x400/e2e8f0/1e293b?text=eBook+Cover",
    pages: 60
  },
  {
    id: 3,
    title: "Algorithm Secrets Revealed",
    excerpt: "Insider tips on how to work with TikTok's algorithm for maximum reach and engagement.",
    coverImage: "https://placehold.co/300x400/e2e8f0/1e293b?text=eBook+Cover",
    pages: 38
  }
];

const CASE_STUDIES = [
  {
    id: 1,
    title: "How Sarah Grew from 0 to 1M Followers in 6 Months",
    client: "Sarah J., Lifestyle Creator",
    excerpt: "An in-depth look at the strategy and tools Sarah used to rapidly grow her TikTok presence.",
    results: "1M followers, 5 brand deals, $10K monthly revenue"
  },
  {
    id: 2,
    title: "Transforming Gaming Content: Mike's Success Story",
    client: "Mike T., Gaming Creator",
    excerpt: "How a gaming creator optimized his content strategy to break through on TikTok.",
    results: "300% engagement increase, 500K new followers, featured on ForYouPage 35 times"
  },
  {
    id: 3,
    title: "Beauty Brand to Influencer Powerhouse: Elena's Journey",
    client: "Elena K., Beauty Influencer",
    excerpt: "The strategic pivot that helped this beauty creator scale her influence and revenue.",
    results: "2.5M followers, 40% engagement rate, exclusive product line launch"
  }
];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || post.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Creator Resources</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Guides, tips, and strategies to help you grow your TikTok presence and maximize your creator potential.
          </p>
        </header>

        <Tabs defaultValue="blog" className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <TabsList>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="ebooks">eBooks</TabsTrigger>
              <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
            </TabsList>
            
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search resources..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <TabsContent value="blog">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Latest Articles</h2>
              <div className="flex items-center">
                <span className="mr-2 text-sm">Filter by:</span>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="trends">Trends</SelectItem>
                    <SelectItem value="ai tools">AI Tools</SelectItem>
                    <SelectItem value="monetization">Monetization</SelectItem>
                    <SelectItem value="algorithm">Algorithm</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="strategy">Strategy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {filteredPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No articles match your search criteria.</p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ebooks">
            <h2 className="text-2xl font-semibold mb-6">Free eBooks & Guides</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {EBOOKS.map(ebook => (
                <Card key={ebook.id} className="overflow-hidden flex flex-col">
                  <div className="h-52 overflow-hidden">
                    <img 
                      src={ebook.coverImage} 
                      alt={ebook.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{ebook.title}</CardTitle>
                    <CardDescription>{ebook.excerpt}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center mt-auto">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{ebook.pages} pages</span>
                    </div>
                    <Button variant="outline">
                      Download <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="case-studies">
            <h2 className="text-2xl font-semibold mb-6">Creator Success Stories</h2>
            <div className="space-y-6">
              {CASE_STUDIES.map(study => (
                <Card key={study.id}>
                  <CardHeader>
                    <CardTitle>{study.title}</CardTitle>
                    <CardDescription>{study.client}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{study.excerpt}</p>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                      <h4 className="font-semibold mb-2">Results:</h4>
                      <p>{study.results}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="ml-auto">
                      Read Full Case Study <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <section className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Creator Newsletter</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Get the latest TikTok trends, algorithm updates, and creator tips delivered directly to your inbox every week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input placeholder="Your email address" className="sm:flex-1" />
            <Button>Subscribe</Button>
          </div>
        </section>
      </div>
    </div>
  );
}

const BlogPostCard = ({ post }) => (
  <Card className="overflow-hidden flex flex-col h-full">
    <div className="h-48 overflow-hidden">
      <img 
        src={post.coverImage} 
        alt={post.title} 
        className="w-full h-full object-cover" 
      />
    </div>
    <CardHeader>
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="secondary">{post.category}</Badge>
        <span className="text-xs text-muted-foreground">{post.date}</span>
      </div>
      <CardTitle className="text-xl">{post.title}</CardTitle>
    </CardHeader>
    <CardContent className="flex-1">
      <p className="text-muted-foreground mb-4">{post.excerpt}</p>
      <div className="flex flex-wrap gap-2 mt-4">
        {post.tags.map(tag => (
          <Link key={tag} href={`/blog/tag/${tag}`}>
            <Badge variant="outline" className="hover:bg-secondary cursor-pointer">
              <Hash className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          </Link>
        ))}
      </div>
    </CardContent>
    <CardFooter className="border-t pt-4 flex justify-between items-center">
      <div className="flex items-center text-sm text-muted-foreground">
        <User className="h-4 w-4 mr-1" />
        <span>{post.author}</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <Clock className="h-4 w-4 mr-1" />
        <span>{post.readTime}</span>
      </div>
    </CardFooter>
  </Card>
);