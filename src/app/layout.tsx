import type { Metadata } from "next";
import { Noto_Serif_JP, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { NavShell } from "@/components/NavShell";

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "イデアノート",
  description: "メモがアイデアに昇華されるノート",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSerifJP.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <NavShell>{children}</NavShell>
      </body>
    </html>
  );
}
