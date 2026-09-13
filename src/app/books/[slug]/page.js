import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Sparkles,
  Languages,
  Info,
} from "lucide-react";
import { getLocale } from "@/lib/locale";
import { getBook, languageName } from "@/lib/catalog";
import StoryGallery from "@/components/wonder/StoryGallery";
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();
  const locale = await getLocale();
  return {
    title: book.title[locale],
    description: book.description[locale],
    openGraph: {
      title: book.title[locale],
      description: book.description[locale],
      images: [{ url: book.cover, alt: book.sourceTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: book.title[locale],
      images: [book.cover],
    },
  };
}
export default async function BookPage({ params }) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();
  const locale = await getLocale();
  const ru = locale === "ru";
  return (
    <section className="section wrap detail-page">
      <Link className="text-link back-link" href="/books">
        <ArrowLeft size={17} />
        {ru ? "Все истории" : "Back to the story shelf"}
      </Link>
      <div className="detail-grid">
        <StoryGallery book={book} locale={locale} />
        <div className="detail-copy">
          <p className="eyebrow">{book.tag[locale]}</p>
          <h1>{book.title[locale]}</h1>
          <p className="detail-description">{book.description[locale]}</p>
          <div className="book-facts">
            <span>
              <Languages size={20} />
              {languageName(book.language, locale)}
            </span>
            <span>
              <BookOpen size={20} />
              {book.spreads} {ru ? "PDF-страниц" : "PDF pages"}
            </span>
            <span>
              <Sparkles size={20} />
              {ru ? "Иллюстрированная история" : "Illustrated story"}
            </span>
          </div>
          <div className="detail-offer">
            <h2>
              {ru
                ? "Представьте их в этой истории."
                : "Picture them in this story."}
            </h2>
            <p>
              {book.supported
                ? ru
                  ? "Имя, возраст и фото → две страницы для предпросмотра → оплата полной книги. Сейчас можно попробовать шаги без отправки фото и списаний."
                  : "Name, age and photo → two-page preview → payment for the full book. For now, try the steps without photo uploads or charges."
                : ru
                  ? "Эта книга пока доступна только как образец."
                  : "This book is currently available as a reference sample only."}
            </p>
            {book.supported ? (
              <Link className="button" href={`/books/${book.slug}/personalize`}>
                {ru ? "Начать персонализацию" : "Make it their story"}
                <ArrowUpRight size={19} />
              </Link>
            ) : (
              <Link
                className="button button-outline"
                href="/books/amir-and-new-friends"
              >
                {ru
                  ? "Попробовать доступную историю"
                  : "Try the available story"}
                <ArrowUpRight size={19} />
              </Link>
            )}
            <span className="subtle">
              {ru
                ? "Демонстрация · Заказ ещё не создаётся"
                : "Preview experience · No order is placed"}
            </span>
          </div>
          <div className="notice">
            <Info size={20} />
            <p>
              {book.sourceNotice
                ? ru
                  ? "Предоставленный образец содержит брендинг Wonderwraps. Это референс, не книга Wonder в продаже."
                  : "The supplied sample contains Wonderwraps branding. It is a reference, not a Wonder book offered for sale."
                : ru
                  ? "Образцы показывают исходную историю и исходного героя. Это не результат персонализации."
                  : "Samples show the original story and character, not a personalized generation result."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
