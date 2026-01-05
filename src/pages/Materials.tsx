import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/home/Footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Package, Building2, Paintbrush, Wrench, Zap, Droplets, 
  Sparkles, Shield, Award, CheckCircle, ArrowRight,
  Hammer, Layers, Palette, Lightbulb, Droplet, Grid3X3
} from "lucide-react";
import { useState, useRef } from "react";

const categoryIcons: Record<string, any> = {
  Cement: Building2,
  Steel: Hammer,
  Tiles: Grid3X3,
  Bathroom: Droplet,
  Finishing: Palette,
  Electrical: Lightbulb,
  Plumbing: Droplets,
  Hardware: Wrench,
};

const categoryImages: Record<string, string> = {
  Cement: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop",
  Steel: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  Tiles: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop",
  Bathroom: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop",
  Finishing: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop",
  Electrical: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
};

const brandLogos = [
  { name: "UltraTech", tagline: "The Engineer's Choice", color: "from-blue-500/20 to-blue-600/20" },
  { name: "TATA Tiscon", tagline: "Super Ductile TMT", color: "from-red-500/20 to-red-600/20" },
  { name: "Kajaria", tagline: "India's No.1 Tile", color: "from-orange-500/20 to-orange-600/20" },
  { name: "Kohler", tagline: "The Bold Look", color: "from-slate-500/20 to-slate-600/20" },
  { name: "Asian Paints", tagline: "Har Ghar Kuch Kehta Hai", color: "from-rose-500/20 to-rose-600/20" },
  { name: "Havells", tagline: "Wires That Don't Catch Fire", color: "from-yellow-500/20 to-yellow-600/20" },
  { name: "Pidilite", tagline: "Building Bonds", color: "from-purple-500/20 to-purple-600/20" },
  { name: "Saint-Gobain", tagline: "Making a Difference", color: "from-teal-500/20 to-teal-600/20" },
];

