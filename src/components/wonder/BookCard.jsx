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
        <span className="art-caption">{book.tag[locale]}</span>
        <BookCover
          book={book}
          sizes={
            book.art === "amir"
              ? undefined
              : "(max-width: 600px) calc(56vw - 23px), (max-width: 850px) 20vw, (max-width: 1100px) 19vw, 260px"
          }
        />
        <span className="round-arrow" aria-hidden="true">
          <ArrowUpRight size={22} />
        </span>
      </Link>
      <div className="book-card-info">
        <p className="eyebrow">
          {languageName(book.language, locale)} ·{" "}
          {ru ? "Образец книги" : "Sample story"}
        </p>
        <h3>
          <Link href={`/books/${book.slug}`}>{book.title[locale]}</Link>
        </h3>
        <p>{book.description[locale]}</p>
        <Link className="text-link" href={`/books/${book.slug}`}>
          {ru ? "Заглянуть внутрь" : "Take a peek inside"}
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
