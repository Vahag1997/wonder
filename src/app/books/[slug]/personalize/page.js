import { notFound, redirect } from "next/navigation";
import { getBook } from "@/lib/catalog";
import { getLocale } from "@/lib/locale";
import PersonalizationWizard from "@/components/wonder/PersonalizationWizard";
import PurchaseJourney from "@/components/wonder/PurchaseJourney";
import { safeId } from "@/lib/purchase-flow";
export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!getBook(slug)) notFound();
  return {
    title:
      (await getLocale()) === "ru"
        ? "Персонализация книги"
        : "Make it their story",
    robots: { index: false, follow: false },
  };
}
export default async function PersonalizePage({ params, searchParams }) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();
  if (!book.supported) redirect(`/books/${book.slug}`);
  const demoAvailable = process.env.WONDER_FLOW_DEMO === "true";
  const query = await searchParams;
  if (query?.order) {
    if (!safeId(query.order)) notFound();
    return (
      <PurchaseJourney
        book={book}
        locale={await getLocale()}
        initialId={query.order}
      />
    );
  }
  const demo = demoAvailable && query?.demo === "1";
  return (
    <PersonalizationWizard
      book={book}
      locale={await getLocale()}
      demo={demo}
      demoAvailable={demoAvailable}
    />
  );
}
