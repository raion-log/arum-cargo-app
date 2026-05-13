import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

// 헤드라인 · 숫자 · 화물 데이터
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

// AWB · ICAO 코드 등 모노스페이스
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "아름 카고 — 항공 화물 업계 뉴스 + 채용",
  description:
    "11년차 항공 화물 현직자가 매일 아침 정리해주는 업계 뉴스와 카고 채용 허브",
  keywords: ["항공화물", "카고", "AWB", "포워더", "콘솔사", "항공물류 채용"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={cn(spaceGrotesk.variable, jetbrainsMono.variable)}
    >
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
