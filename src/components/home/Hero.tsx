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
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Stumbh Constructions
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
          
          {/* Construction Blueprint Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Grid background */}
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Blueprint grid */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(33, 29%, 70%)" strokeWidth="0.5" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="400" height="400" fill="url(#grid)" />
                
                {/* Construction crane */}
                <motion.g
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {/* Crane base */}
                  <rect x="180" y="300" width="40" height="100" fill="hsl(30, 25%, 40%)" />
                  
                  {/* Crane tower */}
                  <rect x="195" y="150" width="10" height="150" fill="hsl(30, 25%, 40%)" />
                  
                  {/* Crane arm */}
                  <motion.line
                    x1="200"
                    y1="150"
                    x2="350"
                    y2="150"
                    stroke="hsl(30, 25%, 40%)"
                    strokeWidth="8"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                  
                  {/* Counter weight */}
                  <motion.rect
                    x="90"
                    y="140"
                    width="40"
                    height="30"
                    fill="hsl(33, 29%, 70%)"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                  />
                  <motion.line
                    x1="200"
                    y1="150"
                    x2="130"
                    y2="150"
                    stroke="hsl(30, 25%, 40%)"
                    strokeWidth="6"
                    initial={{ scaleX: 0, originX: 1 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                  />
                  
                  {/* Hook and cable */}
                  <motion.line
                    x1="300"
                    y1="150"
                    x2="300"
                    y2="250"
                    stroke="hsl(30, 25%, 40%)"
                    strokeWidth="2"
                    initial={{ scaleY: 0, originY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
                  />
                  <motion.circle
                    cx="300"
                    cy="250"
                    r="8"
                    fill="hsl(33, 29%, 70%)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 20, 0] }}
                    transition={{ duration: 2, delay: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                </motion.g>
                
                {/* Building outline */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  {/* Foundation */}
                  <motion.rect
                    x="50"
                    y="320"
                    width="120"
                    height="80"
                    fill="none"
                    stroke="hsl(33, 29%, 70%)"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 1 }}
                  />
                  
                  {/* Walls */}
                  <motion.line
                    x1="50"
                    y1="320"
                    x2="50"
                    y2="200"
                    stroke="hsl(33, 29%, 70%)"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 2.5 }}
                  />
                  <motion.line
                    x1="170"
                    y1="320"
                    x2="170"
                    y2="200"
                    stroke="hsl(33, 29%, 70%)"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 2.5 }}
                  />
                  
                  {/* Roof line */}
                  <motion.line
                    x1="50"
                    y1="200"
                    x2="110"
                    y2="150"
                    stroke="hsl(33, 29%, 70%)"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 3.8 }}
                  />
                  <motion.line
                    x1="170"
                    y1="200"
                    x2="110"
                    y2="150"
                    stroke="hsl(33, 29%, 70%)"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 3.8 }}
                  />
                </motion.g>
                
                {/* Measurement lines */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ duration: 0.5, delay: 4.5 }}
                >
                  <line x1="40" y1="320" x2="40" y2="200" stroke="hsl(33, 29%, 70%)" strokeWidth="1" />
                  <line x1="35" y1="320" x2="45" y2="320" stroke="hsl(33, 29%, 70%)" strokeWidth="1" />
                  <line x1="35" y1="200" x2="45" y2="200" stroke="hsl(33, 29%, 70%)" strokeWidth="1" />
                  <text x="25" y="265" fill="hsl(33, 29%, 70%)" fontSize="12" fontFamily="monospace">8m</text>
                </motion.g>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
