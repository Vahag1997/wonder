import { getLocale } from "@/lib/locale";
import SupportCenter from "@/components/wonder/SupportCenter";
export async function generateMetadata() {
  return {
    title: (await getLocale()) === "ru" ? "Помощь и ответы" : "Help & answers",
  };
}
export default async function SupportPage() {
  return <SupportCenter locale={await getLocale()} />;
}
