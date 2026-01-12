"use client";

import Spline from "@splinetool/react-spline";

interface SplineSceneProps {
    scene?: string;
    className?: string;
}

export default function SplineScene({
    scene = "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode", // Default placeholder scene
    className
}: SplineSceneProps) {
    return (
        <div className={`fixed inset-0 z-0 ${className}`}>
            <Spline
                scene={scene}
                className="w-full h-full"
            />
        </div>
    );
}
