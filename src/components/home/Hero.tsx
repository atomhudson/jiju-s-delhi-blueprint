import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface BuildingElement {
  id: number;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  width: number;
  height: number;
  targetHeight: number;
  color: string;
  type: 'building' | 'crane' | 'particle' | 'scaffold';
  buildProgress: number;
  delay: number;
  speed: number;
}

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const elementsRef = useRef<BuildingElement[]>([]);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize elements
  const initElements = useCallback(() => {
    const elements: BuildingElement[] = [];
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Color palette matching theme
    const buildingColors = [
      'rgba(139, 115, 85, 0.6)',   // accent dark
      'rgba(180, 160, 130, 0.5)',  // accent medium
      'rgba(201, 181, 156, 0.4)',  // primary
      'rgba(160, 140, 110, 0.55)', // warm brown
    ];

    // Create buildings across the width
    const buildingCount = Math.floor(width / 80);
    for (let i = 0; i < buildingCount; i++) {
      const baseX = (i / buildingCount) * width + (Math.random() - 0.5) * 40;
      const buildingWidth = 50 + Math.random() * 100;
      const targetHeight = 150 + Math.random() * 350;
      const baseY = height;

      elements.push({
        id: i,
        x: baseX,
        y: baseY,
        baseX: baseX,
        baseY: baseY,
        width: buildingWidth,
        height: 0,
        targetHeight: targetHeight,
        color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
        type: 'building',
        buildProgress: 0,
        delay: Math.random() * 3,
        speed: 0.3 + Math.random() * 0.4,
      });
    }

    // Add scaffolding/construction lines
    for (let i = 0; i < 20; i++) {
      const baseX = Math.random() * width;
      const baseY = height * 0.3 + Math.random() * height * 0.5;

      elements.push({
        id: buildingCount + i,
        x: baseX,
        y: baseY,
        baseX: baseX,
        baseY: baseY,
        width: 2 + Math.random() * 3,
        height: 50 + Math.random() * 150,
        targetHeight: 50 + Math.random() * 150,
        color: 'rgba(139, 115, 85, 0.3)',
        type: 'scaffold',
        buildProgress: 1,
        delay: Math.random() * 2,
        speed: 1,
      });
    }

    // Add floating particles (construction dust/debris)
    for (let i = 0; i < 40; i++) {
      const baseX = Math.random() * width;
      const baseY = Math.random() * height;

      elements.push({
        id: buildingCount + 20 + i,
        x: baseX,
        y: baseY,
        baseX: baseX,
        baseY: baseY,
        width: 3 + Math.random() * 8,
        height: 3 + Math.random() * 8,
        targetHeight: 0,
        color: `rgba(180, 160, 130, ${0.2 + Math.random() * 0.3})`,
        type: 'particle',
        buildProgress: 1,
        delay: Math.random() * 5,
        speed: 0.5 + Math.random() * 1,
      });
    }

    // Add crane elements
    for (let i = 0; i < 3; i++) {
      const baseX = width * 0.2 + (i * width * 0.3);
      const baseY = height;

      elements.push({
        id: buildingCount + 60 + i,
        x: baseX,
        y: baseY,
        baseX: baseX,
        baseY: baseY,
        width: 8,
        height: 0,
        targetHeight: 300 + Math.random() * 200,
        color: 'rgba(100, 80, 60, 0.7)',
        type: 'crane',
        buildProgress: 0,
        delay: i * 0.5,
        speed: 0.5,
      });
    }

    elementsRef.current = elements;
  }, []);

  useEffect(() => {
    initElements();
    window.addEventListener('resize', initElements);
    return () => window.removeEventListener('resize', initElements);
  }, [initElements]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleMouseLeave = () => {
      setMousePos({ x: -1000, y: -1000 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      if (!ctx || !canvas) return;
      timeRef.current += 0.016;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background overlay
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, 'rgba(250, 248, 245, 0.02)');
      bgGradient.addColorStop(1, 'rgba(250, 248, 245, 0.05)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      elementsRef.current.forEach((el) => {
        const time = timeRef.current;

        // Calculate mouse interaction
        const dx = mousePos.x - el.baseX;
        const dy = mousePos.y - (el.baseY - el.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 250;

        let offsetX = 0;
        let offsetY = 0;
        let scale = 1;

        if (distance < maxDistance && distance > 0) {
          const force = (1 - distance / maxDistance);
          const repelStrength = el.type === 'particle' ? 80 : 40;
          
          // Repel effect
          offsetX = -(dx / distance) * force * repelStrength;
          offsetY = -(dy / distance) * force * repelStrength * 0.5;
          
          // Zoom/scale effect based on proximity
          scale = 1 + force * (el.type === 'particle' ? 0.5 : 0.15);
        }

        // Floating animation for particles
        if (el.type === 'particle') {
          const floatX = Math.sin(time * el.speed + el.delay) * 20;
          const floatY = Math.cos(time * el.speed * 0.7 + el.delay) * 15;
          offsetX += floatX;
          offsetY += floatY;
        }

        // Building progress animation
        if (el.type === 'building' || el.type === 'crane') {
          if (time > el.delay) {
            el.buildProgress = Math.min(1, el.buildProgress + 0.005 * el.speed);
          }
          el.height = el.targetHeight * el.buildProgress;
        }

        // Scaffold sway
        if (el.type === 'scaffold') {
          offsetX += Math.sin(time * 0.5 + el.delay) * 5;
        }

        // Smooth interpolation
        el.x += (el.baseX + offsetX - el.x) * 0.08;
        el.y += (el.baseY + offsetY - el.y) * 0.08;

        ctx.save();

        if (el.type === 'building') {
          const buildingX = el.x - (el.width * scale) / 2;
          const buildingY = el.y - el.height * scale;

          // Building shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
          ctx.fillRect(buildingX + 10, buildingY + 10, el.width * scale, el.height * scale);

          // Main building body
          ctx.fillStyle = el.color;
          ctx.fillRect(buildingX, buildingY, el.width * scale, el.height * scale);

          // Windows
          if (el.height > 50) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            const windowWidth = 8 * scale;
            const windowHeight = 12 * scale;
            const windowGapX = 18 * scale;
            const windowGapY = 22 * scale;
            const windowsPerRow = Math.floor((el.width * scale - 15) / windowGapX);
            const windowRows = Math.floor((el.height * scale - 20) / windowGapY);

            for (let row = 0; row < windowRows; row++) {
              for (let col = 0; col < windowsPerRow; col++) {
                const wx = buildingX + 10 + col * windowGapX;
                const wy = buildingY + 15 + row * windowGapY;
                ctx.fillRect(wx, wy, windowWidth, windowHeight);
              }
            }
          }

          // Building top accent
          ctx.fillStyle = 'rgba(139, 115, 85, 0.4)';
          ctx.fillRect(buildingX, buildingY, el.width * scale, 4);

        } else if (el.type === 'crane') {
          const craneX = el.x;
          const craneY = el.y - el.height * scale;

          // Crane mast
          ctx.strokeStyle = el.color;
          ctx.lineWidth = 6 * scale;
          ctx.beginPath();
          ctx.moveTo(craneX, el.y);
          ctx.lineTo(craneX, craneY);
          ctx.stroke();

          // Crane jib (horizontal arm)
          if (el.height > 100) {
            ctx.lineWidth = 4 * scale;
            ctx.beginPath();
            ctx.moveTo(craneX - 20, craneY);
            ctx.lineTo(craneX + 120 * scale, craneY);
            ctx.stroke();

            // Crane hook cable
            const cableX = craneX + 80 * scale + Math.sin(time + el.delay) * 10;
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(100, 80, 60, 0.5)';
            ctx.beginPath();
            ctx.moveTo(cableX, craneY);
            ctx.lineTo(cableX, craneY + 60 + Math.sin(time * 2) * 10);
            ctx.stroke();

            // Hook
            ctx.fillStyle = 'rgba(100, 80, 60, 0.6)';
            ctx.beginPath();
            ctx.arc(cableX, craneY + 70 + Math.sin(time * 2) * 10, 6, 0, Math.PI * 2);
            ctx.fill();
          }

        } else if (el.type === 'scaffold') {
          ctx.strokeStyle = el.color;
          ctx.lineWidth = el.width;
          ctx.beginPath();
          ctx.moveTo(el.x, el.y);
          ctx.lineTo(el.x, el.y - el.height);
          ctx.stroke();

          // Cross braces
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(139, 115, 85, 0.2)';
          for (let i = 0; i < el.height; i += 30) {
            ctx.beginPath();
            ctx.moveTo(el.x - 10, el.y - i);
            ctx.lineTo(el.x + 10, el.y - i - 20);
            ctx.stroke();
          }

        } else if (el.type === 'particle') {
          ctx.globalAlpha = 0.6;
          ctx.fillStyle = el.color;
          ctx.beginPath();
          ctx.arc(el.x, el.y, (el.width / 2) * scale, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // Draw construction lines (grid effect)
      ctx.strokeStyle = 'rgba(139, 115, 85, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 100) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Interactive Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" style={{ zIndex: 2 }} />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" style={{ zIndex: 2 }} />

      {/* Main Content */}
      <div className="container mx-auto px-6 relative py-24 lg:py-0" style={{ zIndex: 10 }}>
        <div className="max-w-3xl">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <span className="h-px w-12 bg-accent" />
            <span className="text-xs font-semibold tracking-[0.3em] text-accent uppercase">
              Est. 1970 • Three Generations
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold leading-[0.9] tracking-tight mb-8"
          >
            <span className="block text-foreground">We Build</span>
            <span className="block text-foreground">What You</span>
            <span className="relative inline-block mt-2">
              <span className="text-accent">Dream</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute -bottom-2 left-0 w-full h-1 bg-accent/60 origin-left rounded-full"
              />
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-10"
          >
            From blueprint to reality, we transform spaces with precision, 
            passion, and timeless craftsmanship. Move your cursor to interact with our vision.
          </motion.p>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <Button
              size="lg"
              onClick={scrollToContact}
              className="group h-14 px-8 text-base bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300"
            >
              Start Your Project
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Link to="/sites">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base rounded-full border-2 border-foreground/20 hover:border-accent hover:text-accent transition-all duration-300"
              >
                <MapPin className="mr-2 w-4 h-4" />
                Explore Sites
              </Button>
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex gap-12 pt-8 border-t border-border/50"
          >
            {[
              { value: "500+", label: "Projects" },
              { value: "54", label: "Years" },
              { value: "3", label: "Generations" }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 20 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-accent/40 flex justify-center pt-1"
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3], height: [4, 8, 4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 bg-accent rounded-full"
          />
        </motion.div>
        <span className="text-[10px] text-muted-foreground tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  );
};

export default Hero;
