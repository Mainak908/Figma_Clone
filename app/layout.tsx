import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import { Room } from "./Room";
import "./globals.css";

const sans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Figma",
  description: "Figma Clone using Fabric",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.className} bg-primary-grey-200`}>
        <Room>{children}</Room>
      </body>
    </html>
  );
}
