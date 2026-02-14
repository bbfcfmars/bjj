import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JJBJJ",
  description: "AI-automated technical library from training footage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
