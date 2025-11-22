import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2 } from "lucide-react";

const Hero = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iaHNsKDE1LCA2NSUsIDU1JSkiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L2c+PC9zdmc+')] opacity-40"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Building Excellence Since 1970s</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Jiju the Builder
              </span>
              <br />
              <span className="text-foreground">Crafting Dreams into Reality</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Three generations of construction excellence. With 12 years of hands-on experience and a family legacy spanning 50+ years, we transform spaces across Delhi with precision and care.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={scrollToContact}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all group"
              >
                Get a Free Quote
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                className="border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
              >
                View Our Work
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div>
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div>
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Client Satisfaction</div>
              </div>
            </div>
          </motion.div>
          
          {/* Animated building illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full drop-shadow-2xl"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Building base */}
                <motion.rect
                  x="100"
                  y="300"
                  width="200"
                  height="80"
                  fill="hsl(15, 65%, 55%)"
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                />
                
                {/* Floor 2 */}
                <motion.rect
                  x="100"
                  y="220"
                  width="200"
                  height="80"
                  fill="hsl(25, 60%, 50%)"
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                />
                
                {/* Floor 3 */}
                <motion.rect
                  x="100"
                  y="140"
                  width="200"
                  height="80"
                  fill="hsl(15, 65%, 55%)"
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                />
                
                {/* Roof */}
                <motion.polygon
                  points="200,60 90,140 310,140"
                  fill="hsl(25, 45%, 35%)"
                  initial={{ scale: 0, originX: 0.5, originY: 1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.3 }}
                />
                
                {/* Windows - Floor 1 */}
                {[140, 180, 220, 260].map((x, i) => (
                  <motion.rect
                    key={`w1-${i}`}
                    x={x}
                    y="320"
                    width="30"
                    height="40"
                    fill="hsl(33, 30%, 97%)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                  />
                ))}
                
                {/* Windows - Floor 2 */}
                {[140, 180, 220, 260].map((x, i) => (
                  <motion.rect
                    key={`w2-${i}`}
                    x={x}
                    y="240"
                    width="30"
                    height="40"
                    fill="hsl(33, 30%, 97%)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                  />
                ))}
                
                {/* Windows - Floor 3 */}
                {[140, 180, 220, 260].map((x, i) => (
                  <motion.rect
                    key={`w3-${i}`}
                    x={x}
                    y="160"
                    width="30"
                    height="40"
                    fill="hsl(33, 30%, 97%)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 1.1 + i * 0.1 }}
                  />
                ))}
                
                {/* Door */}
                <motion.rect
                  x="180"
                  y="330"
                  width="40"
                  height="50"
                  fill="hsl(25, 45%, 35%)"
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
