import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import BookCover from "./BookCover";
import { languageName } from "@/lib/catalog";
export default function BookCard({ book, locale }) {
  const ru = locale === "ru";
  return (
    <article className="book-card">
      <Link
        className={`book-card-art surface-${book.tone}`}
        href={`/books/${book.slug}`}
        aria-label={`${book.tag[locale]} — ${book.title[locale]}`}
      >
        <span className="art-caption">
          {book.supported
            ? ru
              ? "Первая история"
              : "Our first story"
            : ru
              ? "Образец"
              : "Sample"}
        </span>
        <BookCover
          book={book}
          sizes={
            book.art === "amir"
              ? undefined
              : "(max-width: 600px) 90vw, (max-width: 850px) 45vw, 31vw"
          }
        />
        <span className="round-arrow" aria-hidden="true">
          <ArrowUpRight size={22} />
        </span>
      </Link>
      <div className="book-card-info">
        <p className="eyebrow">
          {languageName(book.language, locale)} ·{" "}
          {book.heroGenders?.includes("boy") ? (ru ? "Герой — мальчик" : "Boy edition") : (ru ? "Образец книги" : "Sample story")}
        </p>
        <h3>
          <Link href={`/books/${book.slug}`}>{book.title[locale]}</Link>
        </h3>
        <p>{book.description[locale]}</p>
        <div className="book-card-footer">
          <span className="book-card-format">{book.spreads} {ru ? "стр." : "pages"} · PDF</span>
        <Link
          className="button button-outline card-action"
          href={`/books/${book.slug}`}
        >
          {ru ? "Смотреть книгу" : "Explore book"}
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        </div>
      </div>
    </article>
  );
}
