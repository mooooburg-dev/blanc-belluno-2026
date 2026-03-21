import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "포트폴리오 관리 | Blanc Belluno Admin",
  description: "블랑벨루노 포트폴리오 관리 페이지",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
