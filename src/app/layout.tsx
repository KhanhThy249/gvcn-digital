import type { Metadata } from "next";
import { Be_Vietnam_Pro, Noto_Sans } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GVCN Digital — Nền tảng số hóa công tác chủ nhiệm",
    template: "%s · GVCN Digital",
  },
  description:
    "GVCN Digital gom quản lý lớp, thông báo, khảo sát, nhiệm vụ, minh chứng và báo cáo vào một hệ thống duy nhất cho giáo viên chủ nhiệm, học sinh, phụ huynh và nhà trường.",
  keywords: [
    "GVCN",
    "giáo viên chủ nhiệm",
    "quản lý lớp",
    "thông báo phụ huynh",
    "khảo sát học sinh",
    "minh chứng",
    "báo cáo",
  ],
  authors: [{ name: "GVCN Digital" }],
  openGraph: {
    title: "GVCN Digital — Số hóa công tác chủ nhiệm",
    description:
      "Quản lý → Thông báo → Tương tác → Khảo sát → Theo dõi → Phân tích → Minh chứng → Báo cáo.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${notoSans.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a href="#main-content" className="skip-link">
          Chuyển tới nội dung chính
        </a>
        {children}
      </body>
    </html>
  );
}