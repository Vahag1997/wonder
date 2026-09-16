"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X, ArrowUpRight } from "lucide-react";
import BookCard from "./BookCard";
import Link from "next/link";
import Image from "next/image";
import { filterStories, discoveryUrl } from "@/lib/story-discovery";
export default function StoryCatalog({
  books,
  locale,
  initialTheme = "",
  initialQuery = "",
  initialGender = "",
}) {
  const ru = locale === "ru";
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const theme = initialTheme;
  const plural = new Intl.PluralRules(locale);
  const visible = filterStories(books, {gender: initialGender, theme, query: initialQuery}, locale);
  const navigate = (nextTheme, nextQuery, nextGender = initialGender) => {
    startTransition(() =>
      router.push(discoveryUrl({gender: nextGender, theme: nextTheme, query: nextQuery}), {
        scroll: false,
      }),
    );
  };
  return (
    <>
      <div className="catalog-gender-row">
        <span>{ru ? "Для кого выбираем историю?" : "Who is the story for?"}</span>
        <div className="hero-segments" role="group" aria-label={ru ? "Герой книги" : "Book hero"}>
          {[["", ru ? "Все книги" : "All books"], ["boy", ru ? "Для мальчика" : "For a boy"], ["girl", ru ? "Для девочки" : "For a girl"]].map(([value,label]) => <button key={value} type="button" aria-pressed={initialGender === value} onClick={() => navigate(theme, query, value)}>{label}</button>)}
        </div>
      </div>
      <div className="catalog-controls">
        <div
          className="filter-chips"
          aria-label={ru ? "Тема истории" : "Story theme"}
        >
          {[
            ["", ru ? "Все истории" : "All stories"],
            ["friendship", ru ? "Дружба" : "Friendship"],
            ["adventure", ru ? "Приключения" : "Adventure"],
            ["learning", ru ? "Открытия" : "Learning"],
          ].map(([value, label]) => (
            <button
              className="filter-chip"
              key={value}
              aria-pressed={theme === value}
              onClick={() => navigate(value, query)}
            >
              {label}
              {value === "" && <span>{books.length}</span>}
            </button>
          ))}
        </div>
        <form
          className="search-field"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            navigate(theme, query);
          }}
        >
          <Search size={18} aria-hidden="true" />
          <input
            id="story-search"
            name="q"
            aria-label={ru ? "Поиск историй" : "Search stories"}
            placeholder={ru ? "Найти историю…" : "Find a little adventure…"}
            value={query}
            maxLength={100}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="search-submit"
            aria-label={ru ? "Искать" : "Search"}
          >
            <ArrowUpRight size={18} />
          </button>
        </form>
      </div>
      <div className="catalog-status" aria-live="polite">
        {pending
          ? ru
            ? "Обновляем…"
            : "Updating…"
          : `${visible.length} ${ru ? { one: "история", few: "истории", many: "историй", other: "истории" }[plural.select(visible.length)] : visible.length === 1 ? "story to explore" : "stories to explore"}`}
        {(theme || initialQuery || initialGender) && (
          <button
            className="text-link"
            onClick={() => {
              setQuery("");
              navigate("", "", "");
            }}
          >
            {ru ? "Сбросить" : "Clear filters"}
            <X size={14} />
          </button>
        )}
      </div>
      {visible.length ? (
        <div className="book-grid">
          <h2 className="visually-hidden">
            {ru ? "Истории в коллекции" : "Stories in the collection"}
          </h2>
          {visible.map((book) => (
            <BookCard key={book.slug} book={book} locale={locale} />
          ))}
        </div>
      ) : initialGender === "girl" && !books.some(book => book.heroGenders?.includes("girl")) ? (
        <div className="girl-collection-preview">
          <div className="girl-collection-art"><Image src="/images/wonder-girl-adventure.webp" alt={ru ? "Иллюстрация будущих приключений Wonder" : "An illustration of future Wonder adventures"} fill sizes="(max-width: 700px) 90vw, 50vw" /></div>
          <div><p className="eyebrow">{ru ? "Следующая глава · Скоро" : "The next chapter · Coming soon"}</p><h2>{ru ? "Большие приключения для маленьких героинь" : "Big adventures for little heroines"}</h2><p>{ru ? "Раздел для девочек уже здесь. Готовые книги с героиней появятся после подготовки иллюстраций и проверки шаблонов. Пока их нельзя персонализировать или заказать." : "The girls’ collection has its own home. Books will appear after their illustrations and templates are prepared and checked. They cannot be personalized or ordered yet."}</p><Link href="/books" className="button button-outline">{ru ? "Посмотреть все образцы" : "Explore all samples"}</Link><small>{ru ? "Промоиллюстрация, не страница готовой книги" : "Promotional artwork, not a finished book page"}</small></div>
        </div>
      ) : (
        <div className="empty-state">
          <Search size={35} aria-hidden="true" />
          <h2>
            {ru ? "Эта история ещё не нашлась." : "That story is still hiding."}
          </h2>
          <p>
            {ru
              ? "Попробуйте другое слово или покажите все истории."
              : "Try another word, or explore the whole collection."}
          </p>
          <button
            className="button button-outline"
            onClick={() => {
              setQuery("");
              navigate("", "", "");
            }}
          >
            {ru ? "Показать все" : "Show all stories"}
          </button>
        </div>
      )}
    </>
  );
}
