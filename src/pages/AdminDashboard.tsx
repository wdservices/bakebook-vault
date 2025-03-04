
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Users, Store, BookOpen, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data - in a real app, this would come from a backend
const mockUsers = [
  { id: 1, email: "baker1@example.com", brandName: "Sweet Delights", joinDate: "2023-05-10", recipeCount: 12 },
  { id: 2, email: "baker2@example.com", brandName: "Flour Power", joinDate: "2023-06-15", recipeCount: 8 },
  { id: 3, email: "baker3@example.com", brandName: "Bake Me Happy", joinDate: "2023-07-22", recipeCount: 5 },
  { id: 4, email: "baker4@example.com", brandName: "Bread Winners", joinDate: "2023-08-05", recipeCount: 15 },
  { id: 5, email: "baker5@example.com", brandName: "Sugar Rush", joinDate: "2023-09-18", recipeCount: 7 },
];

const chartData = [
  { name: 'May', users: 1 },
  { name: 'Jun', users: 2 },
  { name: 'Jul', users: 3 },
  { name: 'Aug', users: 4 },
  { name: 'Sep', users: 5 },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // Check if the logged-in user is an admin
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(user.isAdmin === true);
    
    // If not admin, redirect to home
    if (!user.isAdmin) {
      navigate("/");
    }
  }, [navigate]);
  
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
              <span className="text-2xl font-bold">{mockUsers.length}</span>
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
              <span className="text-2xl font-bold">{mockUsers.length}</span>
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
                {mockUsers.reduce((total, user) => total + user.recipeCount, 0)}
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
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium">User</th>
                        <th className="py-3 px-4 text-left font-medium">Brand Name</th>
                        <th className="py-3 px-4 text-left font-medium">Join Date</th>
                        <th className="py-3 px-4 text-left font-medium">Recipes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map(user => (
                        <tr key={user.id} className="border-b">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{user.brandName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{user.brandName}</td>
                          <td className="py-3 px-4">{user.joinDate}</td>
                          <td className="py-3 px-4">{user.recipeCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="var(--primary)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
