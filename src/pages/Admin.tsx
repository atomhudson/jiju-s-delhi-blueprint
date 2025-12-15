import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";
import { 
  Building2, Plus, LogOut, Loader2, MapPin, Calendar, 
  Mail, Phone, MessageSquare, CheckCircle, Clock, Trash2
} from "lucide-react";

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Project form state
  const [projectForm, setProjectForm] = useState({
    title: "",
    address: "",
    lat: "",
    lon: "",
    status: "ongoing" as "ongoing" | "completed",
    category: "FACADE" as any,
    description: "",
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch projects
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch inquiries
  const { data: inquiries, isLoading: inquiriesLoading } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Add project mutation
  const addProject = useMutation({
    mutationFn: async (project: typeof projectForm) => {
      const { error } = await supabase.from("projects").insert([{
        title: project.title,
        address: project.address,
        latitude: parseFloat(project.lat) || 28.6139,
        longitude: parseFloat(project.lon) || 77.2090,
        status: project.status as "ongoing" | "completed" | "planned",
        description: project.description,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("Project added successfully");
      setProjectForm({
        title: "",
        address: "",
        lat: "",
        lon: "",
        status: "ongoing",
        category: "FACADE",
        description: "",
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add project");
    },
  });

  // Update inquiry status
  const updateInquiryStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "new" | "in_progress" | "resolved" }) => {
      const { error } = await supabase
        .from("inquiries")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
      toast.success("Inquiry updated");
    },
  });

  // Delete project
  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("Project deleted");
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 container mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage projects and inquiries</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="projects">Projects ({projects?.length || 0})</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries ({inquiries?.length || 0})</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            {/* Add Project Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    addProject.mutate(projectForm);
                  }}
                  className="grid md:grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="Project name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      value={projectForm.address}
                      onChange={(e) => setProjectForm({ ...projectForm, address: e.target.value })}
                      placeholder="Location"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Latitude</Label>
                    <Input
                      value={projectForm.lat}
                      onChange={(e) => setProjectForm({ ...projectForm, lat: e.target.value })}
                      placeholder="28.6139"
                      type="number"
                      step="any"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Longitude</Label>
                    <Input
                      value={projectForm.lon}
                      onChange={(e) => setProjectForm({ ...projectForm, lon: e.target.value })}
                      placeholder="77.2090"
                      type="number"
                      step="any"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={projectForm.status}
                      onValueChange={(value: "ongoing" | "completed") => setProjectForm({ ...projectForm, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={projectForm.category}
                      onValueChange={(value) => setProjectForm({ ...projectForm, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["BATHROOM", "BEDROOM", "DINING", "KITCHEN", "FACADE", "LIVING ROOM", "TERRACE"].map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      placeholder="Project description..."
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" disabled={addProject.isPending}>
                      {addProject.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Add Project
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Projects List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectsLoading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : projects?.map((project) => (
                <Card key={project.id} className="group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-foreground">{project.title}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteProject.mutate(project.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      {project.address}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={project.status === "completed" ? "default" : "secondary"}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries" className="space-y-4">
            {inquiriesLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : inquiries?.map((inquiry) => (
              <Card key={inquiry.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-foreground">{inquiry.name}</h3>
                        <Badge variant={inquiry.status === "resolved" ? "default" : "secondary"}>
                          {inquiry.status === "resolved" ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Resolved</>
                          ) : (
                            <><Clock className="w-3 h-3 mr-1" /> Pending</>
                          )}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {inquiry.email}
                        </span>
                        {inquiry.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {inquiry.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(inquiry.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 bg-secondary/50 p-3 rounded-lg">
                        <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <p className="text-sm text-foreground">{inquiry.message}</p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Select
                        value={inquiry.status || "new"}
                        onValueChange={(value) => updateInquiryStatus.mutate({ id: inquiry.id, status: value as "new" | "in_progress" | "resolved" })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
