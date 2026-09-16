import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Camera,
  Heart,
  Sparkles,
  Eye,
  Download,
} from "lucide-react";
import { getLocale } from "@/lib/locale";
import { books } from "@/lib/catalog";
import BookCard from "@/components/wonder/BookCard";
import BookCover from "@/components/wonder/BookCover";
import CinematicHero from "@/components/wonder/CinematicHero";
import StoryInMotion from "@/components/wonder/StoryInMotion";
import HeroCollections from "@/components/wonder/HeroCollections";

export default async function HomePage() {
  const locale = await getLocale();
  const ru = locale === "ru";
  const steps = [
    [
      BookOpen,
      ru ? "Выберите историю" : "Pick a story",
      ru
        ? "Дружба, открытия или большое приключение — что любит ваш ребёнок?"
        : "Friendship, discovery, or a big adventure. Find their favorite world.",
    ],
    [
      Camera,
      ru ? "Добавьте маленького героя" : "Introduce your little hero",
      ru
        ? "Имя, возраст и одна чёткая фотография. Всё начинается с них."
        : "A name, an age, and one clear photo. It all starts with them.",
    ],
    [
      Eye,
      ru ? "Загляните в свою сказку" : "See their story",
      ru
        ? "Две персональные страницы для знакомства с книгой до оплаты."
        : "Two personalized pages to explore before you pay.",
    ],
    [
      Download,
      ru ? "Сохраните целую историю" : "Keep the whole adventure",
      ru
        ? "После оплаты — полная книга в PDF для ваших семейных вечеров."
        : "After payment, the complete PDF book for your family’s story time.",
    ],
  ];
  return (
    <>
      <CinematicHero locale={locale} />
      <div className="shop-benefits">
        <div className="wrap">
          {[
            [Camera, ru ? "Знакомая улыбка" : "A familiar smile"],
            [BookOpen, ru ? "Любимое имя в истории" : "Their name in the story"],
            [
              Sparkles,
              ru
                ? "Мир красивых иллюстраций"
                : "Beautifully illustrated worlds",
            ],
            [Heart, ru ? "Для чтения вместе" : "Made to read together"],
          ].map(([Icon, label]) => (
            <span key={label}>
              <Icon size={20} aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>
      <HeroCollections locale={locale} />
      <section className="section wrap collection-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {ru ? "Наша коллекция" : "Our collection"}
            </p>
            <h2>
              {ru
                ? "Выберите свою историю"
                : "Find their favorite story"}
            </h2>
          </div>
          <Link href="/books" className="button button-small">
            {ru ? "Все книги" : "View all books"}
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="book-grid">
          {books.map((book) => (
            <BookCard key={book.slug} book={book} locale={locale} />
          ))}
        </div>
        <p className="collection-note">
          {ru
            ? "На полке — образцы исходных книг. Для персонализации первой готовим историю о дружбе."
            : "Our shelf shows original book samples. Our friendship story is the first being prepared for personalization."}
        </p>
      </section>
      <section id="how-it-works" className="section shop-how">
        <div className="wrap">
          <div className="center-heading">
            <p className="eyebrow">
              {ru
                ? "Немного вас. Немного волшебства."
                : "A little you. A little magic."}
            </p>
            <h2>
              {ru
                ? "Как рождается ваша книга"
                : "How their story comes to life"}
            </h2>
          </div>
          <div className="shop-steps">
            {steps.map(([, title, body], i) => (
              <article className="shop-step" key={title}>
                <div className={`shop-step-art step-color-${i}`}>
                  {i === 0 ? <div className="step-mini-book"><BookCover book={books[0]} sizes="240px" /></div> : i === 1 ? <div className="step-photo-frame"><Image src="/images/storybook-forest.webp" alt="" fill sizes="200px" /><Camera size={25} aria-hidden="true" /></div> : i === 2 ? <div className="step-preview-spread"><Image src={books[0].samples[1]} alt="" fill sizes="300px" /></div> : <div className="step-pdf"><BookOpen size={43} aria-hidden="true" /><b>PDF</b><Download size={20} aria-hidden="true" /></div>}
                  <span>{i + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <p className="shop-status">
            <span aria-hidden="true" />
            {ru
              ? "Готовимся к запуску. Пока можно посмотреть образцы и попробовать шаги без отправки фото. Генерация и оплата ещё не подключены."
              : "Getting ready to launch. Explore samples and try the steps without uploading a photo. Generation and payment are not connected yet."}
          </p>
        </div>
      </section>
      <StoryInMotion book={books[0]} locale={locale} />
      <section className="section shop-worlds">
        <div className="wrap">
          <div className="center-heading">
            <p className="eyebrow">
              {ru ? "Следуйте за любопытством" : "Follow their curiosity"}
            </p>
            <h2>
              {ru ? "Какой мир им по душе?" : "What’s their kind of wonder?"}
            </h2>
          </div>
          <div className="world-grid">
            {books.map((book, i) => (
              <Link
                href={`/books?theme=${book.theme}`}
                className={`world-card world-${i}`}
                key={book.slug}
              >
                <span className="world-art">
                  <Image
                    src={book.samples[2]}
                    fill
                    sizes="(max-width: 600px) 90vw, 30vw"
                    alt=""
                  />
                </span>
                <span className="world-label">
                  {
                    [
                      ru ? "Дружить и заботиться" : "Friendship & kindness",
                      ru ? "Мечтать и открывать" : "Dreams & adventures",
                      ru ? "Играть и узнавать" : "Play & discovery",
                    ][i]
                  }
                  <ArrowRight size={22} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section wrap shop-faq">
        <div className="center-heading">
          <p className="eyebrow">
            {ru ? "Всё, что хочется знать" : "A few good questions"}
          </p>
          <h2>{ru ? "Родители спрашивают" : "Parents want to know"}</h2>
        </div>
        <div className="faq-list">
          {[
            [
              ru
                ? "Как ребёнок становится героем книги?"
                : "How does my child become the hero?",
              ru
                ? "Вы выбираете историю, указываете имя и возраст ребёнка и добавляете фотографию. Наш процесс адаптирует образ ребёнка под стиль иллюстраций. Подключение генерации к сайту ещё в работе."
                : "Choose a story, enter your child’s name and age, and add a photo. Our workflow adapts their appearance to the illustration style. Connecting generation to the website is still in progress.",
            ],
            [
              ru ? "Какая фотография подойдёт?" : "What photo should I use?",
              ru
                ? "Чёткий снимок одного ребёнка при ровном освещении, без фильтров и солнцезащитных очков. Лицо должно быть хорошо видно."
                : "A clear photo of one child in even lighting, without filters or sunglasses. Make sure their whole face is visible.",
            ],
            [
              ru
                ? "Можно увидеть книгу до оплаты?"
                : "Can I preview before paying?",
              ru
                ? "Да, мы готовим такой порядок: сначала две персональные страницы, затем оплата полной книги. Пока на сайте доступны только исходные образцы, а не сгенерированные результаты."
                : "That is the experience we’re preparing: two personalized pages first, then payment for the full book. Currently the website shows original samples, not generated results.",
            ],
            [
              ru ? "Можно заказать сейчас?" : "Can I order a book now?",
              ru
                ? "Пока нет. Вы можете посмотреть образцы и пройти шаги персонализации. Оплата и генерация будут подключены позже."
                : "Not yet. Explore sample pages and try the personalization steps. Payment and generation will be connected before orders open.",
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
        <Link href="/support" className="button button-outline">
          {ru ? "Больше ответов" : "More answers"}
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
      <section className="shop-closing">
        <div className="wrap shop-closing-inner">
          <div className="shop-closing-photo">
            <Image
              src="/images/reading-together.webp"
              alt={
                ru
                  ? "Иллюстративная сцена семейного чтения"
                  : "An illustrative family reading scene"
              }
              fill
              sizes="(max-width: 700px) 100vw, 40vw"
            />
          </div>
          <div className="shop-closing-copy">
            <p className="eyebrow">
              {ru
                ? "Те самые вечера, которые остаются с нами"
                : "The evenings we remember"}
            </p>
            <h2>
              {ru ? (
                <>
                  «Ещё одну
                  <br />
                  страничку, пожалуйста!»
                </>
              ) : (
                <>
                  “Just one more
                  <br />
                  page, please!”
                </>
              )}
            </h2>
            <p>
              {ru
                ? "Пусть ваша следующая семейная традиция начнётся с истории о самом любимом человеке."
                : "Let your next family tradition begin with a story about their favorite little person."}
            </p>
            <Link href="/books" className="button">
              {ru ? "Найти свою историю" : "Find their story"}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
