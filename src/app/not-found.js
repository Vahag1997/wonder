import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import { getLocale } from "@/lib/locale";
export default async function NotFound() {
  const ru = (await getLocale()) === "ru";
  return (
    <section className="section wrap empty-state error-page">
      <BookOpen size={46} />
      <p className="eyebrow">
        {ru ? "404 · Страница не найдена" : "404 · A missing page"}
      </p>
      <h1>
        {ru
          ? "Эта страница отправилась в другое приключение."
          : "This page wandered off on an adventure."}
      </h1>
      <p>
        {ru
          ? "Давайте вернёмся к нашим историям."
          : "Let’s get you back to a story we can find."}
      </p>
      <Link href="/books" className="button">
        <ArrowLeft size={18} />
        {ru ? "Выбрать историю" : "Back to the story shelf"}
      </Link>
    </section>
  );
}
