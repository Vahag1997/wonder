import { Golos_Text, Manrope } from "next/font/google";
import SiteHeader from "@/components/wonder/SiteHeader";
import SiteFooter from "@/components/wonder/SiteFooter";
import MotionObserver from "@/components/wonder/MotionObserver";
import { getLocale } from "@/lib/locale";
import "./globals.css";
import "./storefront.css";
import "./bookshop.css";
const sans = Golos_Text({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});
const display = Manrope({
  variable: "--font-heading",
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
        ? "MagicBook — Персональные книги для детей"
        : "MagicBook — A little person. A very big adventure.",
      template: "%s | MagicBook",
    },
    description: ru
      ? "Иллюстрированные истории, в которых ваш ребёнок — главный герой. Выберите книгу и укажите имя и фотографию ребёнка."
      : "Explore illustrated stories and prepare a personalized book with your child’s name and photo.",
    robots: {
      index: process.env.WONDER_PUBLIC_INDEXING === "true",
      follow: process.env.WONDER_PUBLIC_INDEXING === "true",
    },
    openGraph: {
      title: ru
        ? "MagicBook — Истории о вашем ребёнке"
        : "MagicBook — Stories with your child at their heart",
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
      <body className={`${sans.variable} ${display.variable} wonder-storefront`}>
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
