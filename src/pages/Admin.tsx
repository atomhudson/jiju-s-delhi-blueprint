import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Plus, LogOut, Loader2, MapPin, Calendar,
  Mail, Phone, MessageSquare, CheckCircle, Clock, Trash2,
  Users, Award, Target, Palette, Package, Edit, Save, X,
  Home, Sparkles, Layers, Settings, LayoutDashboard, ChevronRight,
  Image, Shield, Hammer, Heart, Eye, Building, TreePine, TrendingUp, BarChart3
} from "lucide-react";
import { LocationAutocomplete } from "@/components/ui/LocationAutocomplete";
import { ColorSwatchPicker, brandColorPresets, accentColorPresets, gradientPresets } from "@/components/ui/ColorPicker";
import { MultiImageUpload } from "@/components/ui/MultiImageUpload";

// Sidebar menu items
const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "projects", label: "Projects", icon: Building2 },
  { id: "services", label: "Services", icon: Home },
  { id: "team", label: "Team Members", icon: Users },
  { id: "milestones", label: "Milestones", icon: Calendar },
  { id: "achievements", label: "Achievements", icon: Award },
  { id: "values", label: "Core Values", icon: Shield },
  { id: "brands", label: "Brand Partners", icon: Package },
  { id: "categories", label: "Interior Categories", icon: Palette },
  { id: "inquiries", label: "Inquiries", icon: MessageSquare },
];

