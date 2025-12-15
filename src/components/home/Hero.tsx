import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Award, Clock, Users } from "lucide-react";

const Hero = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-background pt-16">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20"
            >
              <Building2 className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Building Excellence Since 1970s</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight">
              <motion.span 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="block bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent"
              >
                Stumbh
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="block text-foreground"
              >
                Constructions
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-muted-foreground leading-relaxed max-w-xl"
            >
              Three generations of construction excellence. With 12 years of hands-on experience and a family legacy spanning 50+ years, we transform spaces across Delhi with precision and care.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="lg" 
                onClick={scrollToContact}
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all group"
              >
                Get a Free Quote
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                className="border-2 border-accent/20 hover:border-accent/40 hover:bg-accent/5"
              >
                View Our Work
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-8 pt-4"
            >
              {[
                { value: "500+", label: "Projects" },
                { value: "50+", label: "Years" },
                { value: "100%", label: "Satisfaction" },
              ].map((stat, index) => (
                <div key={stat.label} className={index > 0 ? "border-l border-border pl-8" : ""}>
                  <div className="text-3xl font-bold text-accent">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main container with animated border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary to-accent/10 p-1">
                <div className="w-full h-full rounded-3xl bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  
                  {/* Animated building blocks */}
                  <div className="relative w-64 h-72">
                    {/* Building floors animating from bottom to top */}
                    {[0, 1, 2, 3, 4].map((floor) => (
                      <motion.div
                        key={floor}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ 
                          delay: 0.8 + floor * 0.2, 
                          duration: 0.5,
                          ease: "easeOut"
                        }}
                        className="absolute w-full origin-bottom"
                        style={{ bottom: `${floor * 48}px` }}
                      >
                        <div className={`h-12 mx-auto rounded ${floor === 4 ? 'w-40' : 'w-48'} ${
                          floor % 2 === 0 ? 'bg-accent/80' : 'bg-accent/60'
                        } shadow-lg flex items-center justify-center gap-2`}>
                          {[0, 1, 2].map((window) => (
                            <motion.div
                              key={window}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.5 + floor * 0.2 + window * 0.1 }}
                              className="w-6 h-6 bg-background/30 rounded-sm"
                            />
                          ))}
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Roof */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.2, duration: 0.5 }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2"
                    >
                      <div className="w-0 h-0 border-l-[80px] border-r-[80px] border-b-[40px] border-l-transparent border-r-transparent border-b-accent"></div>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.5 }}
                className="absolute -right-4 top-1/4 bg-background shadow-lg rounded-xl p-3 border border-border"
              >
                <Award className="w-6 h-6 text-accent" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.7 }}
                className="absolute -left-4 top-1/2 bg-background shadow-lg rounded-xl p-3 border border-border"
              >
                <Clock className="w-6 h-6 text-accent" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.9 }}
                className="absolute -bottom-4 left-1/3 bg-background shadow-lg rounded-xl p-3 border border-border"
              >
                <Users className="w-6 h-6 text-accent" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
