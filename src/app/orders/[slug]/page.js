import AccountArea from "@/components/wonder/AccountArea";
import { getLocale } from "@/lib/locale";
export async function generateMetadata() {
  return {
    title: (await getLocale()) === "ru" ? "Детали заказа" : "Order details",
    robots: { index: false, follow: false },
  };
}
export default async function Page({ params }) {
  const { slug } = await params;
  return (
    <AccountArea section="order" locale={await getLocale()} orderId={slug} />
  );
}
