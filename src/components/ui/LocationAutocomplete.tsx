import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from "lucide-react";

interface LocationResult {
    display_name: string;
    lat: string;
    lon: string;
}

interface LocationAutocompleteProps {
    value: string;
    onChange: (address: string, lat: number, lng: number) => void;
    placeholder?: string;
}

export function LocationAutocomplete({
    value,
    onChange,
    placeholder = "Start typing an address..."
}: LocationAutocompleteProps) {
    const [query, setQuery] = useState(value);
    const [results, setResults] = useState<LocationResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout>();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const searchLocations = async (searchQuery: string) => {
        if (searchQuery.length < 3) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        try {
            // Using OpenStreetMap Nominatim for free geocoding
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&limit=5`,
                {
                    headers: {
                        "Accept-Language": "en",
                    },
                }
            );
            const data = await response.json();
            setResults(data);
            setShowDropdown(data.length > 0);
        } catch (error) {
            console.error("Location search failed:", error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);

        // Debounce the search
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            searchLocations(newQuery);
        }, 300);
    };

    const handleSelect = (result: LocationResult) => {
        setQuery(result.display_name);
        setShowDropdown(false);
        onChange(result.display_name, parseFloat(result.lat), parseFloat(result.lon));
    };

    return (
        <div ref={wrapperRef} className="relative">
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => results.length > 0 && setShowDropdown(true)}
                    placeholder={placeholder}
                    className="pl-10"
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                )}
            </div>

            {showDropdown && results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                    {results.map((result, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSelect(result)}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-secondary/50 transition-colors flex items-start gap-3 border-b border-border/50 last:border-0"
                        >
                            <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{result.display_name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
