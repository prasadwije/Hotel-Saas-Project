import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // අපි දැන් මේක හදමු

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lovable App",
  description: "Lovable Generated Project",
  metadataBase: new URL("http://localhost:3000"), // Production යනකොට මේක වෙනස් කරන්න
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* React Query සහ අනිත් Providers මෙතනට */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}