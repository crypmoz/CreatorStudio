import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-4 border-t bg-background/60 backdrop-blur-sm">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <div className="mb-2 md:mb-0">
          &copy; {currentYear} CreatorAIDE. All rights reserved.
        </div>
        <div className="flex space-x-6">
          <Link href="/terms-of-use">
            <span className="hover:text-primary transition-colors duration-200 cursor-pointer">Terms of Use</span>
          </Link>
          <Link href="/privacy-policy">
            <span className="hover:text-primary transition-colors duration-200 cursor-pointer">Privacy Policy</span>
          </Link>
          <a 
            href="mailto:support@creatoraide.com" 
            className="hover:text-primary transition-colors duration-200"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}