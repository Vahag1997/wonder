import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowRight,
  Heart,
  Camera,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { getLocale } from "@/lib/locale";
import { books } from "@/lib/catalog";
import BookCover from "@/components/wonder/BookCover";
import BookCard from "@/components/wonder/BookCard";
export default async function HomePage() {
  const locale = await getLocale();
  const ru = locale === "ru";
  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-spark" aria-hidden="true">
              ✳
            </span>
            {ru
              ? "Необыкновенные истории о вашем ребёнке"
              : "Extraordinary stories. Starring your child."}
          </p>
          <h1>
            {ru ? (
              <>
                Маленький герой.
                <br />
                <em>Большая история.</em>
              </>
            ) : (
              <>
                A little person.
                <br />A <em>very big</em>
                <br />
                adventure.
              </>
            )}
          </h1>
          <p className="hero-description">
            {ru
              ? "Его имя. Его улыбка. Целый мир открытий. Подарите ребёнку историю, в которой всё начинается с него."
              : "Their name. Their smile. A whole world of possibility. Put your child at the heart of a story they’ll want to hear again. And again."}
          </p>
          <div className="hero-actions">
            <Link href="/books" className="button">
              {ru ? "Найти свою историю" : "Find their story"}
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
            <Link href="#how-it-works" className="text-link">
              {ru ? "Как это работает" : "See how the magic works"}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="hero-note">
            <Heart size={17} aria-hidden="true" />
            <span>
              {ru
                ? "Истории для чтения вместе."
                : "Made for the “one more story” moments."}
            </span>
          </div>
        </div>
        <div className="hero-stage">
          <div className="hero-halo" aria-hidden="true" />
          <span className="stage-caption">
            {ru
              ? "Маленькое чудо на каждой странице"
              : "A little wonder, inside every page"}
          </span>
          <Link
            href={`/books/${books[0].slug}`}
            className="hero-book-link"
            aria-label={
              ru ? "Открыть образец истории" : "Open the sample story"
            }
          >
            <BookCover book={books[0]} priority />
          </Link>
          <span className="stage-sticker">
            <Sparkles size={23} aria-hidden="true" />
            <span>
              {ru ? (
                <>
                  Главный герой?
                  <br />
                  <strong>Ваш ребёнок.</strong>
                </>
              ) : (
                <>
                  The main character?
                  <br />
                  <strong>Your little one.</strong>
                </>
              )}
            </span>
          </span>
          <span className="stage-star star-one" aria-hidden="true">
            ✳
          </span>
          <span className="stage-star star-two" aria-hidden="true">
            ✦
          </span>
          <span className="stage-footnote">
            {ru
              ? "Герой исходной книги на обложке"
              : "Original story character shown"}
          </span>
        </div>
      </section>
      <div className="promise-strip">
        <div className="wrap">
          {[
            [Camera, ru ? "Знакомая улыбка" : "Their own little likeness"],
            [BookOpen, ru ? "Имя в истории" : "Their name in the story"],
            [
              Sparkles,
              ru ? "Авторские иллюстрации" : "Beautifully illustrated worlds",
            ],
            [Heart, ru ? "Моменты вместе" : "A moment to share"],
          ].map(([Icon, label]) => (
            <span key={label}>
              <Icon size={20} aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {ru ? "Библиотека открытий" : "The story shelf"}
            </p>
            <h2>
              {ru ? "Куда отправимся сегодня?" : "Where shall we go today?"}
            </h2>
          </div>
          <Link className="text-link" href="/books">
            {ru ? "Все истории" : "Explore the collection"}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="book-grid">
          {books.map((book) => (
            <BookCard key={book.slug} book={book} locale={locale} />
          ))}
        </div>
      </section>
      <section id="how-it-works" className="how-section section">
        <div className="wrap">
          <div className="center-heading">
            <p className="eyebrow">
              {ru
                ? "Вы приносите улыбку. Мы добавляем историю."
                : "You bring the little one. We bring the wonder."}
            </p>
            <h2>
              {ru
                ? "От фотографии — к приключению."
                : "From a little photo to a big adventure."}
            </h2>
          </div>
          <div className="steps-grid">
            {[
              [
                BookOpen,
                ru ? "Найдите их историю" : "Find their kind of adventure",
                ru
                  ? "Посмотрите настоящие страницы и выберите историю по душе."
                  : "Peek inside the real story pages and choose a world they’ll love.",
              ],
              [
                Camera,
                ru
                  ? "Познакомьте нас с героем"
                  : "Introduce the main character",
                ru
                  ? "Укажите имя и возраст, выберите чёткое фото и подтвердите согласие родителя."
                  : "Enter their name and age, choose a clear photo, and confirm your permission as a parent.",
              ],
              [
                Sparkles,
                ru
                  ? "Сначала посмотрите, потом оплатите"
                  : "Preview first. Pay when you’re happy.",
                ru
                  ? "Две страницы с ребёнком — до оплаты. Остальная книга в PDF — после неё."
                  : "See two pages with your child before payment. Get the rest of the PDF book afterward.",
              ],
            ].map(([Icon, title, body], i) => (
              <div className="step" key={title}>
                <span className={`step-icon step-${i}`}>
                  <Icon size={27} aria-hidden="true" />
                </span>
                <span className="step-number">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
          <p className="subtle center">
            {ru
              ? "Сейчас доступна демонстрация. Создание книг и оплата ещё не подключены."
              : "Explore the preview now. Live generation and checkout are not connected yet."}
          </p>
        </div>
      </section>
      <section className="section wrap editorial">
        <div className="editorial-image">
          <Image
            src="/images/reading-together.webp"
            alt={
              ru
                ? "Мама и ребёнок читают вместе — иллюстративная сцена"
                : "An illustrative scene of a mother and child reading together"
            }
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
          />
        </div>
        <div className="editorial-copy">
          <p className="eyebrow">
            {ru ? "Больше, чем подарок" : "More than a book"}
          </p>
          <h2>
            {ru
              ? "Они вырастут.\nЭти моменты останутся."
              : "They’ll grow up.\nThese moments stay."}
          </h2>
          <p>
            {ru
              ? "Тихий вечер. Уютное одеяло. Знакомый голос и история, которая стала немножко ближе. Именно из таких мелочей складывается детство."
              : "A quiet evening. A favorite blanket. Your voice, and a story that feels a little more like them. Sometimes the smallest rituals become the biggest memories."}
          </p>
          <Link href="/books" className="text-link">
            {ru ? "Начните новую традицию" : "Start a new story-time tradition"}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <section className="imagination-scene wrap">
        <Image
          src="/images/storybook-forest.webp"
          alt={
            ru
              ? "Авторская иллюстрация: ребёнок и пёс читают светящуюся книгу в волшебном лесу"
              : "Original illustration of a child and a dog reading a glowing book in a magical forest"
          }
          fill
          sizes="(max-width: 700px) 100vw, 1280px"
        />
        <div>
          <p className="eyebrow">
            {ru ? "Мир, полный возможностей" : "A world of possibility"}
          </p>
          <h2>
            {ru
              ? "Воображению\nесть куда расти."
              : "Give their imagination\nroom to wander."}
          </h2>
          <span>
            {ru
              ? "Авторская иллюстрация для сайта"
              : "Original artwork for Wonder"}
          </span>
        </div>
      </section>
      <section className="section wrap faq-section">
        <div>
          <p className="eyebrow">
            {ru ? "Родитель спрашивает" : "A parent’s perfectly good questions"}
          </p>
          <h2>
            {ru
              ? "Меньше вопросов.\nБольше чуда."
              : "A little less wondering.\nA little more wonder."}
          </h2>
          <Link href="/support" className="text-link">
            {ru ? "Все ответы" : "More questions? Start here"}
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="faq-list">
          {[
            [
              ru ? "Это замена только лица?" : "Is this just a face swap?",
              ru
                ? "Нет. Наш процесс адаптирует образ ребёнка под стиль иллюстраций, сохраняя окружающую сцену."
                : "No. The workflow adapts the child’s appearance to the illustration style while protecting the surrounding scene.",
            ],
            [
              ru ? "Имя тоже изменится?" : "Will their name be in the story?",
              ru
                ? "Для поддерживаемых книг имя изменяется отдельно от иллюстраций. Мы проверяем текст перед генерацией."
                : "Supported books personalize the name separately from the artwork, with a text-layout check before generation.",
            ],
            [
              ru ? "Какая фотография подойдёт?" : "What makes a good photo?",
              ru
                ? "Чёткий снимок одного ребёнка при ровном освещении, без фильтров и солнцезащитных очков."
                : "A recent, sharp photo of one child in even light, with their face visible. Avoid filters, sunglasses, and strong shadows.",
            ],
            [
              ru ? "Можно заказать сейчас?" : "Can I order a book now?",
              ru
                ? "Пока нет. Вы можете посмотреть образцы и пройти шаги персонализации. Оплата и генерация будут подключены позже."
                : "Not yet. You can explore sample stories and try the personalization steps. Payment and generation will be connected before orders open.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="closing-banner wrap">
        <span aria-hidden="true">✳</span>
        <div>
          <p className="eyebrow">
            {ru
              ? "Каждая история с чего-то начинается"
              : "Every great story starts somewhere"}
          </p>
          <h2>{ru ? "Эта начинается с них." : "This one starts with them."}</h2>
        </div>
        <Link href="/books" className="button button-light">
          {ru ? "Выбрать историю" : "Find their story"}
          <ArrowUpRight size={19} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
