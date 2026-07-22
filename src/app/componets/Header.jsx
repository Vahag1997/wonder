'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Globe2, Menu, Search, ShoppingCart, UserRound, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Header.module.css';

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Books', href: '/books', menu: true },
  { label: 'Stickers', href: '/books' },
  { label: 'My Books', href: '/my-books' },
  { label: 'Support', href: '/support' },
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
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.promo}>
        <span>Save 20% on 2+ books using code</span>
        <strong>EXTRA20</strong>
      </div>

      <div className={styles.navWrap}>
        <button className={styles.mobileMenuButton} type="button" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
        <Link href="/" className={styles.logo} aria-label="WonderWraps home"><WonderLogo /></Link>

        <nav className={styles.nav} aria-label="Main navigation">
          {navigation.map((item) => (
            <Link key={item.label} href={item.href} className={pathname === item.href ? styles.active : ''}>
              {item.label}{item.menu && <ChevronDown size={14} />}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/books" aria-label="Search"><Search /></Link>
          <button type="button" className={styles.currency} aria-label="Currency USD"><Globe2 /><span>USD</span><ChevronDown /></button>
          <Link href={user ? '/account' : '/login'} aria-label={user ? 'My account' : 'Sign in'}><UserRound /></Link>
          <Link href="/orders" className={styles.cart} aria-label="Cart"><ShoppingCart /><span>0</span></Link>
        </div>
      </div>

      <aside className={`${styles.mobilePanel} ${open ? styles.mobilePanelOpen : ''}`} aria-hidden={!open}>
        <div><WonderLogo /><button type="button" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button></div>
        <nav aria-label="Mobile navigation">
          {navigation.map((item) => <Link href={item.href} key={item.label} onClick={() => setOpen(false)}>{item.label}<ChevronDown size={15} /></Link>)}
        </nav>
        <Link href={user ? '/account' : '/login'} onClick={() => setOpen(false)} className={styles.mobileAccount}><UserRound /> {user ? 'My Account' : 'Sign In'}</Link>
      </aside>
      {open && <button type="button" className={styles.backdrop} aria-label="Close menu" onClick={() => setOpen(false)} />}
    </header>
  );
}
