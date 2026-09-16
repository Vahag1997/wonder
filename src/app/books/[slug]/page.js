import Link from "next/link";
import Image from "next/image";
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
          <div className="edition-label"><span aria-hidden="true">✦</span>{ru ? "В этом образце главный герой — мальчик" : "This sample features a boy as the main character"}<Link href="/books?gender=girl">{ru ? "Ищете для девочки?" : "Looking for a girl?"}</Link></div>
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
          <div className="faq-list detail-questions">
            {[
              [ru ? "Что будет в моей книге?" : "What will my book include?", ru ? "Планируем сохранить мир и стиль исходных иллюстраций, адаптировать героя по фотографии и заменить его имя на имя вашего ребёнка. Генерация на сайте ещё не запущена." : "Our planned experience preserves the illustrated world and style, adapts the hero from your photo, and uses your child’s name. Website generation has not launched yet."],
              [ru ? "В каком формате книга?" : "What format is the book?", ru ? `Электронная книга в PDF. В этом образце ${book.spreads} страниц. Печать и доставка сейчас не предлагаются.` : `A digital PDF book. This sample contains ${book.spreads} pages. Printing and shipping are not currently offered.`],
              [ru ? "Какую фотографию подготовить?" : "Which photo should I prepare?", ru ? "Один ребёнок в кадре, лицо крупно и хорошо видно. Подойдёт чёткий снимок при дневном свете, без фильтров, масок и солнцезащитных очков." : "One child, with their face clearly visible. Use a sharp photo in natural light, without filters, masks or sunglasses."],
            ].map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}
          </div>
        </div>
      </div>
      <div className="detail-inside">
        <div className="center-heading">
          <p className="eyebrow">{ru ? "Знакомство с историей" : "A look inside"}</p>
          <h2>{ru ? "Маленький взгляд в большой мир" : "A little peek into a big world"}</h2>
        </div>
        <div className="detail-spreads">
          {book.samples.slice(1).map((src, i) => <figure key={src}><div className="detail-spread-image"><Image src={src} alt={`${book.title[locale]} — ${ru ? "исходный образец" : "original sample"} ${i + 1}`} fill sizes="(max-width: 700px) 90vw, 45vw" /></div><figcaption>{ru ? "Страницы исходной книги · Не результат персонализации" : "Original story pages · Not a personalized result"}</figcaption></figure>)}
        </div>
        <div className="detail-end">
          <div><h2>{ru ? "А если главным героем станет ваш ребёнок?" : "What if your child were the hero?"}</h2><p>{ru ? "Познакомьтесь с шагами создания персональной истории. Сейчас без отправки фото и оплаты." : "Explore the steps to a personalized story. No photo upload or payment at this stage."}</p></div>
          <Link className="button" href={book.supported ? `/books/${book.slug}/personalize` : "/books/amir-and-new-friends"}>{ru ? "Попробовать" : "Explore"}<ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
