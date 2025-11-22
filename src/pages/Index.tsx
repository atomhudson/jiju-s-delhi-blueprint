import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import ProjectMap from "@/components/home/ProjectMap";
import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/home/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Services />
      <FeaturedProjects />
      <ProjectMap />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
