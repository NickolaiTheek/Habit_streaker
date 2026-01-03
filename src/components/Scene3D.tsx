"use client";

import dynamic from "next/dynamic";

const SceneContent = dynamic(() => import("./SceneContent"), {
  ssr: false,
  loading: () => null,
});

export default function Scene3D() {
  return <SceneContent />;
}
