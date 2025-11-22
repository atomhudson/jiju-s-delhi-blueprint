import { motion } from "framer-motion";
import { Bath, Bed, Coffee, ChefHat, Home, Armchair, TreePine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Bath,
    title: "Bathroom",
    description: "Luxury spa-like bathrooms with modern fixtures and elegant designs",
    color: "hsl(200, 70%, 50%)",
  },
  {
    icon: Bed,
    title: "Bedroom",
    description: "Comfortable sanctuaries designed for rest and relaxation",
    color: "hsl(280, 60%, 60%)",
  },
  {
    icon: Coffee,
    title: "Dining",
    description: "Sophisticated dining spaces perfect for family gatherings",
    color: "hsl(30, 70%, 55%)",
  },
  {
    icon: ChefHat,
    title: "Kitchen",
    description: "Functional and beautiful kitchens built for culinary excellence",
    color: "hsl(15, 65%, 55%)",
  },
  {
    icon: Home,
    title: "Facade",
    description: "Stunning exterior designs that make lasting first impressions",
    color: "hsl(220, 60%, 50%)",
  },
  {
    icon: Armchair,
    title: "Living Room",
    description: "Inviting spaces where families create lasting memories",
    color: "hsl(140, 50%, 45%)",
  },
  {
    icon: TreePine,
    title: "Terrace",
    description: "Outdoor retreats with breathtaking views and cozy ambiance",
    color: "hsl(100, 60%, 50%)",
  },
];

const Services = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Our Expertise
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transforming every corner of your home with precision craftsmanship and innovative design
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/30 bg-card/50 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div 
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${service.color}20` }}
                  >
                    <service.icon 
                      className="w-8 h-8" 
                      style={{ color: service.color }}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