const iconOptions = ["Shield", "Hammer", "Heart", "Eye", "Award", "Calendar", "Building", "Users", "Target", "Sparkles", "CheckCircle", "Home", "Bath", "Bed", "Coffee", "ChefHat", "Armchair", "TreePine"];

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Form states
  const [projectForm, setProjectForm] = useState({ title: "", address: "", lat: "", lon: "", status: "ongoing" as "ongoing" | "completed", category: "FACADE", description: "", images: [] as string[] });
  const [serviceForm, setServiceForm] = useState({ title: "", description: "", image_url: "", display_order: 0 });
  const [teamForm, setTeamForm] = useState({ name: "", designation: "", image_url: "", description: "", quote: "", experience: "", is_founder: false, linkedin_url: "", email: "", display_order: 0 });
  const [milestoneForm, setMilestoneForm] = useState({ year: "", title: "", description: "", highlight: "", display_order: 0 });
  const [achievementForm, setAchievementForm] = useState({ value: "", label: "", icon: "Award", description: "", display_order: 0 });
  const [coreValueForm, setCoreValueForm] = useState({ icon: "Shield", title: "", description: "", display_order: 0 });
  const [brandForm, setBrandForm] = useState({ name: "", tagline: "", color_gradient: "from-blue-500/20 to-blue-600/20", logo_url: "", display_order: 0 });
  const [categoryForm, setCategoryForm] = useState({ name: "", icon: "Home", gradient: "from-sky-400/20 via-blue-500/10 to-indigo-500/20", accent: "bg-sky-500", display_order: 0 });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) navigate("/admin-portal-login");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) navigate("/admin-portal-login");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch all data
  const { data: projects } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_images (id, storage_path, caption)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
  const { data: inquiries } = useQuery({ queryKey: ["admin-inquiries"], queryFn: async () => { const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false }); if (error) throw error; return data; }, enabled: !!user });
  const { data: services } = useQuery({ queryKey: ["admin-services"], queryFn: async () => { const { data, error } = await supabase.from("services").select("*").order("display_order"); if (error) throw error; return data; }, enabled: !!user });
  const { data: teamMembers } = useQuery({ queryKey: ["admin-team"], queryFn: async () => { const { data, error } = await supabase.from("team_members").select("*").order("display_order"); if (error) throw error; return data; }, enabled: !!user });
  const { data: milestones } = useQuery({ queryKey: ["admin-milestones"], queryFn: async () => { const { data, error } = await supabase.from("milestones").select("*").order("display_order"); if (error) throw error; return data; }, enabled: !!user });
  const { data: achievements } = useQuery({ queryKey: ["admin-achievements"], queryFn: async () => { const { data, error } = await supabase.from("achievements").select("*").order("display_order"); if (error) throw error; return data; }, enabled: !!user });
  const { data: coreValues } = useQuery({ queryKey: ["admin-core-values"], queryFn: async () => { const { data, error } = await supabase.from("core_values").select("*").order("display_order"); if (error) throw error; return data; }, enabled: !!user });
  const { data: brandPartners } = useQuery({ queryKey: ["admin-brands"], queryFn: async () => { const { data, error } = await supabase.from("brand_partners").select("*").order("display_order"); if (error) throw error; return data; }, enabled: !!user });
  const { data: interiorCategories } = useQuery({ queryKey: ["admin-categories"], queryFn: async () => { const { data, error } = await supabase.from("interior_categories").select("*").order("display_order"); if (error) throw error; return data; }, enabled: !!user });

  // Analytics queries
  const { data: pageViews } = useQuery({
    queryKey: ["admin-page-views"],
    queryFn: async () => {
      const { count } = await supabase.from("page_views").select("*", { count: "exact", head: true });
      return count || 0;
    },
    enabled: !!user
  });

  const { data: todayViews } = useQuery({
    queryKey: ["admin-today-views"],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { count } = await supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", today);
      return count || 0;
    },
    enabled: !!user
  });

  const { data: projectViews } = useQuery({
    queryKey: ["admin-project-views"],
    queryFn: async () => {
      const { data, error } = await supabase.from("project_views").select("project_id");
      if (error) throw error;
      // Count views per project
      const counts: Record<string, number> = {};
      data?.forEach(v => { if (v.project_id) counts[v.project_id] = (counts[v.project_id] || 0) + 1; });
      return counts;
    },
    enabled: !!user
  });

  const { data: projectLikes } = useQuery({
    queryKey: ["admin-project-likes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("project_likes").select("project_id");
      if (error) throw error;
      // Count likes per project
      const counts: Record<string, number> = {};
      data?.forEach(l => { if (l.project_id) counts[l.project_id] = (counts[l.project_id] || 0) + 1; });
      return counts;
    },
    enabled: !!user
  });

  const { data: totalLikes } = useQuery({
    queryKey: ["admin-total-likes"],
    queryFn: async () => {
      const { count } = await supabase.from("project_likes").select("*", { count: "exact", head: true });
      return count || 0;
    },
    enabled: !!user
  });

  // Mutations
  const addProject = useMutation({
    mutationFn: async (project: typeof projectForm) => {
      // Insert the project first
      const { data: projectData, error } = await supabase
        .from("projects")
        .insert([{
          title: project.title,
          address: project.address,
          latitude: parseFloat(project.lat) || 28.6139,
          longitude: parseFloat(project.lon) || 77.2090,
          status: project.status,
          category: project.category,
          description: project.description
        }])
        .select()
        .single();

      if (error) throw error;

      // If there are images, insert them into project_images table
      if (project.images.length > 0 && projectData) {
        // Convert category to lowercase enum value (e.g., "LIVING ROOM" -> "living_room")
        const categoryEnum = project.category.toLowerCase().replace(/\s+/g, '_');

        const imageInserts = project.images.map((url) => ({
          project_id: projectData.id,
          storage_path: url,
          category: categoryEnum as any
        }));

        const { error: imageError } = await supabase
          .from("project_images")
          .insert(imageInserts);

        if (imageError) {
          console.error("Failed to save some images:", imageError);
        }
      }

      return projectData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("Project added successfully!");
      setProjectForm({ title: "", address: "", lat: "", lon: "", status: "ongoing", category: "FACADE", description: "", images: [] });
    },
    onError: (e: any) => toast.error(e.message)
  });

  const deleteProject = useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("projects").delete().eq("id", id); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-projects"] }); toast.success("Deleted"); } });
  const addService = useMutation({ mutationFn: async (s: typeof serviceForm) => { const { error } = await supabase.from("services").insert([s]); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-services"] }); toast.success("Service added"); setServiceForm({ title: "", description: "", image_url: "", display_order: 0 }); }, onError: (e: any) => toast.error(e.message) });
  const deleteService = useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("services").delete().eq("id", id); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-services"] }); toast.success("Deleted"); } });
  const addTeamMember = useMutation({ mutationFn: async (m: typeof teamForm) => { const { error } = await supabase.from("team_members").insert([m]); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-team"] }); toast.success("Team member added"); setTeamForm({ name: "", designation: "", image_url: "", description: "", quote: "", experience: "", is_founder: false, linkedin_url: "", email: "", display_order: 0 }); }, onError: (e: any) => toast.error(e.message) });
  const deleteTeamMember = useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("team_members").delete().eq("id", id); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-team"] }); toast.success("Deleted"); } });
  const addMilestone = useMutation({ mutationFn: async (m: typeof milestoneForm) => { const { error } = await supabase.from("milestones").insert([m]); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-milestones"] }); toast.success("Milestone added"); setMilestoneForm({ year: "", title: "", description: "", highlight: "", display_order: 0 }); }, onError: (e: any) => toast.error(e.message) });
  const deleteMilestone = useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("milestones").delete().eq("id", id); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-milestones"] }); toast.success("Deleted"); } });
  const addAchievement = useMutation({ mutationFn: async (a: typeof achievementForm) => { const { error } = await supabase.from("achievements").insert([a]); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-achievements"] }); toast.success("Achievement added"); setAchievementForm({ value: "", label: "", icon: "Award", description: "", display_order: 0 }); }, onError: (e: any) => toast.error(e.message) });
  const deleteAchievement = useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("achievements").delete().eq("id", id); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-achievements"] }); toast.success("Deleted"); } });
  const addCoreValue = useMutation({ mutationFn: async (v: typeof coreValueForm) => { const { error } = await supabase.from("core_values").insert([v]); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-core-values"] }); toast.success("Core value added"); setCoreValueForm({ icon: "Shield", title: "", description: "", display_order: 0 }); }, onError: (e: any) => toast.error(e.message) });
  const deleteCoreValue = useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("core_values").delete().eq("id", id); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-core-values"] }); toast.success("Deleted"); } });
  const addBrandPartner = useMutation({ mutationFn: async (b: typeof brandForm) => { const { error } = await supabase.from("brand_partners").insert([b]); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-brands"] }); toast.success("Brand added"); setBrandForm({ name: "", tagline: "", color_gradient: "from-blue-500/20 to-blue-600/20", logo_url: "", display_order: 0 }); }, onError: (e: any) => toast.error(e.message) });
  const deleteBrandPartner = useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("brand_partners").delete().eq("id", id); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-brands"] }); toast.success("Deleted"); } });
  const addInteriorCategory = useMutation({ mutationFn: async (c: typeof categoryForm) => { const { error } = await supabase.from("interior_categories").insert([c]); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-categories"] }); toast.success("Category added"); setCategoryForm({ name: "", icon: "Home", gradient: "from-sky-400/20 via-blue-500/10 to-indigo-500/20", accent: "bg-sky-500", display_order: 0 }); }, onError: (e: any) => toast.error(e.message) });
  const deleteInteriorCategory = useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("interior_categories").delete().eq("id", id); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-categories"] }); toast.success("Deleted"); } });
  const updateInquiryStatus = useMutation({ mutationFn: async ({ id, status }: { id: string; status: string }) => { const { error } = await supabase.from("inquiries").update({ status: status as "new" | "in_progress" | "resolved" }).eq("id", id); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] }); toast.success("Updated"); } });

  const handleSignOut = async () => { await supabase.auth.signOut(); navigate("/", { replace: true }); };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Visitors", value: pageViews || 0, icon: Eye, color: "bg-indigo-500" },
    { label: "Today's Visits", value: todayViews || 0, icon: TrendingUp, color: "bg-cyan-500" },
    { label: "Projects", value: projects?.length || 0, icon: Building2, color: "bg-blue-500" },
    { label: "Total Likes", value: totalLikes || 0, icon: Heart, color: "bg-rose-500" },
    { label: "Team Members", value: teamMembers?.length || 0, icon: Users, color: "bg-green-500" },
    { label: "Services", value: services?.length || 0, icon: Home, color: "bg-purple-500" },
    { label: "New Inquiries", value: inquiries?.filter(i => i.status === "new")?.length || 0, icon: MessageSquare, color: "bg-orange-500" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-heading font-bold mb-2">Welcome back!</h2>
              <p className="text-muted-foreground">Here's an overview of your content</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-3xl font-bold mt-1">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Inquiries</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {inquiries?.slice(0, 5).map(inquiry => (
                    <div key={inquiry.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <div>
                        <p className="font-medium">{inquiry.name}</p>
                        <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                      </div>
                      <Badge variant={inquiry.status === "resolved" ? "default" : "secondary"}>
                        {inquiry.status}
                      </Badge>
                    </div>
                  ))}
                  {(!inquiries || inquiries.length === 0) && (
                    <p className="text-muted-foreground text-center py-4">No inquiries yet</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500" />
                    Most Liked Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {projects?.sort((a, b) => ((projectLikes?.[b.id] || 0) - (projectLikes?.[a.id] || 0))).slice(0, 5).map((project, i) => (
                    <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-muted-foreground">#{i + 1}</span>
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <p className="text-xs text-muted-foreground">{project.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-rose-500">
                        <Heart className="w-4 h-4 fill-rose-500" />
                        <span className="font-bold">{projectLikes?.[project.id] || 0}</span>
                      </div>
                    </div>
                  ))}
                  {(!projects || projects.length === 0) && (
                    <p className="text-muted-foreground text-center py-4">No projects yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-heading font-bold mb-2">Analytics</h2>
              <p className="text-muted-foreground">Website traffic and engagement metrics</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Page Views", value: pageViews || 0, icon: Eye, color: "bg-indigo-500" },
                { label: "Today's Visits", value: todayViews || 0, icon: TrendingUp, color: "bg-cyan-500" },
                { label: "Total Project Likes", value: totalLikes || 0, icon: Heart, color: "bg-rose-500" },
                { label: "Unique Projects Viewed", value: Object.keys(projectViews || {}).length, icon: Building2, color: "bg-blue-500" },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-3xl font-bold mt-1">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-500" />
                    Most Viewed Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {projects?.sort((a, b) => ((projectViews?.[b.id] || 0) - (projectViews?.[a.id] || 0))).slice(0, 8).map((project, i) => (
                    <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-500">#{i + 1}</span>
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <p className="text-xs text-muted-foreground">{project.category} • {project.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-blue-500">
                        <Eye className="w-4 h-4" />
                        <span className="font-bold">{projectViews?.[project.id] || 0}</span>
                      </div>
                    </div>
                  ))}
                  {(!projects || projects.length === 0) && (
                    <p className="text-muted-foreground text-center py-4">No projects yet</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500" />
                    Most Liked Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {projects?.sort((a, b) => ((projectLikes?.[b.id] || 0) - (projectLikes?.[a.id] || 0))).slice(0, 8).map((project, i) => (
                    <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-sm font-bold text-rose-500">#{i + 1}</span>
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <p className="text-xs text-muted-foreground">{project.category} • {project.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-rose-500">
                        <Heart className="w-4 h-4 fill-rose-500" />
                        <span className="font-bold">{projectLikes?.[project.id] || 0}</span>
                      </div>
                    </div>
                  ))}
                  {(!projects || projects.length === 0) && (
                    <p className="text-muted-foreground text-center py-4">No projects yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "projects":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-heading font-bold">Projects</h2>
                <p className="text-muted-foreground">Manage your portfolio projects</p>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">{projects?.length || 0} total</Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5 text-accent" /> Add New Project</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); addProject.mutate(projectForm); }} className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="Project name" required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Location * (type to search)</Label>
                    <LocationAutocomplete
                      value={projectForm.address}
                      onChange={(address, lat, lng) => setProjectForm({
                        ...projectForm,
                        address,
                        lat: lat.toString(),
                        lon: lng.toString()
                      })}
                      placeholder="Start typing an address in India..."
                    />
                    {projectForm.lat && projectForm.lon && (
                      <p className="text-xs text-muted-foreground mt-1">
                        📍 Coordinates: {parseFloat(projectForm.lat).toFixed(6)}, {parseFloat(projectForm.lon).toFixed(6)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={projectForm.status} onValueChange={(v: any) => setProjectForm({ ...projectForm, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={projectForm.category} onValueChange={(v) => setProjectForm({ ...projectForm, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["BATHROOM", "BEDROOM", "DINING", "KITCHEN", "FACADE", "LIVING ROOM", "TERRACE"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} placeholder="Project description..." rows={3} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Project Images</Label>
                    <MultiImageUpload
                      onUpload={(urls) => setProjectForm({ ...projectForm, images: [...projectForm.images, ...urls] })}
                      maxFiles={10}
                      bucketName="project-images"
                    />
                    {projectForm.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {projectForm.images.map((url, i) => (
                          <div key={i} className="relative group">
                            <img src={url} alt={`Uploaded ${i + 1}`} className="w-16 h-16 object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={() => setProjectForm({ ...projectForm, images: projectForm.images.filter((_, idx) => idx !== i) })}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button type="submit" disabled={addProject.isPending} className="md:col-span-2">
                    {addProject.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Add Project
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects?.map(project => (
                <Card key={project.id} className="group hover:shadow-md transition-all overflow-hidden">
                  {/* Show first image if available */}
                  {project.project_images && project.project_images.length > 0 && (
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={project.project_images[0].storage_path}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      {project.project_images.length > 1 && (
                        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          +{project.project_images.length - 1} more
                        </span>
                      )}
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold line-clamp-1">{project.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {project.address}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive" onClick={() => deleteProject.mutate(project.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={project.status === "completed" ? "default" : "secondary"}>{project.status}</Badge>
                      {project.category && <Badge variant="outline">{project.category}</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "services":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-heading font-bold">Services</h2>
                <p className="text-muted-foreground">Displayed on home page carousel</p>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">{services?.length || 0} total</Badge>
            </div>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5 text-accent" /> Add Service</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); addService.mutate(serviceForm); }} className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Title *</Label><Input value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} required /></div>
                  <div className="space-y-2"><Label>Image URL</Label><Input value={serviceForm.image_url} onChange={(e) => setServiceForm({ ...serviceForm, image_url: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Order</Label><Input type="number" value={serviceForm.display_order} onChange={(e) => setServiceForm({ ...serviceForm, display_order: parseInt(e.target.value) || 0 })} /></div>
                  <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} /></div>
                  <Button type="submit" disabled={addService.isPending} className="md:col-span-2">{addService.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Add Service</Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {services?.map(s => (
                <Card key={s.id} className="group hover:shadow-md transition-all overflow-hidden">
                  {s.image_url && <img src={s.image_url} alt={s.title} className="w-full h-32 object-cover" />}
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{s.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-destructive" onClick={() => deleteService.mutate(s.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "team":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-heading font-bold">Team Members</h2>
                <p className="text-muted-foreground">Leadership shown on Founder page</p>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">{teamMembers?.length || 0} total</Badge>
            </div>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5 text-accent" /> Add Team Member</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); addTeamMember.mutate(teamForm); }} className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Name *</Label><Input value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} required /></div>
                  <div className="space-y-2"><Label>Designation *</Label><Input value={teamForm.designation} onChange={(e) => setTeamForm({ ...teamForm, designation: e.target.value })} required /></div>
                  <div className="space-y-2"><Label>Image URL</Label><Input value={teamForm.image_url} onChange={(e) => setTeamForm({ ...teamForm, image_url: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Experience</Label><Input value={teamForm.experience} onChange={(e) => setTeamForm({ ...teamForm, experience: e.target.value })} placeholder="e.g., 35+ Years" /></div>
                  <div className="space-y-2"><Label>Quote</Label><Input value={teamForm.quote} onChange={(e) => setTeamForm({ ...teamForm, quote: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Order</Label><Input type="number" value={teamForm.display_order} onChange={(e) => setTeamForm({ ...teamForm, display_order: parseInt(e.target.value) || 0 })} /></div>
                  <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea value={teamForm.description} onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })} rows={3} /></div>
                  <div className="flex items-center gap-3"><Switch checked={teamForm.is_founder} onCheckedChange={(c) => setTeamForm({ ...teamForm, is_founder: c })} /><Label>Mark as Founder</Label></div>
                  <Button type="submit" disabled={addTeamMember.isPending} className="md:col-span-2">{addTeamMember.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Add Team Member</Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers?.map(m => (
                <Card key={m.id} className="group hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {m.image_url && <img src={m.image_url} alt={m.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{m.name}</h3>
                            <p className="text-sm text-accent">{m.designation}</p>
                            <p className="text-xs text-muted-foreground">{m.experience}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-destructive" onClick={() => deleteTeamMember.mutate(m.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                        {m.is_founder && <Badge className="mt-2">Founder</Badge>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "milestones":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h2 className="text-2xl font-heading font-bold">Milestones</h2><p className="text-muted-foreground">Timeline on Founder page</p></div>
              <Badge variant="outline" className="text-lg px-4 py-2">{milestones?.length || 0} total</Badge>
            </div>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5 text-accent" /> Add Milestone</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); addMilestone.mutate(milestoneForm); }} className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Year *</Label><Input value={milestoneForm.year} onChange={(e) => setMilestoneForm({ ...milestoneForm, year: e.target.value })} placeholder="e.g., 1970s" required /></div>
                  <div className="space-y-2"><Label>Title *</Label><Input value={milestoneForm.title} onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })} required /></div>
                  <div className="space-y-2"><Label>Highlight Badge</Label><Input value={milestoneForm.highlight} onChange={(e) => setMilestoneForm({ ...milestoneForm, highlight: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Order</Label><Input type="number" value={milestoneForm.display_order} onChange={(e) => setMilestoneForm({ ...milestoneForm, display_order: parseInt(e.target.value) || 0 })} /></div>
                  <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea value={milestoneForm.description} onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })} /></div>
                  <Button type="submit" disabled={addMilestone.isPending} className="md:col-span-2">{addMilestone.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Add Milestone</Button>
                </form>
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {milestones?.map(m => (
                <Card key={m.id} className="group"><CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div><Badge className="mb-2 bg-accent">{m.year}</Badge><h3 className="font-semibold">{m.title}</h3>{m.highlight && <p className="text-xs text-muted-foreground mt-1">{m.highlight}</p>}</div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-destructive" onClick={() => deleteMilestone.mutate(m.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </CardContent></Card>
              ))}
            </div>
          </div>
        );

      case "achievements":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h2 className="text-2xl font-heading font-bold">Achievements</h2><p className="text-muted-foreground">Stats cards on Founder page</p></div>
              <Badge variant="outline" className="text-lg px-4 py-2">{achievements?.length || 0} total</Badge>
            </div>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5 text-accent" /> Add Achievement</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); addAchievement.mutate(achievementForm); }} className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Value * (e.g., "500+")</Label><Input value={achievementForm.value} onChange={(e) => setAchievementForm({ ...achievementForm, value: e.target.value })} required /></div>
                  <div className="space-y-2"><Label>Label * (e.g., "Projects")</Label><Input value={achievementForm.label} onChange={(e) => setAchievementForm({ ...achievementForm, label: e.target.value })} required /></div>
                  <div className="space-y-2"><Label>Icon</Label><Select value={achievementForm.icon} onValueChange={(v) => setAchievementForm({ ...achievementForm, icon: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{iconOptions.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2"><Label>Description</Label><Input value={achievementForm.description} onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })} /></div>
                  <Button type="submit" disabled={addAchievement.isPending} className="md:col-span-2">{addAchievement.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Add Achievement</Button>
                </form>
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements?.map(a => (
                <Card key={a.id} className="group text-center"><CardContent className="p-6">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-destructive" onClick={() => deleteAchievement.mutate(a.id)}><Trash2 className="w-4 h-4" /></Button>
                  <p className="text-3xl font-bold text-accent">{a.value}</p>
                  <p className="font-medium mt-1">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.description}</p>
                </CardContent></Card>
              ))}
            </div>
          </div>
        );

      case "values":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h2 className="text-2xl font-heading font-bold">Core Values</h2><p className="text-muted-foreground">Values section on Founder page</p></div>
              <Badge variant="outline" className="text-lg px-4 py-2">{coreValues?.length || 0} total</Badge>
            </div>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5 text-accent" /> Add Core Value</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); addCoreValue.mutate(coreValueForm); }} className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Title *</Label><Input value={coreValueForm.title} onChange={(e) => setCoreValueForm({ ...coreValueForm, title: e.target.value })} required /></div>
                  <div className="space-y-2"><Label>Icon</Label><Select value={coreValueForm.icon} onValueChange={(v) => setCoreValueForm({ ...coreValueForm, icon: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{iconOptions.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea value={coreValueForm.description} onChange={(e) => setCoreValueForm({ ...coreValueForm, description: e.target.value })} /></div>
                  <Button type="submit" disabled={addCoreValue.isPending} className="md:col-span-2">{addCoreValue.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Add Core Value</Button>
                </form>
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {coreValues?.map(v => (
                <Card key={v.id} className="group"><CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div><Badge variant="outline" className="mb-2">{v.icon}</Badge><h3 className="font-semibold">{v.title}</h3><p className="text-xs text-muted-foreground mt-1">{v.description}</p></div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-destructive" onClick={() => deleteCoreValue.mutate(v.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </CardContent></Card>
              ))}
            </div>
          </div>
        );

      case "brands":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h2 className="text-2xl font-heading font-bold">Brand Partners</h2><p className="text-muted-foreground">Shown on Materials page</p></div>
              <Badge variant="outline" className="text-lg px-4 py-2">{brandPartners?.length || 0} total</Badge>
            </div>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5 text-accent" /> Add Brand Partner</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); addBrandPartner.mutate(brandForm); }} className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Brand Name *</Label><Input value={brandForm.name} onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })} required /></div>
                  <div className="space-y-2"><Label>Tagline</Label><Input value={brandForm.tagline} onChange={(e) => setBrandForm({ ...brandForm, tagline: e.target.value })} /></div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Brand Color</Label>
                    <ColorSwatchPicker
                      presets={brandColorPresets}
                      value={brandForm.color_gradient}
                      onChange={(value) => setBrandForm({ ...brandForm, color_gradient: value })}
                    />
                  </div>
                  <div className="space-y-2"><Label>Order</Label><Input type="number" value={brandForm.display_order} onChange={(e) => setBrandForm({ ...brandForm, display_order: parseInt(e.target.value) || 0 })} /></div>
                  <Button type="submit" disabled={addBrandPartner.isPending} className="md:col-span-2">{addBrandPartner.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Add Brand</Button>
                </form>
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {brandPartners?.map(b => (
                <Card key={b.id} className="group"><CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div><h3 className="font-semibold">{b.name}</h3><p className="text-xs text-muted-foreground">{b.tagline}</p></div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-destructive" onClick={() => deleteBrandPartner.mutate(b.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </CardContent></Card>
              ))}
            </div>
          </div>
        );

      case "categories":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h2 className="text-2xl font-heading font-bold">Interior Categories</h2><p className="text-muted-foreground">Filter tabs on Interior page</p></div>
              <Badge variant="outline" className="text-lg px-4 py-2">{interiorCategories?.length || 0} total</Badge>
            </div>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5 text-accent" /> Add Category</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); addInteriorCategory.mutate(categoryForm); }} className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Name * (e.g., BATHROOM)</Label><Input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required /></div>
                  <div className="space-y-2"><Label>Icon</Label><Select value={categoryForm.icon} onValueChange={(v) => setCategoryForm({ ...categoryForm, icon: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Bath", "Bed", "Coffee", "ChefHat", "Home", "Armchair", "TreePine"].map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Accent Color</Label>
                    <ColorSwatchPicker
                      presets={accentColorPresets}
                      value={categoryForm.accent}
                      onChange={(value) => setCategoryForm({ ...categoryForm, accent: value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Background Gradient</Label>
                    <ColorSwatchPicker
                      presets={gradientPresets}
                      value={categoryForm.gradient}
                      onChange={(value) => setCategoryForm({ ...categoryForm, gradient: value })}
                    />
                  </div>
                  <div className="space-y-2"><Label>Order</Label><Input type="number" value={categoryForm.display_order} onChange={(e) => setCategoryForm({ ...categoryForm, display_order: parseInt(e.target.value) || 0 })} /></div>
                  <Button type="submit" disabled={addInteriorCategory.isPending} className="md:col-span-2">{addInteriorCategory.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Add Category</Button>
                </form>
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {interiorCategories?.map(c => (
                <Card key={c.id} className="group"><CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div><Badge className={`${c.accent} text-white mb-2`}>{c.icon}</Badge><h3 className="font-semibold">{c.name}</h3></div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-destructive" onClick={() => deleteInteriorCategory.mutate(c.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </CardContent></Card>
              ))}
            </div>
          </div>
        );

      case "inquiries":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h2 className="text-2xl font-heading font-bold">Inquiries</h2><p className="text-muted-foreground">Contact form submissions</p></div>
              <Badge variant="outline" className="text-lg px-4 py-2">{inquiries?.length || 0} total</Badge>
            </div>
            <div className="space-y-4">
              {inquiries?.map(i => (
                <Card key={i.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-lg">{i.name}</h3>
                          <Badge variant={i.status === "resolved" ? "default" : i.status === "in_progress" ? "secondary" : "destructive"}>
                            {i.status === "resolved" ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                            {i.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {i.email}</span>
                          {i.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {i.phone}</span>}
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(i.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/50">
                          <p className="text-sm">{i.message}</p>
                        </div>
                      </div>
                      <Select value={i.status || "new"} onValueChange={(v) => updateInquiryStatus.mutate({ id: i.id, status: v })}>
                        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!inquiries || inquiries.length === 0) && (
                <Card><CardContent className="p-12 text-center text-muted-foreground">No inquiries yet</CardContent></Card>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50
        ${sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"}
        bg-card border-r border-border flex flex-col transition-all duration-300 flex-shrink-0
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Building2 className="w-5 h-5 text-accent-foreground" />
            </div>
            {sidebarOpen && <span className="font-heading font-bold text-lg">Admin</span>}
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <div className="space-y-1 px-3">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  // Close sidebar on mobile after selection
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === item.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
                {sidebarOpen && activeSection === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* User section */}
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground" onClick={handleSignOut}>
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto min-w-0">
        {/* Mobile header with menu button */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border p-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-3 text-foreground"
          >
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <span className="font-heading font-semibold">Admin Panel</span>
          </button>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Admin;

