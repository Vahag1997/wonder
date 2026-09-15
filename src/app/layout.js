import { Onest } from "next/font/google";
import SiteHeader from "@/components/wonder/SiteHeader";
import SiteFooter from "@/components/wonder/SiteFooter";
import MotionObserver from "@/components/wonder/MotionObserver";
import { getLocale } from "@/lib/locale";
import "./globals.css";
import "./storefront.css";
const sans = Onest({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});
export async function generateMetadata() {
  const ru = (await getLocale()) === "ru";
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ),
    title: {
      default: ru
        ? "Wonder — Персональные книги для детей"
        : "Wonder — A little person. A very big adventure.",
      template: "%s | Wonder",
    },
    description: ru
      ? "Иллюстрированные истории, в которых ваш ребёнок — главный герой. Выберите книгу и укажите имя и фотографию ребёнка."
      : "Explore illustrated stories and prepare a personalized book with your child’s name and photo.",
    icons: { icon: "/icon.svg" },
    robots: {
      index: process.env.WONDER_PUBLIC_INDEXING === "true",
      follow: process.env.WONDER_PUBLIC_INDEXING === "true",
    },
    openGraph: {
      title: ru
        ? "Wonder — Истории о вашем ребёнке"
        : "Wonder — Stories with your child at their heart",
      description: ru
        ? "Маленький герой. Большая история."
        : "A little person. A very big adventure.",
      locale: ru ? "ru_RU" : "en_US",
      alternateLocale: [ru ? "en_US" : "ru_RU"],
      images: [
        {
          url: "/og.png",
          width: 1734,
          height: 907,
          alt: ru ? "Персональная книга для ребёнка" : "Personalized storybook",
        },
      ],
    },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
  };
}
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#753bbd",
};
export default async function RootLayout({ children }) {
  const locale = await getLocale();
  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body className={`${sans.variable} wonder-storefront`}>
        <SiteHeader locale={locale} />
        <main id="main-content" tabIndex={-1}>
          <noscript>
            <p className="notice wrap">
              {locale === "ru"
                ? "Для персонализации, поиска и просмотра образцов включите JavaScript. Истории можно просматривать по ссылкам."
                : "Enable JavaScript for personalization, search, and the sample viewer. You can still explore stories using the links."}
            </p>
          </noscript>
          {children}
        </main>
        <SiteFooter locale={locale} />
        <MotionObserver />
      </body>
    </html>
  );
}
