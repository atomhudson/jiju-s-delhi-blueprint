import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, Clock, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

// Fallback images for projects without images
const fallbackImages = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
];

const FeaturedProjects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const projectCount = projects?.length || 0;

  // Infinite carousel handlers
  const handleNext = () => {
    if (isAnimating || projectCount === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % projectCount);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating || projectCount === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + projectCount) % projectCount);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Create infinite loop array
  const getVisibleItems = () => {
    if (!projects || projects.length === 0) return [];
    const items = [];
    for (let i = 0; i < Math.min(itemsPerView + 1, projects.length); i++) {
      const index = (currentIndex + i) % projects.length;
      items.push({ ...projects[index], displayIndex: i });
    }
    return items;
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return { icon: CheckCircle2, label: "Completed" };
      case "ongoing":
        return { icon: Clock, label: "Ongoing" };
      default:
        return { icon: Calendar, label: "Planned" };
    }
  };

  const visibleItems = getVisibleItems();

  if (isLoading) {
    return (
      <section id="projects" className="py-10 md:py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="mb-20">
            <div className="h-6 w-32 bg-muted/30 rounded mb-4 animate-pulse" />
            <div className="h-12 w-80 bg-muted/30 rounded animate-pulse" />
          </div>
          <div className="flex gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-[400px] bg-muted/20 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-32 md:py-40 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <span className="h-px w-8 bg-accent/60" />
              <span className="text-xs font-semibold tracking-[0.3em] text-accent/80 uppercase">
                Our Work
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight"
            >
              <span className="text-foreground">Featured </span>
              <span className="text-accent/90">Projects</span>
            </motion.h2>
          </div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-foreground/20 text-foreground hover:border-accent/60 hover:text-accent transition-all duration-300 flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-foreground/20 text-foreground hover:border-accent/60 hover:text-accent transition-all duration-300 flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Projects Carousel */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {visibleItems.map((project, index) => {
              const statusConfig = getStatusConfig(project.status);
              const StatusIcon = statusConfig.icon;
              const image = project.image_url || fallbackImages[index % fallbackImages.length];

              // Different unevenness pattern: wave-like
              const heightPatterns = ['h-[460px]', 'h-[380px]', 'h-[420px]'];
              const marginPatterns = ['mt-8', 'mt-0', 'mt-16'];
              const heightClass = heightPatterns[index % 3];
              const marginTop = marginPatterns[index % 3];

              return (
                <motion.div
                  key={`${project.id}-${currentIndex}`}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className={`flex-shrink-0 ${marginTop}
                    ${itemsPerView === 1 ? 'w-full' : ''}
                    ${itemsPerView === 2 ? 'w-[calc(50%-12px)]' : ''}
                    ${itemsPerView === 3 ? 'w-[calc(33.333%-16px)]' : ''}
                  `}
                >
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                    className={`group relative ${heightClass} rounded-3xl overflow-hidden cursor-pointer`}
                  >
                    {/* Image */}
                    <motion.div
                      className="absolute inset-0"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img
                        src={image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    {/* Subtle overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Status - minimal */}
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-foreground/80">
                        <StatusIcon className="w-3 h-3" />
                        <span className="text-xs font-medium">{statusConfig.label}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      {project.division && (
                        <span className="inline-block text-xs text-white/70 mb-2 font-medium">
                          {project.division}
                        </span>
                      )}

                      <h3 className="text-white text-xl font-heading font-semibold mb-2 flex items-center gap-2">
                        {project.title}
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </h3>

                      <div className="flex items-center gap-2 text-white/60">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-sm line-clamp-1">{project.address}</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Minimal progress indicator */}
        {projectCount > 0 && (
          <div className="flex justify-center mt-10 gap-1.5">
            {projects?.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1 rounded-full transition-all duration-300
                  ${i === currentIndex ? 'w-6 bg-accent/70' : 'w-1.5 bg-border/50 hover:bg-accent/30'}`}
              />
            ))}
          </div>
        )}

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a
            href="/sites"
            className="inline-flex items-center gap-2 text-base font-medium text-foreground/80 hover:text-accent transition-colors"
          >
            View all projects
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
