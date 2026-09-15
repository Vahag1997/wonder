"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Menu,
  X,
  Sparkles,
  UserRound,
  Search,
} from "lucide-react";
export default function SiteHeader({ locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const toggle = useRef(null);
  const ru = locale === "ru";
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  const links = [
    ["/", ru ? "Главная" : "Home"],
    ["/books", ru ? "Книги" : "Books"],
    ["/#how-it-works", ru ? "Как это работает" : "How it works"],
    ["/support", ru ? "Помощь" : "Help & answers"],
  ];
  return (
    <>
      <a className="skip-link" href="#main-content">
        {ru ? "Перейти к содержимому" : "Skip to content"}
      </a>
      <aside
        className="announcement"
        aria-label={ru ? "О Wonder" : "About Wonder"}
      >
        <Sparkles size={14} aria-hidden="true" />
        {ru
          ? "Маленькие герои. Незабываемые истории."
          : "Little heroes. Stories to keep forever."}
      </aside>
      <header className="site-header">
        <div className="header-inner wrap">
          <Link
            href="/"
            className="wordmark"
            aria-label={ru ? "Wonder — главная" : "Wonder home"}
          >
            <span className="brand-symbol" aria-hidden="true">
              <BookOpen size={27} strokeWidth={2} />
              <Sparkles size={13} />
            </span>
            wonder
            <span className="brand-star" aria-hidden="true">
              ✦
            </span>
          </Link>
          <nav
            className="desktop-nav"
            aria-label={ru ? "Главное меню" : "Main navigation"}
          >
            {links.map(([href, text]) => (
              <Link
                href={href}
                key={href}
                aria-current={
                  (
                    href === "/"
                      ? pathname === "/"
                      : pathname === href || pathname.startsWith(href + "/")
                  )
                    ? "page"
                    : undefined
                }
              >
                {text}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link
              href="/books#story-search"
              className="icon-button header-search"
              aria-label={ru ? "Найти книгу" : "Find a book"}
            >
              <Search size={21} aria-hidden="true" />
            </Link>
            <button
              className="locale-toggle"
              aria-label={
                ru ? "RU — Switch to English" : "EN — Переключить на русский"
              }
              onClick={() => {
                document.cookie = `wonder-language=${ru ? "en" : "ru"}; Path=/; Max-Age=31536000; SameSite=Lax`;
                router.refresh();
              }}
            >
              {ru ? "RU" : "EN"}
              <span aria-hidden="true">⌄</span>
            </button>
            <Link
              href="/my-books"
              className="library-link"
              aria-label={ru ? "Мои книги" : "My books"}
            >
              <BookOpen size={19} aria-hidden="true" />
              <span>{ru ? "Мои книги" : "My books"}</span>
            </Link>
            <Link
              href="/account"
              className="icon-button"
              aria-label={ru ? "Мой аккаунт" : "My account"}
            >
              <UserRound size={21} aria-hidden="true" />
            </Link>
            <button
              ref={toggle}
              className="icon-button menu-toggle"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={
                open
                  ? ru
                    ? "Закрыть меню"
                    : "Close menu"
                  : ru
                    ? "Открыть меню"
                    : "Open menu"
              }
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          hidden={!open}
          aria-label={ru ? "Мобильное меню" : "Mobile navigation"}
          onClick={(e) => {
            if (e.target.closest("a")) setOpen(false);
          }}
        >
          {links.map(([href, text]) => (
            <Link href={href} key={href}>
              {text}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          ))}
          <Link href="/my-books">
            {ru ? "Мои книги" : "My books"}
            <BookOpen size={18} aria-hidden="true" />
          </Link>
        </nav>
      </header>
    </>
  );
}
