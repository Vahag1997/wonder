import AccountArea from "@/components/wonder/AccountArea";
import { getLocale } from "@/lib/locale";
export async function generateMetadata() {
  return {
    title: (await getLocale()) === "ru" ? "Регистрация" : "Create an account",
    robots: { index: false, follow: false },
  };
}
export default async function Page({ searchParams }) {
  const params = await searchParams;
  return <AccountArea section="register" locale={await getLocale()} next={params?.next} />;
}
