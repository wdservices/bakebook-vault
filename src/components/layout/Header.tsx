
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Menu, X, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [brandName, setBrandName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Get user data including brand name
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        try {
          // Get profile data from Supabase - using array fetch
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('brand_name')
            .eq('id', session.user.id)
            .limit(1);
        
          if (error) {
            console.error("Error fetching profile:", error);
          } else if (profileData && profileData.length > 0) {
            const fetchedBrandName = profileData[0].brand_name || "Bakebook";
            console.log("Setting brand name from DB:", fetchedBrandName);
            setBrandName(fetchedBrandName);
            
            // Update localStorage for consistency
            const userData = localStorage.getItem("user");
            if (userData) {
              const parsedData = JSON.parse(userData);
              parsedData.brandName = fetchedBrandName;
              localStorage.setItem("user", JSON.stringify(parsedData));
            }
          } else {
            console.log("No profile data found for user:", session.user.id);
          }
        } catch (error) {
          console.error("Failed to fetch profile data:", error);
        }
      } else {
        // Fallback to localStorage
        const userData = localStorage.getItem("user");
        if (userData) {
          try {
            const parsedData = JSON.parse(userData);
            const localBrandName = parsedData.brandName || "Bakebook";
            console.log("Setting brand name from localStorage:", localBrandName);
            setBrandName(localBrandName);
          } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            setBrandName("Bakebook");
          }
        }
      }
    };
    
    fetchUserProfile();
    
    // Listen for storage events to update brand name when localStorage changes
    const handleStorageChange = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          console.log("Storage event: updating brand name to:", parsedData.brandName);
          setBrandName(parsedData.brandName || "Bakebook");
        } catch (error) {
          console.error("Error parsing user data on storage event:", error);
        }
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    // Clean up event listener
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Force refresh when navigating to the page
  useEffect(() => {
    const refreshBrandName = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        try {
          // Get profile data using array fetch
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('brand_name')
            .eq('id', session.user.id)
            .limit(1);
        
          if (!error && profileData && profileData.length > 0) {
            const fetchedBrandName = profileData[0].brand_name || "Bakebook";
            console.log("Refreshing brand name to:", fetchedBrandName);
            setBrandName(fetchedBrandName);
          } else {
            console.log("No profile data found on refresh for user:", session.user.id);
          }
        } catch (error) {
          console.error("Failed to refresh profile data:", error);
        }
      } else {
        const userData = localStorage.getItem("user");
        if (userData) {
          try {
            const parsedData = JSON.parse(userData);
            console.log("Setting brand name from localStorage on refresh:", parsedData.brandName);
            setBrandName(parsedData.brandName || "Bakebook");
          } catch (error) {
            console.error("Error parsing user data on refresh:", error);
          }
        }
      }
    };
    
    refreshBrandName();
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
  const handleLogout = async () => {
    // Clear Supabase session
    await supabase.auth.signOut();
    
    // Clear local storage
    localStorage.removeItem("user");
    
    // Navigate to login page
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
        <Link to="/dashboard" className="flex items-center space-x-2">
          <span className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {brandName || "Bakebook"}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition">
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
              to="/dashboard" 
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
