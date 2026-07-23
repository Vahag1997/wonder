'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Globe2, Menu, Search, ShoppingCart, UserRound, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './Header.module.css';

const navigation = [
  { en: 'Home', ru: 'Главная', href: '/' },
  { en: 'Books', ru: 'Книги', href: '/books', menu: true },
  { en: 'Stickers', ru: 'Стикеры', href: '/books' },
  { en: 'My Books', ru: 'Мои книги', href: '/my-books' },
  { en: 'Support', ru: 'Поддержка', href: '/support' },
];

export function WonderLogo() {
  return (
    <span className={styles.logoMark} aria-hidden="true">
      <span className={styles.wIcon}>W</span>
      <span className={styles.wordmark}>wonder<br /><b>wrapz</b></span>
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const isRu = currentLanguage === 'ru';
  const ui = isRu
    ? {
        promo: 'Скидка 20% на 2+ книги по коду',
        search: 'Поиск',
        signIn: 'Войти',
        account: 'Мой аккаунт',
        cart: 'Корзина',
        openMenu: 'Открыть меню',
        closeMenu: 'Закрыть меню',
      }
    : {
        promo: 'Save 20% on 2+ books with code',
        search: 'Search',
        signIn: 'Sign in',
        account: 'My account',
        cart: 'Cart',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
      };

  return (
    <header className={styles.header}>
      <div className={styles.promo}>
        <span>{ui.promo}</span>
        <strong>EXTRA20</strong>
      </div>

      <div className={styles.navWrap}>
        <button className={styles.mobileMenuButton} type="button" onClick={() => setOpen(true)} aria-label={ui.openMenu}><Menu /></button>
        <Link href="/" className={styles.logo} aria-label="WonderWraps home"><WonderLogo /></Link>

        <nav className={styles.nav} aria-label="Main navigation">
          {navigation.map((item) => (
            <Link key={item.en} href={item.href} className={pathname === item.href ? styles.active : ''}>
              {item[currentLanguage]}{item.menu && <ChevronDown size={14} />}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/books" aria-label={ui.search}><Search /></Link>
          <button type="button" className={styles.currency} aria-label="Currency USD"><Globe2 /><span>USD</span><ChevronDown /></button>
          <LanguageSwitch currentLanguage={currentLanguage} changeLanguage={changeLanguage} />
          <Link href={user ? '/account' : '/login'} aria-label={user ? ui.account : ui.signIn}><UserRound /></Link>
          <Link href="/orders" className={styles.cart} aria-label={ui.cart}><ShoppingCart /><span>0</span></Link>
        </div>
      </div>

      <aside className={`${styles.mobilePanel} ${open ? styles.mobilePanelOpen : ''}`} aria-hidden={!open}>
        <div><WonderLogo /><button type="button" onClick={() => setOpen(false)} aria-label={ui.closeMenu}><X /></button></div>
        <LanguageSwitch currentLanguage={currentLanguage} changeLanguage={changeLanguage} mobile />
        <nav aria-label="Mobile navigation">
          {navigation.map((item) => <Link href={item.href} key={item.en} onClick={() => setOpen(false)}>{item[currentLanguage]}<ChevronDown size={15} /></Link>)}
        </nav>
        <Link href={user ? '/account' : '/login'} onClick={() => setOpen(false)} className={styles.mobileAccount}><UserRound /> {user ? ui.account : ui.signIn}</Link>
      </aside>
      {open && <button type="button" className={styles.backdrop} aria-label={ui.closeMenu} onClick={() => setOpen(false)} />}
    </header>
  );
}

function LanguageSwitch({ currentLanguage, changeLanguage, mobile = false }) {
  return (
    <div className={`${styles.languageSwitch} ${mobile ? styles.languageSwitchMobile : ''}`} aria-label="Language">
      <button type="button" className={currentLanguage === 'en' ? styles.languageActive : ''} onClick={() => changeLanguage('en')} aria-pressed={currentLanguage === 'en'}>EN</button>
      <span />
      <button type="button" className={currentLanguage === 'ru' ? styles.languageActive : ''} onClick={() => changeLanguage('ru')} aria-pressed={currentLanguage === 'ru'}>RU</button>
    </div>
  );
}
