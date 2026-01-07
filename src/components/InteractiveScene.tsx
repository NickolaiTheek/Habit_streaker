"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function InteractiveScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Scene setup
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      scene.background = null;

      const width = window.innerWidth;
      const height = window.innerHeight;

      const camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        0.1,
        1000
      );
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        precision: "highp",
        powerPreference: "high-performance"
      });
      rendererRef.current = renderer;
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;
      
      containerRef.current.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0x10b981, 1.5);
      pointLight1.position.set(5, 5, 5);
      pointLight1.castShadow = true;
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x3b82f6, 1.2);
      pointLight2.position.set(-5, -5, 5);
      pointLight2.castShadow = true;
      scene.add(pointLight2);

      // Create floating cubes/particles
      const createMesh = (x: number, y: number, z: number) => {
        const geometry = new THREE.IcosahedronGeometry(0.3, 4);
        const hue = Math.random();
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color().setHSL(hue, 0.7, 0.6),
          emissive: new THREE.Color().setHSL(hue, 0.5, 0.3),
          shininess: 100,
          wireframe: false,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = {
          initialPosition: { x, y, z },
          velocity: {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02,
          },
        };
        scene.add(mesh);
        meshesRef.current.push(mesh);
      };

      // Create a cluster of meshes
      for (let i = 0; i < 15; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 10 - 5;
        createMesh(x, y, z);
      }

      // Mouse movement handler
      const onMouseMove = (event: MouseEvent) => {
        mouseRef.current.x = (event.clientX / width) * 2 - 1;
        mouseRef.current.y = -(event.clientY / height) * 2 + 1;
      };

      window.addEventListener("mousemove", onMouseMove);

      // Animation loop
      let animationId: number;
      const animate = () => {
        animationId = requestAnimationFrame(animate);

        // Update meshes based on mouse position
        meshesRef.current.forEach((mesh) => {
          // Rotate meshes
          mesh.rotation.x += mesh.userData.velocity.x;
          mesh.rotation.y += mesh.userData.velocity.y;
          mesh.rotation.z += mesh.userData.velocity.z;

          // Move towards mouse
          const targetX =
            mesh.userData.initialPosition.x + mouseRef.current.x * 2;
          const targetY =
            mesh.userData.initialPosition.y + mouseRef.current.y * 2;

          mesh.position.x += (targetX - mesh.position.x) * 0.05;
          mesh.position.y += (targetY - mesh.position.y) * 0.05;

          // Floating motion
          mesh.position.z +=
            Math.sin(Date.now() * 0.001 + mesh.userData.initialPosition.z) * 0.005;

          // Glow effect based on distance from center
          const distX = Math.abs(mesh.position.x - mouseRef.current.x * 5);
          const distY = Math.abs(mesh.position.y - mouseRef.current.y * 5);
          const distance = Math.sqrt(distX * distX + distY * distY);

          const material = mesh.material as THREE.MeshPhongMaterial;
          material.emissiveIntensity = Math.max(0.2, 1 - distance * 0.15);
        });

        // Move lights with mouse
        pointLight1.position.x = mouseRef.current.x * 10;
        pointLight1.position.y = mouseRef.current.y * 10;
        pointLight2.position.x = -mouseRef.current.x * 8;
        pointLight2.position.y = -mouseRef.current.y * 8;

        renderer.render(scene, camera);
      };

      animate();

      // Handle window resize
      const onWindowResize = () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };

      window.addEventListener("resize", onWindowResize);

      // Cleanup
      const container = containerRef.current;
      const currentRenderer = renderer;
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onWindowResize);
        cancelAnimationFrame(animationId);
        if (container && currentRenderer.domElement.parentNode === container) {
          container.removeChild(currentRenderer.domElement);
        }
        currentRenderer.dispose();
        meshesRef.current.forEach((mesh) => {
          (mesh.geometry as THREE.BufferGeometry).dispose();
          (mesh.material as THREE.Material).dispose();
        });
        meshesRef.current = [];
      };
    } catch (error) {
      console.error("Error initializing InteractiveScene:", error);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      style={{ pointerEvents: "none" }}
    />
  );
}
