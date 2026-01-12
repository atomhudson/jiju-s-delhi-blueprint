import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/home/Footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LikeButton } from "@/components/LikeButton";
import { useProjectView, usePageView } from "@/hooks/useAnalytics";
import { Helmet } from "react-helmet-async";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Clock,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    X,
    Expand,
    Bath,
    Bed,
    Coffee,
    ChefHat,
    Home,
    Armchair,
    TreePine,
    Sparkles,
    Share2,
    Eye
} from "lucide-react";
import { useState, useEffect } from "react";

// Placeholder image when no images uploaded
const placeholderImage = {
    url: null,
    caption: "No images uploaded yet"
};

const categoryData: Record<string, { icon: any; gradient: string; accent: string }> = {
    BATHROOM: { icon: Bath, gradient: "from-sky-400/20 via-blue-500/10 to-indigo-500/20", accent: "bg-sky-500" },
    BEDROOM: { icon: Bed, gradient: "from-violet-400/20 via-purple-500/10 to-fuchsia-500/20", accent: "bg-violet-500" },
    DINING: { icon: Coffee, gradient: "from-amber-400/20 via-orange-500/10 to-red-500/20", accent: "bg-amber-500" },
    KITCHEN: { icon: ChefHat, gradient: "from-rose-400/20 via-red-500/10 to-pink-500/20", accent: "bg-rose-500" },
    FACADE: { icon: Home, gradient: "from-slate-400/20 via-zinc-500/10 to-stone-500/20", accent: "bg-slate-500" },
    "LIVING ROOM": { icon: Armchair, gradient: "from-emerald-400/20 via-green-500/10 to-teal-500/20", accent: "bg-emerald-500" },
    TERRACE: { icon: TreePine, gradient: "from-lime-400/20 via-green-500/10 to-emerald-500/20", accent: "bg-lime-500" },
};

const getStatusConfig = (status: string) => {
    switch (status) {
        case "completed": return { icon: CheckCircle2, label: "Completed", color: "text-emerald-500" };
        case "ongoing": return { icon: Clock, label: "Ongoing", color: "text-amber-500" };
        default: return { icon: Calendar, label: "Planned", color: "text-blue-500" };
    }
};

// Helper to create SEO-friendly slug
export const createProjectSlug = (title: string, id: string) => {
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50);
    return `${slug}-${id.substring(0, 8)}`;
};

// Helper to extract ID from slug
export const extractIdFromSlug = (slug: string) => {
    // The slug format is: title-slug-first8charsOfId
    const parts = slug.split('-');
    const shortId = parts[parts.length - 1];
    return shortId;
};

const ProjectDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [projectId, setProjectId] = useState<string | null>(null);

    // Track page view
    usePageView();

    // First, try to find the project by the slug/ID
    const { data: project, isLoading: projectLoading } = useQuery({
        queryKey: ["project-detail", slug],
        queryFn: async () => {
            if (!slug) return null;

            // Try direct UUID match first (for backward compatibility with /project/:id)
            const { data: directMatch } = await supabase
                .from("projects")
                .select("*, project_images(*)")
                .eq("id", slug)
                .maybeSingle();

            if (directMatch) return directMatch;

            // Extract the short ID from the SEO slug (last part after final dash)
            const shortId = extractIdFromSlug(slug);

            // Find project where ID starts with the short ID
            const { data: allProjects } = await supabase
                .from("projects")
                .select("*, project_images(*)");

            // Find project whose ID starts with shortId
            const matchedProject = allProjects?.find(p =>
                p.id.substring(0, 8) === shortId || p.id.startsWith(shortId)
            );

            if (matchedProject) return matchedProject;

            return null;
        },
        enabled: !!slug,
    });

    // Track project view once we have the project
    useProjectView(project?.id);

    // Redirect to SEO-friendly URL if needed
    useEffect(() => {
        if (project && slug && !slug.includes('-')) {
            // If accessed by raw ID, redirect to SEO-friendly URL
            const seoSlug = createProjectSlug(project.title, project.id);
            navigate(`/projects/${seoSlug}`, { replace: true });
        }
    }, [project, slug, navigate]);

    // Fetch related projects
    const { data: relatedProjects } = useQuery({
        queryKey: ["related-projects", project?.category],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("projects")
                .select("*, project_images(*)")
                .eq("category", project?.category)
                .neq("id", project?.id)
                .limit(3);
            if (error) throw error;
            return data;
        },
        enabled: !!project?.category,
    });

    // Get images array - handle both full URLs and storage paths
    const getImageUrl = (storagePath: string | undefined | null): string | null => {
        if (!storagePath) return null;
        // If it's already a full URL, return as-is
        if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
            return storagePath;
        }
        // Otherwise, get the public URL from Supabase storage
        const { data } = supabase.storage.from("project-images").getPublicUrl(storagePath);
        return data.publicUrl;
    };

    // Get images from project_images - show only uploaded images, no fallbacks
    const projectImages = project?.project_images || [];
    const images = projectImages.length > 0
        ? projectImages
            .map((img: any) => ({
                url: getImageUrl(img.storage_path),
                caption: img.caption,
                category: img.category
            }))
            .filter((img: any) => img.url !== null)
        : []; // No images if none uploaded

    const categoryKey = project?.category?.toUpperCase() || "FACADE";
    const catData = categoryData[categoryKey] || categoryData.FACADE;
    const CategoryIcon = catData.icon;
    const statusConfig = project ? getStatusConfig(project.status) : null;
    const StatusIcon = statusConfig?.icon;

    // Share functionality
    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: project?.title,
                    text: `Check out this ${project?.category || 'amazing'} project by Stambha Constructions`,
                    url,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            navigator.clipboard.writeText(url);
            // Could add toast here
        }
    };

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;
            if (e.key === "Escape") setLightboxOpen(false);
            if (e.key === "ArrowRight") setSelectedImageIndex((prev) => (prev + 1) % images.length);
            if (e.key === "ArrowLeft") setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxOpen, images.length]);

    if (projectLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="pt-24 pb-16">
                    <div className="container mx-auto px-6">
                        <Skeleton className="h-8 w-32 mb-8" />
                        <Skeleton className="h-[60vh] w-full rounded-3xl mb-8" />
                        <div className="grid md:grid-cols-2 gap-8">
                            <Skeleton className="h-48" />
                            <Skeleton className="h-48" />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-background">
                <Helmet>
                    <title>Project Not Found | Stambha Constructions</title>
                </Helmet>
                <Navbar />
                <main className="pt-24 pb-16 flex items-center justify-center">
                    <div className="text-center">
                        <Home className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                        <h2 className="text-2xl font-heading font-bold mb-2">Project Not Found</h2>
                        <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
                        <Link
                            to="/interior"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-full font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Projects
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    // SEO metadata
    const pageTitle = `${project.title} | ${project.category || 'Interior'} Project | Stambha Constructions`;
    const pageDescription = project.description ||
        `View our ${project.category || 'stunning'} project at ${project.address}. Professional construction and interior design by Stambha Constructions, Delhi's trusted builder with 50+ years of experience.`;
    const pageImage = images[0]?.url || fallbackImages[0];
    const pageUrl = window.location.href;

    return (
        <div className="min-h-screen bg-background">
            {/* SEO Meta Tags */}
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={pageImage} />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={pageUrl} />
                <meta property="twitter:title" content={pageTitle} />
                <meta property="twitter:description" content={pageDescription} />
                <meta property="twitter:image" content={pageImage} />

                {/* Additional SEO */}
                <meta name="keywords" content={`${project.category}, interior design, construction, Delhi, ${project.address}, Stambha Constructions`} />
                <link rel="canonical" href={pageUrl} />

                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CreativeWork",
                        "name": project.title,
                        "description": pageDescription,
                        "image": pageImage,
                        "author": {
                            "@type": "Organization",
                            "name": "Stambha Constructions"
                        },
                        "dateCreated": project.created_at,
                        "locationCreated": {
                            "@type": "Place",
                            "address": project.address
                        }
                    })}
                </script>
            </Helmet>

            <Navbar />

            <main className="pt-24 pb-16">
                {/* Back button & Header */}
                <section className="container mx-auto px-6 mb-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Link
                            to="/interior"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-6 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Projects
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap items-start gap-4 justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Badge className={`${catData.accent} text-white border-0`}>
                                    <CategoryIcon className="w-3 h-3 mr-1" />
                                    {project.category || "General"}
                                </Badge>
                                {StatusIcon && (
                                    <Badge variant="outline" className={`${statusConfig?.color} border-current`}>
                                        <StatusIcon className="w-3 h-3 mr-1" />
                                        {statusConfig?.label}
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
                                {project.title}
                            </h1>
                            <p className="text-muted-foreground mt-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {project.address}
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3">
                            <LikeButton projectId={project.id} className="!bg-secondary hover:!bg-secondary/80 !text-foreground" />
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                            >
                                <Share2 className="w-4 h-4" />
                                <span className="text-sm font-medium">Share</span>
                            </button>
                        </div>
                    </motion.div>
                </section>

                {/* Main Gallery */}
                <section className="container mx-auto px-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative"
                    >
                        {/* Main Image */}
                        <div
                            className={`relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden bg-secondary ${images.length > 0 ? 'cursor-pointer' : ''} group`}
                            onClick={() => images.length > 0 && setLightboxOpen(true)}
                        >
                            {images.length > 0 ? (
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={selectedImageIndex}
                                        src={images[selectedImageIndex]?.url}
                                        alt={`${project.title} - Image ${selectedImageIndex + 1}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full h-full object-cover"
                                    />
                                </AnimatePresence>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-secondary via-secondary/80 to-accent/10">
                                    <Home className="w-20 h-20 text-muted-foreground/30 mb-4" />
                                    <p className="text-muted-foreground text-lg">No images uploaded yet</p>
                                </div>
                            )}

                            {/* Expand overlay - only show when images exist */}
                            {images.length > 0 && (
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-full p-3">
                                        <Expand className="w-6 h-6 text-foreground" />
                                    </div>
                                </div>
                            )}

                            {/* Image counter - only show when images exist */}
                            {images.length > 0 && (
                                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                                    {selectedImageIndex + 1} / {images.length}
                                </div>
                            )}

                            {/* Navigation arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length); }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedImageIndex((prev) => (prev + 1) % images.length); }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                                {images.map((img: any, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`
                                            flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden transition-all duration-300
                                            ${index === selectedImageIndex
                                                ? "ring-2 ring-accent ring-offset-2 ring-offset-background"
                                                : "opacity-60 hover:opacity-100"
                                            }
                                        `}
                                        aria-label={`View image ${index + 1}`}
                                    >
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </section>

                {/* Project Details */}
                <section className="container mx-auto px-6 mb-16">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="md:col-span-2"
                        >
                            <h2 className="text-2xl font-heading font-bold mb-4">About This Project</h2>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                {project.description || "A stunning transformation that showcases our craftsmanship and attention to detail. Every element has been carefully designed to create a harmonious and functional space that exceeds expectations."}
                            </p>
                        </motion.div>

                        {/* Info Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-card rounded-2xl p-6 border border-border/50"
                        >
                            <h3 className="text-lg font-heading font-semibold mb-4">Project Details</h3>

                            <div className="space-y-4">
                                {/* Location */}
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Location</p>
                                        <p className="font-medium">{project.address}</p>
                                    </div>
                                </div>

                                {/* Timeline */}
                                {(project.start_date || project.end_date) && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center flex-shrink-0">
                                            <Calendar className="w-5 h-5 text-accent" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Timeline</p>
                                            <p className="font-medium">
                                                {project.start_date && new Date(project.start_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                                {project.start_date && project.end_date && " - "}
                                                {project.end_date && new Date(project.end_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Division */}
                                {project.division && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center flex-shrink-0">
                                            <Sparkles className="w-5 h-5 text-accent" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Division</p>
                                            <p className="font-medium">{project.division}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Related Projects */}
                {relatedProjects && relatedProjects.length > 0 && (
                    <section className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl font-heading font-bold mb-6">Related Projects</h2>

                            <div className="grid md:grid-cols-3 gap-6">
                                {relatedProjects.map((relProject: any, index: number) => {
                                    const relImages = relProject.project_images?.length
                                        ? relProject.project_images
                                        : [{ storage_path: null }];
                                    const relImageUrl = relImages[0].storage_path
                                        ? getImageUrl(relImages[0].storage_path)
                                        : fallbackImages[index % fallbackImages.length];
                                    const relSlug = createProjectSlug(relProject.title, relProject.id);

                                    return (
                                        <Link key={relProject.id} to={`/projects/${relSlug}`}>
                                            <motion.div
                                                whileHover={{ y: -4 }}
                                                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
                                            >
                                                <img
                                                    src={relImageUrl}
                                                    alt={relProject.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <h3 className="text-white font-heading font-semibold">{relProject.title}</h3>
                                                    <p className="text-white/70 text-sm flex items-center gap-1 mt-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {relProject.address?.split(",")[0]}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </section>
                )}
            </main>

            <Footer />

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onClick={() => setLightboxOpen(false)}
                    >
                        {/* Close button */}
                        <button
                            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            onClick={() => setLightboxOpen(false)}
                            aria-label="Close lightbox"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        {/* Image */}
                        <motion.img
                            key={selectedImageIndex}
                            src={images[selectedImageIndex]?.url}
                            alt={`${project.title} - Full view`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="max-w-[90vw] max-h-[85vh] object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length); }}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-6 h-6 text-white" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedImageIndex((prev) => (prev + 1) % images.length); }}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </button>
                            </>
                        )}

                        {/* Counter */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white">
                            {selectedImageIndex + 1} / {images.length}
                        </div>

                        {/* Caption */}
                        {images[selectedImageIndex]?.caption && (
                            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/80 text-center max-w-lg">
                                {images[selectedImageIndex].caption}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectDetail;
