import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/Chatbot";
import Providers from "@/components/Providers";

// const inter = Inter({ subsets: ["latin"] });
const inter = { className: "font-sans" };

export const metadata: Metadata = {
  title: "HealthTrack+",
  description: "Your Comprehensive Health Management Platform",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}
