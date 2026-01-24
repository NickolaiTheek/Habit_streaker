import { useHabitStore } from "@/store/habitStore";
import { useEffect, useRef, useState } from "react";

// Placeholder URLs for sounds
// In a real app, these would be local files or reliable CDN links
const SOUNDS = {
    complete: "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3", // "Pop" sound
    levelUp: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3", // Success chime
};

const AMBIENT_TRACKS: Record<string, string> = {
    default: "https://assets.mixkit.co/music/preview/mixkit-software-interface-start-2574.mp3", // Just a quiet placeholder
    cyberpunk: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3", // Synth-like
    sunset: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3", // Calm
    monochrome: "https://assets.mixkit.co/music/preview/mixkit-white-noise-1144.mp3", // White noise
};

export default function useSound() {
    const { stats } = useHabitStore();
    const [isMuted, setIsMuted] = useState(true); // Default to muted for browser policy
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const ambientRef = useRef<HTMLAudioElement | null>(null);

    // Initialize ambient music
    useEffect(() => {
        if (typeof window !== "undefined") {
            ambientRef.current = new Audio();
            ambientRef.current.loop = true;
            ambientRef.current.volume = 0.2; // Low volume for background
        }
    }, []);

    // Handle ambient track changes based on theme
    useEffect(() => {
        if (!ambientRef.current || isMuted) return;

        const theme = stats.currentTheme || "default";
        const trackUrl = AMBIENT_TRACKS[theme] || AMBIENT_TRACKS["default"];

        if (ambientRef.current.src !== trackUrl) {
            ambientRef.current.src = trackUrl;
            ambientRef.current.play().catch((e) => console.log("Audio play failed (user interaction needed):", e));
        }
    }, [stats.currentTheme, isMuted]);

    // Handle Play/Pause of ambient
    useEffect(() => {
        if (!ambientRef.current) return;

        if (isMuted) {
            ambientRef.current.pause();
        } else {
            // Try to resume if track is set
            if (ambientRef.current.src) {
                ambientRef.current.play().catch((e) => console.log("Audio resume failed:", e));
            }
        }
    }, [isMuted]);

    const playSfx = (type: "complete" | "levelUp") => {
        if (isMuted) return;

        const sfx = new Audio(SOUNDS[type]);
        sfx.volume = 0.5;
        sfx.play().catch((e) => console.log("SFX play failed:", e));
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    return { isMuted, toggleMute, playSfx };
}
