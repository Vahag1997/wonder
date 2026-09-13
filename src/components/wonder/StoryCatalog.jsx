"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X, ArrowUpRight } from "lucide-react";
import BookCard from "./BookCard";
export default function StoryCatalog({
  books,
  locale,
  initialTheme = "",
  initialQuery = "",
}) {
  const ru = locale === "ru";
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const theme = initialTheme;
  const visible = books.filter(
    (book) =>
      (!theme || book.theme === theme) &&
      `${book.title[locale]} ${book.description[locale]} ${book.sourceTitle}`
        .toLocaleLowerCase()
        .includes(initialQuery.trim().toLocaleLowerCase()),
  );
  const navigate = (nextTheme, nextQuery) => {
    const params = new URLSearchParams();
    if (nextTheme) params.set("theme", nextTheme);
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    startTransition(() =>
      router.push(`/books${params.size ? "?" + params : ""}`, {
        scroll: false,
      }),
    );
  };
  return (
    <>
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
          : `${visible.length} ${ru ? "историй" : "stories to explore"}`}
        {(theme || initialQuery) && (
          <button
            className="text-link"
            onClick={() => {
              setQuery("");
              navigate("", "");
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
              navigate("", "");
            }}
          >
            {ru ? "Показать все" : "Show all stories"}
          </button>
        </div>
      )}
    </>
  );
}
