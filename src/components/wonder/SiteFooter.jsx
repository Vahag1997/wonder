import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BrandLogo from "./BrandLogo";
export default function SiteFooter({ locale }) {
  const ru = locale === "ru";
  return (
    <footer className="site-footer">
      <div className="wrap footer-top">
        <div>
          <Link href="/" className="wordmark magicbook-brand-link" aria-label={ru ? "MagicBook — главная" : "MagicBook home"}>
            <BrandLogo full />
          </Link>
          <p>
            {ru
              ? "Для маленьких героев\nс большим воображением."
              : "For little people\nwith big imaginations."}
          </p>
        </div>
        <div className="footer-links">
          <div>
            <h2>{ru ? "Откройте" : "Explore"}</h2>
            <Link href="/books">{ru ? "Наши истории" : "Our stories"}</Link>
            <Link href="/#how-it-works">
              {ru ? "Как это работает" : "How it works"}
            </Link>
            <Link href="/my-books">{ru ? "Мои книги" : "My books"}</Link>
          </div>
          <div>
            <h2>{ru ? "Мы рядом" : "Here to help"}</h2>
            <Link href="/support">
              {ru ? "Вопросы и ответы" : "Questions & answers"}
            </Link>
            <Link href="/orders">{ru ? "Мои заказы" : "My orders"}</Link>
            <Link href="/account">{ru ? "Мой аккаунт" : "My account"}</Link>
          </div>
        </div>
      </div>
      <div className="wrap footer-invitation">
        <span aria-hidden="true">✳</span>
        <h2>
          {ru
            ? "Большое приключение для маленького героя"
            : "A big adventure for a little hero"}
        </h2>
        <Link className="text-link" href="/books">
          {ru ? "Заглянуть на полку" : "Explore the bookshelf"}
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} MagicBook.</span>
        <span>
          {ru
            ? "Демонстрация · Оплата пока недоступна"
            : "Preview · Checkout is not yet open"}
        </span>
        <span>
          {ru ? "Создано с воображением." : "Made with a little imagination."}
        </span>
      </div>
    </footer>
  );
}
