
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Users, Store, BookOpen, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recipesCount, setRecipesCount] = useState(0);
  const { toast } = useToast();
  
  // Load user data and recipe counts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if the logged-in user is an admin
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        
        if (!user || user.email !== 'admin@bakebook.com') {
          setIsAdmin(false);
          navigate("/");
          return;
        }
        
        setIsAdmin(true);
        
        // Fetch profiles from Supabase
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
        
        if (profilesError) {
          console.error("Error fetching users:", profilesError);
          throw profilesError;
        }
        
        if (profilesData) {
          console.log("Fetched user data:", profilesData);
          setUsers(profilesData);
          
          // Prepare chart data based on user registration dates
          prepareChartData(profilesData);
        }
        
        // Count recipes from the recipes table
        const { count: recipesCount, error: recipesError } = await supabase
          .from('recipes')
          .select('*', { count: 'exact', head: true });
        
        if (recipesError) {
          console.error("Error counting recipes:", recipesError);
          throw recipesError;
        }
        
        setRecipesCount(recipesCount || 0);
        console.log("Total recipes count:", recipesCount);
        
      } catch (error: any) {
        console.error("Error in admin dashboard:", error);
        toast({
          title: "Error loading dashboard",
          description: error.message || "Failed to load admin dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate, toast]);
  
  // Process user data to generate monthly registration chart
  const prepareChartData = (usersData: any[]) => {
    try {
      // Create a map to count users registered by month
      const monthlyData: Record<string, number> = {};
      
      usersData.forEach(user => {
        if (user.created_at) {
          const date = new Date(user.created_at);
          const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
          
          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = 0;
          }
          
          monthlyData[monthYear]++;
        }
      });
      
      // Convert to array format for the chart
      const chartDataArray = Object.keys(monthlyData).map(month => ({
        name: month,
        users: monthlyData[month]
      }));
      
      // Sort by date (assuming format "MMM YYYY")
      chartDataArray.sort((a, b) => {
        const dateA = new Date(a.name);
        const dateB = new Date(b.name);
        return dateA.getTime() - dateB.getTime();
      });
      
      setChartData(chartDataArray);
    } catch (error) {
      console.error("Error preparing chart data:", error);
    }
  };
  
  // Get total recipes count
  const getTotalRecipes = () => {
    return recipesCount;
  };
  
  if (!isAdmin) {
    return null; // Don't render anything while checking admin status
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <UserCog className="h-4 w-4 mr-1" />
          Admin Access
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{users.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Store className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{users.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">
                {getTotalRecipes()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-6 text-center text-muted-foreground">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">No users registered yet</div>
              ) : (
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left font-medium">User</th>
                          <th className="py-3 px-4 text-left font-medium">Brand Name</th>
                          <th className="py-3 px-4 text-left font-medium">Join Date</th>
                          <th className="py-3 px-4 text-left font-medium">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user.id} className="border-b">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{user.brand_name ? user.brand_name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name || 'Unknown'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{user.brand_name || 'No Brand'}</td>
                            <td className="py-3 px-4">
                              {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline">{user.role}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly new user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {chartData.length === 0 ? (
                  <div className="py-6 text-center text-muted-foreground h-full flex items-center justify-center">
                    No registration data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="var(--primary)" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