// 3D Tilt Card Component
const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Brand Card Component
const BrandCard = ({ brand, index }: { brand: typeof brandLogos[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
  >
    <TiltCard className="cursor-pointer">
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${brand.color} backdrop-blur-sm border border-border/50 p-6 h-full group`}>
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/40" />
        <div className="relative z-10">
          <h3 className="text-xl font-heading font-bold text-foreground group-hover:text-accent transition-colors">
            {brand.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{brand.tagline}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-accent">
            <CheckCircle className="w-4 h-4" />
            <span>Authorized Partner</span>
          </div>
        </div>
        <motion.div 
          className="absolute -bottom-2 -right-2 w-20 h-20 bg-accent/10 rounded-full blur-xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
    </TiltCard>
  </motion.div>
);

// Category Tab Component
const CategoryTab = ({ 
  category, 
  isActive, 
  onClick, 
  icon: Icon 
}: { 
  category: string; 
  isActive: boolean; 
  onClick: () => void;
  icon: any;
}) => (
  <motion.button
    onClick={onClick}
    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ${
      isActive 
        ? "bg-accent text-accent-foreground shadow-lg" 
        : "bg-card hover:bg-secondary text-foreground"
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
      isActive ? "bg-accent-foreground/20" : "bg-accent/10"
    }`}>
      <Icon className={`w-6 h-6 ${isActive ? "text-accent-foreground" : "text-accent"}`} />
    </div>
    <span className="text-sm font-medium">{category}</span>
    {isActive && (
      <motion.div 
        layoutId="activeTab"
        className="absolute inset-0 rounded-xl bg-accent -z-10"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
  </motion.button>
);

// Material Card Component
const MaterialCard = ({ material, index }: { material: any; index: number }) => {
  const Icon = categoryIcons[material.category] || Package;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
    >
      <TiltCard className="h-full">
        <div className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-accent/30 transition-all duration-500 h-full">
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden">
            <img 
              src={categoryImages[material.category] || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop"}
              alt={material.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
            
            {/* Floating Badge */}
            <motion.div 
              className="absolute top-4 left-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-accent/90 text-accent-foreground backdrop-blur-sm">
                <Icon className="w-3 h-3 mr-1" />
                {material.category}
              </Badge>
            </motion.div>
            
            {/* Brand Logo */}
            <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-xs font-bold text-accent">{material.brand}</span>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="p-5">
            <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-accent transition-colors">
              {material.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {material.description || "Premium quality material from trusted manufacturers."}
            </p>
            
            {/* Features */}
            <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-accent" />
                <span>Quality Certified</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3 text-accent" />
                <span>Best in Class</span>
              </div>
            </div>
          </div>
          
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5" />
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, delay }: { 
  icon: any; 
  title: string; 
  description: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-accent/30 transition-all group"
  >
    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
      <Icon className="w-6 h-6 text-accent" />
    </div>
    <div>
      <h3 className="font-heading font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  </motion.div>
);

const Materials = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const { data: materials, isLoading } = useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("materials")
        .select("*")
        .order("category");
      if (error) throw error;
      return data;
    },
  });

  const categories = materials ? [...new Set(materials.map(m => m.category))] : [];
  
  const filteredMaterials = activeCategory 
    ? materials?.filter(m => m.category === activeCategory)
    : materials;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative container mx-auto px-6 mb-20 overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Premium Construction Materials</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Built with the{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent bg-[length:200%] animate-gradient">
                  Best Materials
                </span>
                <motion.span 
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-accent to-primary rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We partner exclusively with India's most trusted brands to ensure exceptional quality, 
              durability, and peace of mind in every project we undertake.
            </p>
          </motion.div>
        </section>

        {/* Brand Partners Section */}
        <section className="mb-20">
          <div className="container mx-auto px-6 mb-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 justify-center"
            >
              <div className="h-px w-12 bg-border" />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Our Trusted Partners
              </span>
              <div className="h-px w-12 bg-border" />
            </motion.div>
          </div>
          
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {brandLogos.map((brand, index) => (
                <BrandCard key={brand.name} brand={brand} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Category Filter Section */}
        <section className="container mx-auto px-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3"
          >
            <CategoryTab
              category="All"
              isActive={activeCategory === null}
              onClick={() => setActiveCategory(null)}
              icon={Layers}
            />
            {categories.map((category) => (
              <CategoryTab
                key={category}
                category={category}
                isActive={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                icon={categoryIcons[category] || Package}
              />
            ))}
          </motion.div>
        </section>

        {/* Materials Grid */}
        <section className="container mx-auto px-6 mb-20">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-2xl" />
              ))}
            </div>
          ) : (
            <motion.div 
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredMaterials?.map((material, index) => (
                <MaterialCard key={material.id} material={material} index={index} />
              ))}
            </motion.div>
          )}
          
          {filteredMaterials?.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No materials found in this category.</p>
            </motion.div>
          )}
        </section>

        {/* Quality Features Section */}
        <section className="container mx-auto px-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Why Our Materials Stand Out
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every material undergoes rigorous quality checks before being used in your project.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <FeatureCard
              icon={Shield}
              title="Quality Certified"
              description="All materials are ISI marked and certified by relevant authorities."
              delay={0}
            />
            <FeatureCard
              icon={Award}
              title="Best in Class"
              description="We source only from market leaders known for excellence."
              delay={0.1}
            />
            <FeatureCard
              icon={CheckCircle}
              title="Rigorous Testing"
              description="Each batch undergoes our internal quality checks."
              delay={0.2}
            />
            <FeatureCard
              icon={Sparkles}
              title="Premium Selection"
              description="Hand-picked materials for superior finish and durability."
              delay={0.3}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-accent to-primary p-8 md:p-12"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                backgroundSize: '32px 32px'
              }} />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-accent-foreground mb-3">
                  Quality You Can Trust
                </h2>
                <p className="text-accent-foreground/80 max-w-xl">
                  We never compromise on materials because we know that the foundation of a lasting 
                  structure lies in the quality of its components.
                </p>
              </div>
              
              <motion.a
                href="/#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 bg-accent-foreground text-accent rounded-full font-medium whitespace-nowrap hover:bg-accent-foreground/90 transition-colors"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>
            
            {/* Floating Orbs */}
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 bg-accent-foreground/10 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Materials;
