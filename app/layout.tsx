import type { Metadata } from "next";
import { headers } from "next/headers";
import "@fontsource-variable/cairo";
import "@fontsource-variable/noto-kufi-arabic";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "الأماكن والاتجاهات من حولنا | شهد زهران";
  const description = "تطبيق تفاعلي فاخر لطالبات الصف الرابع الابتدائي في مادة الدراسات الاجتماعية.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: "ar_EG",
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1672, height: 944, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
