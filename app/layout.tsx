import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "青荷守廉｜2023届青年员工廉洁感悟分享专栏",
  description: "莲心守正，清风润青。中国银行益阳分行2023届青年员工廉洁感悟分享专栏。",
  applicationName: "青荷守廉",
  icons: {
    icon: "/boc-logo.png",
    shortcut: "/boc-logo.png",
  },
  openGraph: {
    type: "website",
    title: "青荷守廉｜2023届青年员工廉洁感悟分享专栏",
    description: "莲心守正，清风润青。知敬畏、存戒惧、守底线。",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a463d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
