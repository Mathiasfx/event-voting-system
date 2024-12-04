import type { Metadata } from "next";
import localFont from "next/font/local";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Elige los pesos que necesitas
  variable: "--font-open-sans", // Crea una variable de CSS para usarla en estilos
});

const Hawainas = localFont({
  src: "/fonts/Hawainas.woff",
  variable: "--font-hawainas",
  style: "normal",
  weight: "400",
});

const HaloDek = localFont({
  src: "/fonts/HaloDek.otf",
  variable: "--font-halodek",
  style: "normal",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Biolap Fest",
  description: "Vote por su favorita/o",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${Hawainas.variable} ${HaloDek.variable} ${openSans.variable}  antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
