'use client';

import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import { WonderLogo } from './Header';
import styles from './Footer.module.css';

export default function Footer() {
  const { currentLanguage } = useLanguage();
  const ui = currentLanguage === 'ru'
    ? {
        tagline: 'Персонализированные книги для ваших маленьких героев!',
        about: 'О WonderWraps',
        contact: 'Связаться с нами',
        faq: 'Частые вопросы',
        blog: 'Блог',
        support: 'Поддержка',
        customer: 'Личный кабинет',
        account: 'Мой аккаунт',
        orders: 'Заказы',
        terms: 'Условия',
        privacy: 'Политика конфиденциальности',
        newsletter: 'Подпишитесь на нашу рассылку',
        newsletterCopy: 'Не пропускайте новые книги',
        email: 'Введите email',
        subscribe: 'Подписаться',
      }
    : {
        tagline: 'Personalised books made for your little ones!',
        about: 'About WonderWraps',
        contact: 'Contact us',
        faq: 'FAQs',
        blog: 'Blog',
        support: 'Support',
        customer: 'Customer Area',
        account: 'My Account',
        orders: 'Orders',
        terms: 'Terms',
        privacy: 'Privacy Policy',
        newsletter: 'Subscribe to Our Newsletter',
        newsletterCopy: 'Don’t miss out on the newest books',
        email: 'Enter your email',
        subscribe: 'Subscribe',
      };

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brandColumn}>
          <Link href="/" aria-label="WonderWraps home"><WonderLogo /></Link>
          <p>{ui.tagline}</p>
          <div className={styles.socials}>
            <a href="#" aria-label="Instagram"><Instagram /></a>
            <a href="#" aria-label="Facebook"><Facebook /></a>
            <a href="#" aria-label="TikTok"><FaTiktok /></a>
          </div>
        </div>

        <FooterLinks title={ui.about} links={[[ui.contact, "/support"], [ui.faq, "/support"], [ui.blog, "/"], [ui.support, "/support"]]} />
        <FooterLinks title={ui.customer} links={[[ui.account, "/account"], [ui.orders, "/orders"], [ui.terms, "/support"], [ui.privacy, "/support"]]} />

        <div className={styles.newsletter}>
          <h3>{ui.newsletter}</h3>
          <p>{ui.newsletterCopy}</p>
          <form onSubmit={(event) => event.preventDefault()}>
            <label className="sr-only" htmlFor="footer-email">{ui.email}</label>
            <input id="footer-email" type="email" placeholder={ui.email} />
            <button type="submit">{ui.subscribe}</button>
          </form>
          <div className={styles.payments}><span>PayPal</span><span className={styles.mastercard}>●●</span><span>VISA</span></div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }) {
  return (
    <div className={styles.links}>
      <h3>{title}</h3>
      {links.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
    </div>
  );
}
