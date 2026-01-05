import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/home/Footer";
import { Badge } from "@/components/ui/badge";
import { Bath, Bed, Coffee, ChefHat, Home, Armchair, TreePine, ArrowRight, MapPin, Calendar, Eye, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useRef } from "react";

const categoryData: Record<string, { icon: any; gradient: string; accent: string }> = {
  BATHROOM: { 
    icon: Bath, 
    gradient: "from-sky-400/20 via-blue-500/10 to-indigo-500/20",
    accent: "bg-sky-500"
  },
  BEDROOM: { 
    icon: Bed, 
    gradient: "from-violet-400/20 via-purple-500/10 to-fuchsia-500/20",
    accent: "bg-violet-500"
  },
  DINING: { 
    icon: Coffee, 
    gradient: "from-amber-400/20 via-orange-500/10 to-red-500/20",
    accent: "bg-amber-500"
  },
  KITCHEN: { 
    icon: ChefHat, 
    gradient: "from-rose-400/20 via-red-500/10 to-pink-500/20",
    accent: "bg-rose-500"
  },
  FACADE: { 
    icon: Home, 
    gradient: "from-slate-400/20 via-zinc-500/10 to-stone-500/20",
    accent: "bg-slate-500"
  },
  "LIVING ROOM": { 
    icon: Armchair, 
    gradient: "from-emerald-400/20 via-green-500/10 to-teal-500/20",
    accent: "bg-emerald-500"
  },
  TERRACE: { 
    icon: TreePine, 
    gradient: "from-lime-400/20 via-green-500/10 to-emerald-500/20",
    accent: "bg-lime-500"
  },
};

// Category filter pill with 3D hover effect
const CategoryPill = ({ 
  category, 
  isActive, 
  onClick 
}: { 
  category: string; 
  isActive: boolean; 
  onClick: () => void;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set((mouseX / width) - 0.5);
    y.set((mouseY / height) - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const data = categoryData[category] || categoryData.FACADE;
  const Icon = data.icon;

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative flex flex-col items-center gap-3 p-6 rounded-2xl cursor-pointer
        transition-all duration-300 border-2 group
        ${isActive 
          ? `bg-gradient-to-br ${data.gradient} border-accent shadow-xl shadow-accent/20` 
          : "bg-card/50 backdrop-blur-sm border-border/50 hover:border-accent/30 hover:shadow-lg"
        }
      `}
    >
      {/* Glow effect */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
        bg-gradient-to-br ${data.gradient} blur-xl -z-10
      `} />
      
      {/* Icon container */}
      <div 
        className={`
          w-16 h-16 rounded-xl flex items-center justify-center
          transition-all duration-300 relative overflow-hidden
          ${isActive 
            ? "bg-accent text-accent-foreground shadow-lg" 
            : "bg-secondary/80 text-muted-foreground group-hover:bg-accent/20 group-hover:text-accent"
          }
        `}
        style={{ transform: "translateZ(20px)" }}
      >
        <Icon className="w-8 h-8 relative z-10" />
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Label */}
      <span 
        className={`text-sm font-semibold tracking-wide transition-colors ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}
        style={{ transform: "translateZ(15px)" }}
      >
        {category}
      </span>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full ${data.accent}`}
        />
      )}
    </motion.button>
  );
};

