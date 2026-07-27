import type { Metadata, Viewport } from "next";
import { Archivo, Inter, Overpass } from "next/font/google";
import "./globals.css";

// Archivo — interface, títulos, rótulos.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--fonte-archivo",
  display: "swap",
});

// Inter — texto corrido.
const inter = Inter({
  subsets: ["latin"],
  variable: "--fonte-inter",
  display: "swap",
});

// Overpass — TODOS os números.
const overpass = Overpass({
  subsets: ["latin"],
  variable: "--fonte-overpass",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rua · Livre para correr.",
    template: "%s · Rua",
  },
  description:
    "Corredor, assessor e comunidade no mesmo lugar — e ninguém paga para estar nele.",
  applicationName: "Rua",
  metadataBase: new URL("https://rua.run"),
  openGraph: {
    title: "Rua · Livre para correr.",
    description:
      "Corredor, assessor e comunidade no mesmo lugar — e ninguém paga para estar nele.",
    url: "https://rua.run",
    siteName: "Rua",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAFAF8",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function LayoutRaiz({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${inter.variable} ${overpass.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-papel text-tinta">
        {children}
      </body>
    </html>
  );
}
