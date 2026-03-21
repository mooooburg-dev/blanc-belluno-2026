import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Blanc Belluno | 블랑벨루노 — 풍선 장식 & 이벤트 스타일링",
  description:
    "블랑벨루노는 생일파티, 웨딩, 돌잔치, 베이비샤워 등 소중한 날을 더욱 빛나게 만드는 프리미엄 풍선 장식 전문 브랜드입니다.",
  keywords: [
    "풍선장식",
    "이벤트풍선",
    "생일파티",
    "웨딩풍선",
    "돌잔치",
    "베이비샤워",
    "블랑벨루노",
    "Blanc Belluno",
  ],
  openGraph: {
    title: "Blanc Belluno | 블랑벨루노",
    description:
      "당신의 특별한 날을 더욱 빛나게 — 프리미엄 풍선 장식 & 이벤트 스타일링",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body
        className={`${cormorant.variable} ${notoSansKR.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
