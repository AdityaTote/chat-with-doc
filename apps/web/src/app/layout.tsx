import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/provider/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DocChat - Chat with Your Documents",
    template: "%s | DocChat",
  },
  description:
    "Upload any document and start chatting instantly. Get insights, summaries, and answers powered by AI.",
  keywords: [
    "AI",
    "Chat",
    "PDF",
    "Documents",
    "RAG",
    "Machine Learning",
    "Productivity",
  ],
  authors: [{ name: "DocChat Team" }],
  creator: "DocChat Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://doc-chat.adityatote.tech",
    title: "DocChat - Chat with Your Documents",
    description:
      "Upload any document and start chatting instantly. Get insights, summaries, and answers powered by AI.",
    siteName: "DocChat",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocChat - Chat with Your Documents",
    description:
      "Upload any document and start chatting instantly. Get insights, summaries, and answers powered by AI.",
    creator: "@docchat",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://doc-chat.adityatote.tech"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
