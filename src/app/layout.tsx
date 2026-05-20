import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nasarawa Trade Desk",
  description:
    "A procurement and logistics platform for Nigerian regional trade through trusted Nasarawa State market operations."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
