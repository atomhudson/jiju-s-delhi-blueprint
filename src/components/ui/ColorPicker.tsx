import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

// Color presets for Brand Partners (gradients)
export const brandColorPresets = [
    { name: "Blue", value: "from-blue-500/20 to-blue-600/20", preview: "bg-gradient-to-r from-blue-500 to-blue-600" },
    { name: "Green", value: "from-green-500/20 to-green-600/20", preview: "bg-gradient-to-r from-green-500 to-green-600" },
    { name: "Red", value: "from-red-500/20 to-red-600/20", preview: "bg-gradient-to-r from-red-500 to-red-600" },
    { name: "Purple", value: "from-purple-500/20 to-purple-600/20", preview: "bg-gradient-to-r from-purple-500 to-purple-600" },
    { name: "Orange", value: "from-orange-500/20 to-orange-600/20", preview: "bg-gradient-to-r from-orange-500 to-orange-600" },
    { name: "Pink", value: "from-pink-500/20 to-pink-600/20", preview: "bg-gradient-to-r from-pink-500 to-pink-600" },
    { name: "Cyan", value: "from-cyan-500/20 to-cyan-600/20", preview: "bg-gradient-to-r from-cyan-500 to-cyan-600" },
    { name: "Amber", value: "from-amber-500/20 to-amber-600/20", preview: "bg-gradient-to-r from-amber-500 to-amber-600" },
    { name: "Teal", value: "from-teal-500/20 to-teal-600/20", preview: "bg-gradient-to-r from-teal-500 to-teal-600" },
    { name: "Indigo", value: "from-indigo-500/20 to-indigo-600/20", preview: "bg-gradient-to-r from-indigo-500 to-indigo-600" },
];

// Accent color presets for Interior Categories (solid colors)
export const accentColorPresets = [
    { name: "Sky Blue", value: "bg-sky-500", preview: "bg-sky-500" },
    { name: "Blue", value: "bg-blue-500", preview: "bg-blue-500" },
    { name: "Green", value: "bg-green-500", preview: "bg-green-500" },
    { name: "Emerald", value: "bg-emerald-500", preview: "bg-emerald-500" },
    { name: "Purple", value: "bg-purple-500", preview: "bg-purple-500" },
    { name: "Violet", value: "bg-violet-500", preview: "bg-violet-500" },
    { name: "Pink", value: "bg-pink-500", preview: "bg-pink-500" },
    { name: "Rose", value: "bg-rose-500", preview: "bg-rose-500" },
    { name: "Orange", value: "bg-orange-500", preview: "bg-orange-500" },
    { name: "Amber", value: "bg-amber-500", preview: "bg-amber-500" },
    { name: "Red", value: "bg-red-500", preview: "bg-red-500" },
    { name: "Teal", value: "bg-teal-500", preview: "bg-teal-500" },
];

// Gradient presets for Interior Categories
export const gradientPresets = [
    { name: "Ocean", value: "from-sky-400/20 via-blue-500/10 to-indigo-500/20", preview: "bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" },
    { name: "Forest", value: "from-green-400/20 via-emerald-500/10 to-teal-500/20", preview: "bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500" },
    { name: "Sunset", value: "from-orange-400/20 via-pink-500/10 to-red-500/20", preview: "bg-gradient-to-r from-orange-400 via-pink-500 to-red-500" },
    { name: "Royal", value: "from-purple-400/20 via-violet-500/10 to-indigo-500/20", preview: "bg-gradient-to-r from-purple-400 via-violet-500 to-indigo-500" },
    { name: "Rose", value: "from-pink-400/20 via-rose-500/10 to-red-500/20", preview: "bg-gradient-to-r from-pink-400 via-rose-500 to-red-500" },
    { name: "Sky", value: "from-cyan-400/20 via-sky-500/10 to-blue-500/20", preview: "bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500" },
    { name: "Warm", value: "from-amber-400/20 via-orange-500/10 to-red-500/20", preview: "bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" },
    { name: "Cool", value: "from-slate-400/20 via-gray-500/10 to-zinc-500/20", preview: "bg-gradient-to-r from-slate-400 via-gray-500 to-zinc-500" },
];

interface ColorSwatchPickerProps {
    presets: Array<{ name: string; value: string; preview: string }>;
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export function ColorSwatchPicker({ presets, value, onChange, label }: ColorSwatchPickerProps) {
    return (
        <div className="space-y-2">
            {label && <p className="text-sm text-muted-foreground mb-2">{label}</p>}
            <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                    <button
                        key={preset.value}
                        type="button"
                        onClick={() => onChange(preset.value)}
                        title={preset.name}
                        className={cn(
                            "relative w-10 h-10 rounded-lg transition-all duration-200",
                            preset.preview,
                            value === preset.value
                                ? "ring-2 ring-accent ring-offset-2 ring-offset-background scale-110"
                                : "hover:scale-105 hover:ring-1 hover:ring-border"
                        )}
                    >
                        {value === preset.value && (
                            <Check className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-md" />
                        )}
                    </button>
                ))}
            </div>
            {value && (
                <p className="text-xs text-muted-foreground mt-1">
                    Selected: {presets.find(p => p.value === value)?.name || "Custom"}
                </p>
            )}
        </div>
    );
}
