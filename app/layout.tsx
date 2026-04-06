import type { Metadata } from "next";

import "@/app/styles/globals.css";

export const metadata: Metadata = {
  title: "VAREM — 3D from Images",
  description:
    "Upload images and generate immersive AR/VR models instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
