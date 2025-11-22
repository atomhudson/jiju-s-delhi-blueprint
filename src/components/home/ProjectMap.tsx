import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet.heat";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Project = Database["public"]["Tables"]["projects"]["Row"];

const ProjectMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Fetch projects
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .not("latitude", "is", null)
        .not("longitude", "is", null);

      if (!error && data) {
        setProjects(data);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    // Initialize map centered on Delhi
    const map = L.map(mapContainer.current).setView([28.6139, 77.2090], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || projects.length === 0) return;

    // Add markers
    projects.forEach((project) => {
      if (project.latitude && project.longitude) {
        const marker = L.marker([project.latitude, project.longitude])
          .addTo(mapInstance.current!)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold text-sm mb-1">${project.title}</h3>
              <p class="text-xs text-gray-600">${project.address}</p>
              <p class="text-xs mt-1">
                <span class="inline-block px-2 py-0.5 rounded text-xs ${
                  project.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : project.status === "ongoing"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }">
                  ${project.status}
                </span>
              </p>
            </div>
          `);
      }
    });

    // Add heatmap layer
    const heatData: [number, number, number][] = projects
      .filter((p) => p.latitude && p.longitude)
      .map((p) => [p.latitude!, p.longitude!, 0.5]);

    if (heatData.length > 0 && (L as any).heatLayer) {
      (L as any).heatLayer(heatData, {
        radius: 25,
        blur: 35,
        maxZoom: 13,
        max: 1.0,
        gradient: {
          0.0: "#EFE9E3",
          0.3: "#D9CFC7",
          0.5: "#C9B59C",
          0.7: "#B8A888",
          1.0: "#8B7355",
        },
      }).addTo(mapInstance.current);
    }
  }, [projects]);

  return (
    <section id="map" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Our Projects Across Delhi
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our construction footprint across Delhi. Each marker represents a completed or ongoing project.
          </p>
        </div>
        
        <div 
          ref={mapContainer} 
          className="w-full h-[600px] rounded-lg shadow-lg border-4 border-background"
        />

        <div className="mt-8 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Ongoing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>Planned</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectMap;
