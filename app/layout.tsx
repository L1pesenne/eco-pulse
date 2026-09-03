import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ECO//PULSE — Explorador Ambiental",
  description: "Uma cidade viva para observar, compreender e agir pelo ambiente."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
