
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Lock, Store, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get the intended destination after login, default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!email || !password) {
        toast({
          title: "Missing fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

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

      if (isRegister) {
        if (!brandName) {
          toast({
            title: "Brand name required",
            description: "Please enter your bakery brand name",
            variant: "destructive",
          });
          return;
        }

        // Register the user with Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) {
          toast({
            title: "Registration failed",
            description: authError.message,
            variant: "destructive",
          });
          return;
        }

        // Check if we have a user before trying to create a profile
        if (authData.user) {
          // Save brand name to profiles table with a valid role value
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: authData.user.id,
                brand_name: brandName,
                phone: phone || null,
                role: 'user', // Using 'user' which should be allowed by the constraint
                name: brandName // Using brand name as the name field as well
              }
            ]);

          if (profileError) {
            console.error("Profile creation error:", profileError);
            toast({
              title: "Profile creation failed",
              description: profileError.message,
              variant: "destructive",
            });
            return;
          }
        }

        toast({
          title: "Registration successful",
          description: "Welcome to Bakebook!",
        });
        
        // Store brand name in localStorage for immediate use
        localStorage.setItem("user", JSON.stringify({ 
          email, 
          brandName,
          isAdmin: false 
        }));
        
        navigate(from);
      } else {
        // Login the user with Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          toast({
            title: "Login failed",
            description: authError.message,
            variant: "destructive",
          });
          return;
        }

        // Fetch user profile to get brand name
        if (authData.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('brand_name')
            .eq('id', authData.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
          }

          // Store user data in localStorage
          localStorage.setItem("user", JSON.stringify({ 
            email, 
            brandName: profileData?.brand_name || "Bakebook",
            isAdmin: false 
          }));
        }
        
        toast({
          title: "Login successful",
          description: "Welcome back to Bakebook!",
        });
        
        navigate(from);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Trigger storage event to update other components
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email to reset your password",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        toast({
          title: "Reset failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Reset email sent",
        description: `Password reset instructions have been sent to ${email}`,
      });
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        title: "Reset error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="page-container min-h-screen flex items-center justify-center py-12 relative">
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
      
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
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : (isRegister ? "Create account" : "Sign in")}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
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
