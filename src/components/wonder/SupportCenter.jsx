"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpRight,
  Camera,
  BookOpen,
  ShieldCheck,
  CircleHelp,
} from "lucide-react";
export default function SupportCenter({ locale }) {
  const ru = locale === "ru";
  const [query, setQuery] = useState("");
  const items = useMemo(
    () => [
      [
        ru ? "Какое фото лучше выбрать?" : "What photo should I choose?",
        ru
          ? "Резкий снимок одного ребёнка при ровном дневном свете. Лицо должно быть видно целиком, без фильтров и солнцезащитных очков. Форматы: JPG, PNG или WebP, до 10 МБ."
          : "Choose a sharp photo of one child in even daylight. Keep the whole face visible and avoid filters or sunglasses. JPG, PNG, or WebP, up to 10 MB.",
      ],
      [
        ru
          ? "Можно ли уже создать и оплатить книгу?"
          : "Can I generate and pay for a book now?",
        ru
          ? "Пока нет. Это закрытая демонстрация сайта. Можно выбрать историю и проверить данные, но генерация, оплата и доставка не подключены."
          : "Not yet. This is a private website preview. You can choose a story and review details, but generation, payments, and shipping are not connected.",
      ],
      [
        ru ? "Что я увижу до оплаты?" : "What will I see before paying?",
        ru
          ? "После подключения генерации — две страницы с вашим ребёнком в стиле выбранной книги. После оплаты они останутся в полной книге, а остальные страницы будут созданы отдельно. Сейчас в демо показаны только исходные иллюстрации, не персонализированный результат."
          : "Once generation is connected, you’ll see two pages with your child in the selected book’s style. Payment starts the remaining pages; the preview pages are reused. The current demo shows original illustrations, not personalized results.",
      ],
      [
        ru ? "Что входит в покупку?" : "What does the purchase include?",
        ru
          ? "Планируется разовая покупка персонализированной цифровой книги в PDF, без подписки. Печать и доставка не включены. Итоговая цена будет показана до оплаты. Цены в тестовой оплате — только примеры."
          : "The planned purchase is a personalized digital PDF book, paid once with no subscription. Printing and shipping are not included. The total is shown before payment. Test checkout prices are examples only.",
      ],
      [
        ru
          ? "Где хранится фото в демонстрации?"
          : "Where does my photo go in this preview?",
        ru
          ? "Фото остаётся в памяти текущей вкладки. Оно не отправляется на сервер и не сохраняется в localStorage. После закрытия или перезагрузки вкладки выберите его заново."
          : "It stays in the memory of your current browser tab. It is not uploaded to a server or stored in localStorage. Select it again after closing or reloading the tab.",
      ],
      [
        ru ? "Можно ли изменить имя?" : "Can I change the child’s name?",
        ru
          ? "Да. Нажмите «Изменить данные» на шаге проверки. Имя должно содержать до 40 букв, пробелов, апострофов или дефисов. Проверка вёрстки книги выполняется отдельно на стороне генератора."
          : "Yes. Choose “Edit their details” on the review step. Use up to 40 letters, spaces, apostrophes, or hyphens. The generator performs a separate book-layout check.",
      ],
      [
        ru ? "На каких языках есть истории?" : "Which languages are available?",
        ru
          ? "У каждого образца указан язык исходного PDF. История Амира — на русском, два других образца — на английском. Переключатель EN/RU меняет только интерфейс сайта."
          : "Each sample lists the language of its source PDF. Amir’s story is Russian; the other two references are English. The EN/RU switch changes the website, not the book.",
      ],
      [
        ru
          ? "Почему на образце написано Wonderwraps?"
          : "Why do some samples say Wonderwraps?",
        ru
          ? "Два предоставленных PDF — референсы с исходным брендингом. Они не продаются как книги Wonder. До запуска нужны разрешённые к продаже дизайнерские материалы."
          : "Two supplied PDFs are reference books with their original branding. They are not offered for sale as Wonder books. The launch catalogue needs artwork cleared for commercial use.",
      ],
      [
        ru ? "Как связаться с поддержкой?" : "How can I contact support?",
        ru
          ? "Почта поддержки ещё не подключена в этой демонстрации. Сообщите владельцу сайта, на каком шаге возникла проблема. Не отправляйте детские фотографии или пароли в сообщении."
          : "The support inbox is not connected in this private preview. Tell the site owner which step caused a problem. Do not include child photos or passwords in your message.",
      ],
    ],
    [ru],
  );
  const filtered = items.filter(([q, a]) =>
    `${q} ${a}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  return (
    <section className="section wrap support-page">
      <div className="center-heading">
        <p className="eyebrow">
          {ru ? "Мы поможем разобраться" : "A little help, right here"}
        </p>
        <h1>
          {ru
            ? "Хорошие вопросы.\nПонятные ответы."
            : "Good questions.\nThoughtful answers."}
        </h1>
        <p>
          {ru
            ? "Всё о фотографиях, историях и демонстрации."
            : "A few helpful things about photos, stories, and this preview."}
        </p>
      </div>
      <div className="help-topics">
        {[
          [Camera, ru ? "Фотографии" : "Photos"],
          [BookOpen, ru ? "Наши истории" : "Our stories"],
          [ShieldCheck, ru ? "Конфиденциальность" : "Privacy"],
        ].map(([Icon, label]) => (
          <span key={label}>
            <Icon size={21} />
            {label}
          </span>
        ))}
      </div>
      <div className="support-search search-field">
        <Search size={19} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={ru ? "Поиск по вопросам…" : "Search your questions…"}
          aria-label={ru ? "Поиск по вопросам" : "Search help questions"}
          maxLength={150}
        />
      </div>
      <p className="subtle center" aria-live="polite">
        {filtered.length} {ru ? "ответов" : "answers"}
      </p>
      <div className="faq-list support-faq">
        {filtered.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <CircleHelp size={35} />
          <h2>
            {ru ? "Попробуйте другой вопрос." : "Let’s try another question."}
          </h2>
          <button
            className="button button-outline"
            onClick={() => setQuery("")}
          >
            {ru ? "Показать все ответы" : "Show all answers"}
          </button>
        </div>
      )}
      <div className="support-end">
        <p>{ru ? "Готовы найти свою историю?" : "Ready for the fun part?"}</p>
        <Link href="/books" className="button">
          {ru ? "Посмотреть истории" : "Explore the stories"}
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}
