
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Menu, X, LogOut } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [brandName, setBrandName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Get user data including brand name
  useEffect(() => {
    const handleUserChange = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedData = JSON.parse(userData);
        setBrandName(parsedData.brandName || "Bakebook");
      }
    };
    
    // Initial load
    handleUserChange();
    
    // Listen for storage events to update brand name when localStorage changes
    window.addEventListener("storage", handleUserChange);
    
    // Clean up event listener
    return () => window.removeEventListener("storage", handleUserChange);
  }, []);

  // Force refresh when navigating to the page
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedData = JSON.parse(userData);
      setBrandName(parsedData.brandName || "Bakebook");
    }
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-4 sm:px-6 transition-all duration-300 ${
        isScrolled ? 'glass-bg shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {brandName || "Bakebook"}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-foreground/80 hover:text-foreground transition">
            Recipes
          </Link>
          <Link to="/receipts" className="text-foreground/80 hover:text-foreground transition">
            Receipts
          </Link>
          <Button asChild variant="default" size="sm" className="animate-scale-in">
            <Link to="/add">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Recipe
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-bg shadow-md animate-slide-up">
          <div className="p-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-foreground/80 hover:text-foreground transition p-2"
            >
              Recipes
            </Link>
            <Link 
              to="/receipts" 
              className="text-foreground/80 hover:text-foreground transition p-2"
            >
              Receipts
            </Link>
            <Button asChild variant="default" size="sm">
              <Link to="/add">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Recipe
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
