import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const services = [
  {
    title: "Bathroom",
    description: "Luxury spa-like bathrooms with modern fixtures",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80",
  },
  {
    title: "Bedroom",
    description: "Comfortable sanctuaries for rest",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80",
  },
  {
    title: "Kitchen",
    description: "Functional and beautiful cooking spaces",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  },
  {
    title: "Living Room",
    description: "Inviting spaces for family gatherings",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80",
  },
  {
    title: "Dining",
    description: "Elegant dining experiences",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80",
  },
  {
    title: "Facade",
    description: "Stunning exterior impressions",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
  },
  {
    title: "Terrace",
    description: "Outdoor retreats with views",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80",
  },
  {
    title: "Study Room",
    description: "Focused workspaces at home",
    image: "https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?w=600&q=80",
  },
];

const Services = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Infinite carousel logic
  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % services.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Create infinite loop array
  const getVisibleItems = () => {
    const items = [];
    for (let i = 0; i < itemsPerView + 2; i++) {
      const index = (currentIndex + i) % services.length;
      items.push({ ...services[index], originalIndex: index });
    }
    return items;
  };

  const visibleItems = getVisibleItems();

  return (
    <section className="py-10 md:py-20 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <span className="h-px w-8 bg-accent/60" />
              <span className="text-xs font-semibold tracking-[0.3em] text-accent/80 uppercase">
                Our Expertise
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight"
            >
              <span className="text-foreground">Spaces We </span>
              <span className="text-accent/90">Transform</span>
            </motion.h2>
          </div>

          {/* Navigation Arrows */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
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

        {/* Cards Carousel */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-5"
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {visibleItems.map((service, index) => {
              // Varied heights for asymmetric effect - pattern: tall, short, medium, tall
              const heightPatterns = ['h-[420px]', 'h-[340px]', 'h-[380px]', 'h-[400px]'];
              const marginPatterns = ['mt-0', 'mt-12', 'mt-6', 'mt-16'];
              const heightClass = heightPatterns[index % 4];
              const marginTop = marginPatterns[index % 4];

              return (
                <motion.div
                  key={`${service.title}-${currentIndex}-${index}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`flex-shrink-0 ${marginTop}
                    ${itemsPerView === 1 ? 'w-full' : ''}
                    ${itemsPerView === 2 ? 'w-[calc(50%-10px)]' : ''}
                    ${itemsPerView === 3 ? 'w-[calc(33.333%-14px)]' : ''}
                    ${itemsPerView === 4 ? 'w-[calc(25%-15px)]' : ''}
                  `}
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    className={`group relative ${heightClass} rounded-2xl overflow-hidden cursor-pointer`}
                  >
                    {/* Image */}
                    <motion.div
                      className="absolute inset-0"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white text-lg font-medium mb-1 flex items-center gap-2">
                        {service.title}
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </h3>
                      <p className="text-white/60 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {service.description}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Minimal progress indicator */}
        <div className="flex justify-center mt-10 gap-1.5">
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1 rounded-full transition-all duration-300
                ${i === currentIndex ? 'w-6 bg-accent/70' : 'w-1.5 bg-border/50 hover:bg-accent/30'}`}
            />
          ))}
        </div>
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

export default Services;
