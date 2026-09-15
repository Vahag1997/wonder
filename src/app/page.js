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
      <section className="shop-hero" aria-labelledby="home-title">
        <div className="shop-hero-art">
          <Image
            src="/images/storybook-forest.webp"
            alt={
              ru
                ? "Авторская иллюстрация: ребёнок и добрый пёс открывают волшебную книгу"
                : "Original illustration of a child and a friendly dog discovering a magical book"
            }
            fill
            priority
            sizes="(max-width: 700px) 100vw, 56vw"
          />
          <span className="hero-art-label">
            {ru
              ? "Каждая сказка начинается с чуда"
              : "Every story begins with a little wonder"}
          </span>
          <span className="hero-spark hero-spark-one" aria-hidden="true">
            ✦
          </span>
        </div>
        <div className="shop-hero-copy">
          <span className="hero-spark hero-spark-two" aria-hidden="true">
            ✳
          </span>
          <p className="eyebrow">
            {ru ? "Персональные книги для детей" : "A story made just for them"}
          </p>
          <h1 id="home-title">
            {ru ? (
              <>
                Маленький герой.
                <br />
                <em>
                  Его большая
                  <br />
                  сказка.
                </em>
              </>
            ) : (
              <>
                A little person.
                <br />
                <em>
                  Their own
                  <br />
                  big story.
                </em>
              </>
            )}
          </h1>
          <p className="shop-hero-description">
            {ru
              ? "Подарите ребёнку целый мир, в котором он — главный герой. С его именем, улыбкой и неповторимым воображением."
              : "Give your child a world where they’re the main character. Their name, their smile, their one-of-a-kind imagination."}
          </p>
          <Link href="/books" className="button">
            {ru ? "Выбрать книгу" : "Find their story"}
            <ArrowRight size={19} aria-hidden="true" />
          </Link>
          <a href="#how-it-works" className="hero-secondary">
            {ru
              ? "Как появляется персональная книга?"
              : "How does their story come to life?"}
          </a>
        </div>
      </section>
      <div className="shop-benefits">
        <div className="wrap">
          {[
            [Camera, ru ? "Герой с его улыбкой" : "A hero with their smile"],
            [BookOpen, ru ? "Его имя в истории" : "Their name in the story"],
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
      <section className="section wrap collection-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {ru ? "На нашей книжной полке" : "On our bookshelf"}
            </p>
            <h2>
              {ru
                ? "Найдите их любимую историю"
                : "Meet their next favorite story"}
            </h2>
          </div>
          <Link href="/books" className="button button-outline button-small">
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
            {steps.map(([Icon, title, body], i) => (
              <article className="shop-step" key={title}>
                <div className={`shop-step-art step-color-${i}`}>
                  <Icon size={46} strokeWidth={1.5} aria-hidden="true" />
                  <span>{i + 1}</span>
                  <i aria-hidden="true">✦</i>
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
      <section className="section wrap shop-feature">
        <div className="shop-feature-copy">
          <p className="eyebrow">
            {ru
              ? "Большие чувства. Маленькие герои."
              : "Big feelings. Little heroes."}
          </p>
          <h2>
            {ru ? (
              <>
                У каждой дружбы
                <br />
                есть своя <em>история.</em>
              </>
            ) : (
              <>
                Every friendship
                <br />
                has a <em>story.</em>
              </>
            )}
          </h2>
          <p>
            {ru
              ? "Смелость сделать первый шаг. Радость нового открытия. И верный друг рядом. Начните с нашей тёплой истории о мальчике и его псе."
              : "The courage to take a first step. The joy of a new discovery. A loyal friend by their side. Explore our warm story of a boy and his dog."}
          </p>
          <Link href={`/books/${books[0].slug}`} className="button">
            {ru ? "Заглянуть в книгу" : "Peek inside the book"}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <span className="subtle">
            {ru
              ? "Показываем страницы исходной книги"
              : "Original story pages shown"}
          </span>
        </div>
        <div className="shop-feature-art">
          <span className="feature-badge">
            {ru ? "История о дружбе" : "A story of friendship"}
          </span>
          <div className="feature-page">
            <Image
              src={books[0].samples[1]}
              alt={
                ru
                  ? "Исходная иллюстрация из книги о дружбе"
                  : "Original illustration from the friendship story"
              }
              fill
              sizes="(max-width: 700px) 90vw, 50vw"
            />
          </div>
          <span className="feature-star" aria-hidden="true">
            ✳
          </span>
        </div>
      </section>
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
