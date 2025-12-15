import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/home/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bath, Bed, Coffee, ChefHat, Home, Armchair, TreePine, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const categoryIcons: Record<string, any> = {
  BATHROOM: Bath,
  BEDROOM: Bed,
  DINING: Coffee,
  KITCHEN: ChefHat,
  FACADE: Home,
  "LIVING ROOM": Armchair,
  TERRACE: TreePine,
};

const categoryColors: Record<string, string> = {
  BATHROOM: "bg-blue-500/10 text-blue-600",
  BEDROOM: "bg-purple-500/10 text-purple-600",
  DINING: "bg-orange-500/10 text-orange-600",
  KITCHEN: "bg-red-500/10 text-red-600",
  FACADE: "bg-indigo-500/10 text-indigo-600",
  "LIVING ROOM": "bg-green-500/10 text-green-600",
  TERRACE: "bg-emerald-500/10 text-emerald-600",
};

const Interior = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["interior-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, project_images(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const categories = ["BATHROOM", "BEDROOM", "DINING", "KITCHEN", "FACADE", "LIVING ROOM", "TERRACE"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Interior Excellence
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore our diverse portfolio of interior transformations across every room of your home
            </p>
          </motion.div>
        </section>

        {/* Categories Grid */}
        <section className="container mx-auto px-6 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category, index) => {
              const Icon = categoryIcons[category] || Home;
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-accent/30">
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-2 ${categoryColors[category] || "bg-secondary"}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{category}</span>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Projects */}
        <section className="container mx-auto px-6">
          <h2 className="text-2xl font-heading font-bold mb-8">Featured Projects</h2>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects?.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden hover:shadow-xl transition-all">
                    <div className="aspect-video bg-gradient-to-br from-secondary to-muted relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Home className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge className={categoryColors["FACADE"]}>
                          General
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {project.description || project.address}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {project.status}
                        </Badge>
                        <span className="text-sm text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                          View <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Interior;
