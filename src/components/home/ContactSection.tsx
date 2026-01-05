import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Send, Phone, Mail, MapPin, ArrowRight, Sparkles, Clock, Shield, Award } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  project_type: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Floating contact card component
const ContactCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtext, 
  delay 
}: { 
  icon: any; 
  title: string; 
  value: string; 
  subtext: string; 
  delay: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-50, 50], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-50, 50], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative p-6 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl hover:border-primary/40 transition-all duration-300 cursor-pointer"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex items-start gap-4">
        <motion.div 
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Icon className="w-7 h-7 text-accent" />
        </motion.div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1 group-hover:text-accent transition-colors">{title}</h3>
          <p className="text-foreground font-medium">{value}</p>
          <p className="text-sm text-muted-foreground mt-1">{subtext}</p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      </div>
    </motion.div>
  );
};

// Animated feature pill
const FeaturePill = ({ icon: Icon, text, delay }: { icon: any; text: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ scale: 1.05, y: -2 }}
    className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-foreground"
  >
    <Icon className="w-4 h-4 text-primary" />
    {text}
  </motion.div>
);

// Animated input wrapper
const AnimatedFormField = ({ children, index }: { children: React.ReactNode; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: 0.1 * index }}
  >
    {children}
  </motion.div>
);

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      project_type: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("inquiries").insert([{
        name: values.name,
        email: values.email,
        phone: values.phone,
        project_type: values.project_type as any || null,
        message: values.message,
        status: "new",
      }]);

      if (error) throw error;

      toast({
        title: "Inquiry Submitted!",
        description: "Thank you for your interest. We'll get back to you within 24 hours.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(hsl(var(--accent)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Floating orbs */}
      <motion.div
        animate={{ 
          y: [-20, 20, -20],
          x: [-10, 10, -10],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[10%] w-72 h-72 bg-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          y: [20, -20, 20],
          x: [10, -10, 10],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-[10%] w-96 h-96 bg-accent/10 rounded-full blur-3xl"
      />

      <div className="container relative z-10 mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/10 border border-accent/20 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Get in Touch</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-heading">
            <span className="block text-foreground">Let's Create</span>
            <motion.span 
              className="block bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0%", "200%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              Something Beautiful
            </motion.span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your space? We're here to bring your vision to life with expert craftsmanship.
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          <FeaturePill icon={Clock} text="24hr Response" delay={0.1} />
          <FeaturePill icon={Shield} text="Quality Guaranteed" delay={0.2} />
          <FeaturePill icon={Award} text="50+ Years Experience" delay={0.3} />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Contact Info - Left side */}
          <div className="lg:col-span-2 space-y-5">
            <ContactCard
              icon={Phone}
              title="Call Us"
              value="+91 98765 43210"
              subtext="Mon-Sat, 9 AM - 7 PM"
              delay={0}
            />
            <ContactCard
              icon={Mail}
              title="Email Us"
              value="info@stumbhconstructions.com"
              subtext="We respond within 24 hours"
              delay={0.1}
            />
            <ContactCard
              icon={MapPin}
              title="Visit Us"
              value="Delhi NCR, India"
              subtext="Serving all areas of Delhi"
              delay={0.2}
            />
          </div>

          {/* Contact Form - Right side */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 relative"
          >
            {/* Glowing border effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
            
            <div className="relative bg-card/90 backdrop-blur-md border border-border/50 rounded-3xl p-8 md:p-10 shadow-2xl">
              {/* Form header */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-bold mb-2 font-heading">Request a Quote</h3>
                <p className="text-muted-foreground">Fill in your details and we'll get back to you shortly.</p>
              </motion.div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <AnimatedFormField index={0}>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  placeholder="Your name" 
                                  {...field}
                                  onFocus={() => setFocusedField('name')}
                                  onBlur={() => setFocusedField(null)}
                                  className={`h-12 bg-background/50 border-border/50 rounded-xl transition-all duration-300 ${
                                    focusedField === 'name' ? 'border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)]' : ''
                                  }`}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AnimatedFormField>

                    <AnimatedFormField index={1}>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="your.email@example.com" 
                                {...field}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                className={`h-12 bg-background/50 border-border/50 rounded-xl transition-all duration-300 ${
                                  focusedField === 'email' ? 'border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)]' : ''
                                }`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AnimatedFormField>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <AnimatedFormField index={2}>
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+91 98765 43210" 
                                {...field}
                                onFocus={() => setFocusedField('phone')}
                                onBlur={() => setFocusedField(null)}
                                className={`h-12 bg-background/50 border-border/50 rounded-xl transition-all duration-300 ${
                                  focusedField === 'phone' ? 'border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)]' : ''
                                }`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AnimatedFormField>

                    <AnimatedFormField index={3}>
                      <FormField
                        control={form.control}
                        name="project_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">Project Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-xl">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="bathroom">Bathroom</SelectItem>
                                <SelectItem value="bedroom">Bedroom</SelectItem>
                                <SelectItem value="dining">Dining</SelectItem>
                                <SelectItem value="kitchen">Kitchen</SelectItem>
                                <SelectItem value="facade">Facade</SelectItem>
                                <SelectItem value="living_room">Living Room</SelectItem>
                                <SelectItem value="terrace">Terrace</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AnimatedFormField>
                  </div>

                  <AnimatedFormField index={4}>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">Tell us about your project</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your dream space, budget range, and timeline..."
                              className={`min-h-[140px] bg-background/50 border-border/50 rounded-xl resize-none transition-all duration-300 ${
                                focusedField === 'message' ? 'border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)]' : ''
                              }`}
                              {...field}
                              onFocus={() => setFocusedField('message')}
                              onBlur={() => setFocusedField(null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AnimatedFormField>

                  <AnimatedFormField index={5}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground rounded-xl shadow-lg shadow-accent/20 transition-all duration-300"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full"
                          />
                        ) : (
                          <span className="flex items-center gap-3">
                            Submit Inquiry
                            <motion.span
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <Send className="w-5 h-5" />
                            </motion.span>
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </AnimatedFormField>
                </form>
              </Form>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-8 pt-6 border-t border-border/30 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Secure & Private
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Quick Response
                </span>
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  No Obligation
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
