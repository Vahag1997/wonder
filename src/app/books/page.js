import { getLocale } from "@/lib/locale";
import { books } from "@/lib/catalog";
import StoryCatalog from "@/components/wonder/StoryCatalog";
export async function generateMetadata() {
  const ru = (await getLocale()) === "ru";
  return {
    title: ru ? "Наши истории" : "Our stories",
    description: ru
      ? "Выберите историю для вашего ребёнка: иллюстрированные приключения и настоящие образцы страниц."
      : "Explore illustrated adventures, real sample pages, and thoughtful stories for little heroes.",
  };
}
export default async function BooksPage({ searchParams }) {
  const locale = await getLocale();
  const ru = locale === "ru";
  const params = await searchParams;
  const theme = ["friendship", "adventure", "learning"].includes(params.theme)
    ? params.theme
    : "";
  const query = typeof params.q === "string" ? params.q.slice(0, 100) : "";
  return (
    <section className="section wrap catalog-page">
      <div className="catalog-heading">
        <p className="eyebrow">
          {ru
            ? "Маленькая библиотека. Большое воображение."
            : "A little library. A lot of imagination."}
        </p>
        <h1>
          {ru ? (
            "Каждая история ждёт героя."
          ) : (
            <>
              Every story needs
              <br />a <em>little hero.</em>
            </>
          )}
        </h1>
        <p>
          {ru
            ? "Загляните в настоящие страницы и найдите историю, которую захочется читать вместе."
            : "Peek inside the real pages. Find the story you’ll love reading together."}
        </p>
      </div>
      <StoryCatalog
        key={`${theme}-${query}`}
        books={books}
        locale={locale}
        initialTheme={theme}
        initialQuery={query}
      />
      <p className="catalog-disclaimer">
        {ru
          ? "Коллекция образцов для демонстрации. Продажа и генерация пока недоступны."
          : "A sample collection for this private preview. Sales and generation are not yet available."}
      </p>
    </section>
  );
}
