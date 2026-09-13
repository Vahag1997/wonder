import AccountArea from "@/components/wonder/AccountArea";
import { getLocale } from "@/lib/locale";
export async function generateMetadata() {
  return {
    title: (await getLocale()) === "ru" ? "Вход" : "Sign in",
    robots: { index: false, follow: false },
  };
}
export default async function Page({ searchParams }) {
  const params = await searchParams;
  return <AccountArea section="login" locale={await getLocale()} linkError={params?.notice === "link-error"} next={params?.next} />;
}
