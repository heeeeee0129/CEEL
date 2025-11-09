import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = { title: "CEEL", description: "Catalysis for Eco-friendly Energy Laboratory" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="corporate">
      <body className={`${inter.className} bg-gradient-to-br from-white via-blue-50/50 to-sky-100/40 text-gray-800 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 container mx-auto px-6 py-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}