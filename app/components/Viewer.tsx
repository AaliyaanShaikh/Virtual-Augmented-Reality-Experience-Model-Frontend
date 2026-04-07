"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

import { cn } from "@/app/lib/utils";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export type ViewerProps = {
  modelUrl: string;
  className?: string;
};

export default function Viewer({ modelUrl, className }: ViewerProps) {
  return (
    <div
      className={cn(
        "h-[500px] w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414]",
        className,
      )}
    >
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 1, 3] }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#f5f5f5"]} />
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 2]} />

        <Suspense fallback={null}>
          <Model url={modelUrl} />
        </Suspense>

        <OrbitControls autoRotate />
      </Canvas>
    </div>
  );
}
