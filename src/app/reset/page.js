import AccountArea from "@/components/wonder/AccountArea";
import { getLocale } from "@/lib/locale";
export async function generateMetadata() {
  return {
    title:
      (await getLocale()) === "ru" ? "Восстановление пароля" : "Reset password",
    robots: { index: false, follow: false },
  };
}
export default async function Page({ searchParams }) {
  const params = await searchParams;
  return <AccountArea section="reset" locale={await getLocale()} recoveryMode={params?.mode === "update"} />;
}
