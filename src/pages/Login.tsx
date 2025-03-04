
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Lock, Store, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Admin credentials (in a real app, this would be handled securely on the backend)
const ADMIN_EMAIL = "admin@bakebook.com";
const ADMIN_PASSWORD = "admin123";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [brandName, setBrandName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const { toast } = useToast();

  // Get the page they were trying to access before being redirected to login
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check if admin credentials were used (hidden feature)
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("user", JSON.stringify({ 
        email, 
        isAdmin: true 
      }));
      
      toast({
        title: "Admin login successful",
        description: "Welcome to the admin dashboard",
      });
      
      navigate("/admin");
      return;
    }

    // User registration/login
    if (isRegister && !brandName) {
      toast({
        title: "Brand name required",
        description: "Please enter your bakery brand name",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would connect to authentication service
    localStorage.setItem("user", JSON.stringify({ 
      email, 
      brandName, 
      isAdmin: false 
    }));
    
    toast({
      title: isRegister ? "Registration successful" : "Login successful",
      description: "Welcome to Bakebook!",
    });
    
    navigate(from);
  };

  const handleForgotPassword = () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email to reset your password",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Reset email sent",
      description: `Password reset instructions have been sent to ${email}`,
    });
  };

  return (
    <div className="page-container min-h-screen flex items-center justify-center py-12">
      <Card className="w-full max-w-md mx-auto animate-scale-in">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Bakebook
            </span>
          </div>
          <CardTitle className="text-2xl font-semibold text-center">
            {isRegister ? "Create an account" : "Welcome back"}
          </CardTitle>
          <CardDescription className="text-center">
            {isRegister 
              ? "Enter your details to create your account" 
              : "Enter your credentials to access your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="baker@example.com" 
                  className="pl-10" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {isRegister && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand Name</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="brandName" 
                      type="text" 
                      placeholder="Your Bakery Name" 
                      className="pl-10" 
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+1 (123) 456-7890" 
                      className="pl-10" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {!isRegister && (
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-10" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              {isRegister ? "Create account" : "Sign in"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-center w-full">
            <p className="text-sm text-muted-foreground">
              {isRegister ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="ml-1 text-primary hover:underline font-medium"
              >
                {isRegister ? "Sign in" : "Create one"}
              </button>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