// Project card with magazine-style layout
const ProjectCard = ({ 
  project, 
  index, 
  variant 
}: { 
  project: any; 
  index: number;
  variant: "large" | "medium" | "small";
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const categoryKey = project.category?.toUpperCase() || "FACADE";
  const catData = categoryData[categoryKey] || categoryData.FACADE;
  const Icon = catData.icon;

  const sizeClasses = {
    large: "md:col-span-2 md:row-span-2",
    medium: "md:col-span-1 md:row-span-2",
    small: "md:col-span-1 md:row-span-1",
  };

  const heightClasses = {
    large: "aspect-square md:aspect-[4/3]",
    medium: "aspect-[3/4]",
    small: "aspect-video",
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`
        relative group cursor-pointer rounded-3xl overflow-hidden
        ${sizeClasses[variant]}
      `}
    >
      {/* Background gradient */}
      <div className={`
        absolute inset-0 bg-gradient-to-br ${catData.gradient}
        ${heightClasses[variant]}
      `}>
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full" 
            style={{
              backgroundImage: `radial-gradient(circle at 20% 30%, hsl(var(--accent) / 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 80% 70%, hsl(var(--primary) / 0.2) 0%, transparent 50%)`
            }}
          />
        </div>

        {/* Floating icon */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Icon className={`${variant === "large" ? "w-48 h-48" : variant === "medium" ? "w-32 h-32" : "w-24 h-24"} text-accent`} />
        </motion.div>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Top badges */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between" style={{ transform: "translateZ(30px)" }}>
        <Badge className={`${catData.accent} text-white border-0 shadow-lg`}>
          <Icon className="w-3 h-3 mr-1" />
          {project.category || "General"}
        </Badge>
        
        <Badge 
          variant="outline" 
          className="bg-background/80 backdrop-blur-md border-border/50 text-foreground"
        >
          {project.status === "completed" && <Sparkles className="w-3 h-3 mr-1 text-accent" />}
          {project.status}
        </Badge>
      </div>

      {/* Bottom content */}
      <div 
        className="absolute bottom-0 left-0 right-0 p-5 translate-y-8 group-hover:translate-y-0 transition-transform duration-500"
        style={{ transform: "translateZ(25px)" }}
      >
        {/* Glass card */}
        <div className="bg-card/90 backdrop-blur-xl rounded-2xl p-4 border border-border/50 shadow-2xl">
          <h3 className={`font-heading font-bold text-foreground mb-2 ${variant === "large" ? "text-xl" : "text-base"}`}>
            {project.title}
          </h3>
          
          {variant !== "small" && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {project.description || "A stunning transformation that showcases our craftsmanship and attention to detail."}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {project.address?.split(",")[0] || "Location"}
            </span>
            {project.end_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(project.end_date).getFullYear()}
              </span>
            )}
          </div>

          {/* View button */}
          <motion.div 
            className="mt-4 flex items-center gap-2 text-accent font-medium text-sm group/btn"
            whileHover={{ x: 5 }}
          >
            <Eye className="w-4 h-4" />
            View Project
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </motion.div>
        </div>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-3xl ring-2 ring-transparent group-hover:ring-accent/30 transition-all duration-500" />
    </motion.div>
  );
};

const Interior = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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

  const filteredProjects = activeCategory 
    ? projects?.filter(p => p.category?.toUpperCase() === activeCategory)
    : projects;

  // Determine card variants for masonry-style layout
  const getVariant = (index: number): "large" | "medium" | "small" => {
    const pattern = index % 6;
    if (pattern === 0) return "large";
    if (pattern === 3) return "medium";
    return "small";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-6 mb-16 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Premium Interior Design
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              <span className="text-foreground">Spaces That</span>
              <br />
              <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
                Inspire Living
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Explore our diverse portfolio of interior transformations, where every room tells a unique story of craftsmanship and elegance.
            </p>
          </motion.div>
        </section>

        {/* Category Filters */}
        <section className="container mx-auto px-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {/* All filter */}
            <motion.button
              onClick={() => setActiveCategory(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 border-2
                ${!activeCategory 
                  ? "bg-accent text-accent-foreground border-accent shadow-lg shadow-accent/20" 
                  : "bg-card/50 backdrop-blur-sm border-border/50 text-muted-foreground hover:border-accent/30 hover:text-foreground"
                }
              `}
            >
              All Projects
            </motion.button>

            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <CategoryPill
                  category={category}
                  isActive={activeCategory === category}
                  onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Projects Grid - Magazine Style */}
        <section className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl font-heading font-bold text-foreground">
                {activeCategory || "All"} Projects
              </h2>
              <p className="text-muted-foreground mt-1">
                {filteredProjects?.length || 0} projects in this collection
              </p>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className={`rounded-3xl ${i === 0 ? "md:col-span-2 md:row-span-2 aspect-square md:aspect-[4/3]" : "aspect-video"}`} />
              ))}
            </div>
          ) : filteredProjects && filteredProjects.length > 0 ? (
            <div className="grid md:grid-cols-3 auto-rows-fr gap-6">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  variant={getVariant(index)}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary/50 flex items-center justify-center">
                <Home className="w-12 h-12 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground">Projects in this category will appear here.</p>
            </motion.div>
          )}
        </section>
      </main>

      <Footer />

      {/* Add gradient animation keyframes */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
      `}</style>
    </div>
  );
};

export default Interior;
