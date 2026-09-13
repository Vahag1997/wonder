import AccountArea from "@/components/wonder/AccountArea";
import { getLocale } from "@/lib/locale";
export async function generateMetadata() {
  return {
    title: (await getLocale()) === "ru" ? "Мои заказы" : "My orders",
    robots: { index: false, follow: false },
  };
}
export default async function Page() {
  return <AccountArea section="orders" locale={await getLocale()} />;
}
